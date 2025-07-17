'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Brain, Clock, Flag, BookOpen } from 'lucide-react'
import { QuizSession, Question } from '@/types/quiz'
import QuestionDisplay from './QuestionDisplay'
import QuizResults from './QuizResults'

interface QuizInterfaceProps {
  quiz: QuizSession
  onQuizUpdate: (quiz: QuizSession) => void
}

const LOCAL_STORAGE_KEY = 'quizgen_progress'

export default function QuizInterface({ quiz, onQuizUpdate }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(quiz.questions[quiz.currentQuestionIndex])
  const [userAnswer, setUserAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)
  const [mode, setMode] = useState<'study' | 'test'>(quiz.mode || 'study')

  // Restore progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.id === quiz.id) {
          onQuizUpdate(parsed)
        }
      } catch {}
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quiz))
  }, [quiz])

  useEffect(() => {
    setCurrentQuestion(quiz.questions[quiz.currentQuestionIndex])
    setUserAnswer('')
    setShowExplanation(false)
    setExplanation('')
    setQuestionStartTime(Date.now())
  }, [quiz.currentQuestionIndex, quiz.questions])

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return

    const timeSpent = Date.now() - questionStartTime
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()
    
    const newAnswers = [...quiz.answers]
    newAnswers[quiz.currentQuestionIndex] = userAnswer

    const newScore = isCorrect ? quiz.score + 1 : quiz.score

    const updatedQuiz: QuizSession = {
      ...quiz,
      answers: newAnswers,
      score: newScore,
      mode,
    }

    onQuizUpdate(updatedQuiz)
  }

  const handleNextQuestion = () => {
    if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
      const updatedQuiz: QuizSession = {
        ...quiz,
        currentQuestionIndex: quiz.currentQuestionIndex + 1,
        mode,
      }
      onQuizUpdate(updatedQuiz)
    } else {
      // Quiz completed
      const completedQuiz: QuizSession = {
        ...quiz,
        endTime: new Date(),
        mode,
      }
      onQuizUpdate(completedQuiz)
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (quiz.currentQuestionIndex > 0) {
      const updatedQuiz: QuizSession = {
        ...quiz,
        currentQuestionIndex: quiz.currentQuestionIndex - 1,
        mode,
      }
      onQuizUpdate(updatedQuiz)
    }
  }

  const handleToggleMarkForReview = () => {
    const newMarkForReview = [...quiz.markForReview]
    newMarkForReview[quiz.currentQuestionIndex] = !newMarkForReview[quiz.currentQuestionIndex]
    onQuizUpdate({ ...quiz, markForReview: newMarkForReview })
  }

  const getExplanation = async () => {
    if (explanation) {
      setShowExplanation(!showExplanation)
      return
    }

    setIsLoadingExplanation(true)
    try {
      const response = await fetch('/api/get-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.text,
          userAnswer: userAnswer,
          correctAnswer: currentQuestion.correctAnswer,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setExplanation(data.explanation)
        setShowExplanation(true)
      }
    } catch (error) {
      console.error('Failed to get explanation:', error)
    } finally {
      setIsLoadingExplanation(false)
    }
  }

  if (showResults) {
    return (
      <QuizResults 
        quiz={quiz}
        onRetake={() => {
          const resetQuiz: QuizSession = {
            ...quiz,
            currentQuestionIndex: 0,
            answers: [],
            score: 0,
            startTime: new Date(),
            endTime: undefined,
            markForReview: Array(quiz.questions.length).fill(false),
            mode,
          }
          onQuizUpdate(resetQuiz)
          setShowResults(false)
        }}
      />
    )
  }

  const progress = ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100
  const hasAnswered = quiz.answers[quiz.currentQuestionIndex]
  const isCorrect = !!(hasAnswered && 
    hasAnswered.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim())
  const isMarkedForReview = quiz.markForReview[quiz.currentQuestionIndex]

  return (
    <div className="card">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-gray-700">Mode:</span>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${mode === 'study' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMode('study')}
          >
            Study
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${mode === 'test' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMode('test')}
          >
            Test
          </button>
        </div>
        <button
          onClick={handleToggleMarkForReview}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-semibold border ${isMarkedForReview ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
        >
          <Flag className="w-4 h-4" />
          <span>{isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
        </button>
      </div>

      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {quiz.currentQuestionIndex + 1} of {quiz.questions.length}
            {isMarkedForReview && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Review</span>
            )}
          </span>
          <span className="text-sm font-medium text-gray-700">
            Score: {quiz.score}/{quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Display */}
      <QuestionDisplay 
        question={currentQuestion}
        userAnswer={userAnswer}
        onAnswerChange={setUserAnswer}
        hasAnswered={!!hasAnswered}
        isCorrect={isCorrect}
      />

      {/* Answer Feedback */}
      {hasAnswered && (mode === 'study' || quiz.currentQuestionIndex === quiz.questions.length - 1) && (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Your answer:</span> {hasAnswered}
          </p>
          {!isCorrect && (
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-medium">Correct answer:</span> {currentQuestion.correctAnswer}
            </p>
          )}
          {/* Explanation Button */}
          <button
            onClick={getExplanation}
            disabled={isLoadingExplanation}
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <Brain className="w-4 h-4" />
            <span>
              {isLoadingExplanation ? 'Loading explanation...' : 
               showExplanation ? 'Hide explanation' : 'Get AI explanation'}
            </span>
          </button>

          {showExplanation && explanation && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-800">{explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={quiz.currentQuestionIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          {!hasAnswered && (
            <button
              onClick={handleAnswerSubmit}
              disabled={!userAnswer.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          )}
          
          {hasAnswered && (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              {quiz.currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}