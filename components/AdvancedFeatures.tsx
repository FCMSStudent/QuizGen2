'use client'

import { useState } from 'react'
import { Settings, Filter, BarChart3, Download, Upload, BookOpen, Target, Clock } from 'lucide-react'
import { QuizSession, Question, ProgressStats } from '@/types/quiz'
import { DatabaseManager } from './DatabaseManager'

interface AdvancedFeaturesProps {
  questions: Question[]
  onFilteredQuestions: (questions: Question[]) => void
  onModeChange: (mode: 'study' | 'test') => void
  currentMode: 'study' | 'test'
}

export default function AdvancedFeatures({ 
  questions, 
  onFilteredQuestions, 
  onModeChange, 
  currentMode 
}: AdvancedFeaturesProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    type: 'all',
  })
  const [stats, setStats] = useState<ProgressStats | null>(null)

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    
    const filtered = questions.filter(q => {
      if (newFilters.category !== 'all' && q.category !== newFilters.category) return false
      if (newFilters.difficulty !== 'all' && q.difficulty !== newFilters.difficulty) return false
      if (newFilters.type !== 'all' && q.type !== newFilters.type) return false
      return true
    })
    
    onFilteredQuestions(filtered)
  }

  const loadStats = () => {
    const progressStats = DatabaseManager.getProgressStats()
    setStats(progressStats)
  }

  const exportData = () => {
    const data = DatabaseManager.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quizgen-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result as string
        if (DatabaseManager.importData(data)) {
          alert('Data imported successfully!')
        } else {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const categories = Array.from(new Set(questions.map(q => q.category).filter(Boolean)))
  const difficulties = Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean)))

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Mode</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => onModeChange('study')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentMode === 'study' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Mode</span>
          </button>
          <button
            onClick={() => onModeChange('test')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentMode === 'test' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Test Mode</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentMode === 'study' 
            ? 'Review questions with immediate feedback and explanations' 
            : 'Take timed tests without immediate feedback'}
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Questions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="input-field"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Analytics */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Progress Analytics</h3>
          </div>
          <button
            onClick={loadStats}
            className="btn-secondary text-sm"
          >
            Refresh Stats
          </button>
        </div>
        
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageTime.toFixed(1)}s</div>
              <div className="text-sm text-gray-600">Avg. Time</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Click "Refresh Stats" to view your progress analytics.</p>
        )}
      </div>

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 btn-secondary"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          
          <label className="flex items-center space-x-2 btn-secondary cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Export your quiz progress and settings, or import data from another device.
        </p>
      </div>
    </div>
  )
} 