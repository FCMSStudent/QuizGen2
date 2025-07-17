'use client'

import { useState, useEffect } from 'react'
import { QuizSession, Question, ProgressStats } from '@/types/quiz'

export class DatabaseManager {
  private static readonly QUIZ_SESSIONS_KEY = 'quizgen_sessions'
  private static readonly PROGRESS_KEY = 'quizgen_progress'

  static saveQuizSession(session: QuizSession): void {
    try {
      const sessions = this.getAllSessions()
      const existingIndex = sessions.findIndex(s => s.id === session.id)
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session
      } else {
        sessions.push(session)
      }
      
      localStorage.setItem(this.QUIZ_SESSIONS_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving quiz session:', error)
    }
  }

  static getAllSessions(): QuizSession[] {
    try {
      const stored = localStorage.getItem(this.QUIZ_SESSIONS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading quiz sessions:', error)
      return []
    }
  }

  static getSession(id: string): QuizSession | null {
    const sessions = this.getAllSessions()
    return sessions.find(s => s.id === id) || null
  }

  static deleteSession(id: string): void {
    try {
      const sessions = this.getAllSessions()
      const filtered = sessions.filter(s => s.id !== id)
      localStorage.setItem(this.QUIZ_SESSIONS_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting quiz session:', error)
    }
  }

  static getProgressStats(): ProgressStats {
    const sessions = this.getAllSessions()
    const completedSessions = sessions.filter(s => s.endTime)
    
    let totalQuestions = 0
    let answeredQuestions = 0
    let correctAnswers = 0
    let totalTime = 0

    completedSessions.forEach(session => {
      totalQuestions += session.questions.length
      answeredQuestions += session.answers.length
      correctAnswers += session.score
      
      if (session.startTime && session.endTime) {
        totalTime += new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
      }
    })

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracy: answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0,
      averageTime: totalQuestions > 0 ? totalTime / totalQuestions / 1000 : 0, // in seconds
    }
  }

  static exportData(): string {
    const sessions = this.getAllSessions()
    return JSON.stringify({
      sessions,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }, null, 2)
  }

  static importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        localStorage.setItem(this.QUIZ_SESSIONS_KEY, JSON.stringify(parsed.sessions))
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

interface DatabaseManagerProps {
  children?: React.ReactNode
}

export default function DatabaseManagerProvider({ children }: DatabaseManagerProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize database manager
    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 