'use client'

import { useState } from 'react'
import { Upload, FileText, Brain, Trophy, BarChart3 } from 'lucide-react'
import PDFUploader from '@/components/PDFUploader'
import QuizInterface from '@/components/QuizInterface'
import ProgressTracker from '@/components/ProgressTracker'
import AdvancedFeatures from '@/components/AdvancedFeatures'
import DatabaseManagerProvider from '@/components/DatabaseManager'
import { Question, QuizSession } from '@/types/quiz'

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<QuizSession | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [quizMode, setQuizMode] = useState<'study' | 'test'>('study')

  const handleQuestionsGenerated = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions)
    setFilteredQuestions(generatedQuestions)
    setCurrentQuiz({
      id: Date.now().toString(),
      questions: generatedQuestions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: new Date(),
      markForReview: Array(generatedQuestions.length).fill(false),
      mode: quizMode,
    })
  }

  const handleModeChange = (mode: 'study' | 'test') => {
    setQuizMode(mode)
    if (currentQuiz) {
      setCurrentQuiz({ ...currentQuiz, mode })
    }
  }

  const handleFilteredQuestions = (filtered: Question[]) => {
    setFilteredQuestions(filtered)
    if (currentQuiz) {
      setCurrentQuiz({
        ...currentQuiz,
        questions: filtered,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        markForReview: Array(filtered.length).fill(false),
      })
    }
  }

  return (
    <DatabaseManagerProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QuizGen
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform PDF question banks into interactive quizzes for medical students
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="card text-center">
              <Upload className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">PDF Upload</h3>
              <p className="text-sm text-gray-600">Upload scanned documents with OCR support</p>
            </div>
            <div className="card text-center">
              <FileText className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Parsing</h3>
              <p className="text-sm text-gray-600">Automatic question and answer extraction</p>
            </div>
            <div className="card text-center">
              <Brain className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Explanations</h3>
              <p className="text-sm text-gray-600">Get detailed explanations with ChatGPT</p>
            </div>
            <div className="card text-center">
              <Trophy className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your performance and progress</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Upload and Advanced Features */}
          <div className="lg:col-span-1 space-y-6">
            {!currentQuiz && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upload PDF Question Bank
                </h2>
                <PDFUploader 
                  onQuestionsGenerated={handleQuestionsGenerated}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            )}
            
            {currentQuiz && (
              <ProgressTracker 
                quiz={currentQuiz}
                onReset={() => {
                  setCurrentQuiz(null)
                  setQuestions([])
                  setFilteredQuestions([])
                }}
              />
            )}

            {questions.length > 0 && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Features</span>
                </button>
                
                {showAdvanced && (
                  <AdvancedFeatures
                    questions={questions}
                    onFilteredQuestions={handleFilteredQuestions}
                    onModeChange={handleModeChange}
                    currentMode={quizMode}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right column - Quiz Interface */}
          <div className="lg:col-span-2">
            {currentQuiz ? (
              <QuizInterface 
                quiz={currentQuiz}
                onQuizUpdate={setCurrentQuiz}
              />
            ) : (
              <div className="card text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Start?
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload a PDF question bank to begin creating your interactive quiz
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-600 font-semibold">1</span>
                    </div>
                    <p className="text-sm text-gray-600">Upload PDF</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-400 font-semibold">2</span>
                    </div>
                    <p className="text-sm text-gray-600">Process Questions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-400 font-semibold">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Start Quiz</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DatabaseManagerProvider>
  )
}