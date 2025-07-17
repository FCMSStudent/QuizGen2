'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Question } from '@/types/quiz'

interface PDFUploaderProps {
  onQuestionsGenerated: (questions: Question[]) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export default function PDFUploader({ 
  onQuestionsGenerated, 
  isProcessing, 
  setIsProcessing 
}: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setError(null)
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file')
      return
    }

    // Removed file size limit check

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process PDF')
      }

      const result = await response.json()
      onQuestionsGenerated(result.questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 text-primary-600 mx-auto animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing PDF...
                </h3>
                <p className="text-sm text-gray-600">
                  Extracting questions and answers using OCR
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Question Bank
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Supports scanned documents with OCR</p>
                  <p>• Automatic question and answer extraction</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Processing steps:</span>
            <span>1/3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '33%' }}></div>
          </div>
          <div className="text-xs text-gray-500">
            <p>• Extracting text from PDF</p>
            <p>• Identifying questions and answers</p>
            <p>• Generating interactive quiz format</p>
          </div>
        </div>
      )}
    </div>
  )
}