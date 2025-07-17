import { NextRequest, NextResponse } from 'next/server'
import { createWorker } from 'tesseract.js'
import pdf from 'pdf-parse'
import { Question } from '@/types/quiz'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf') as File

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text from PDF
    let text = ''
    try {
      const pdfData = await pdf(buffer)
      text = pdfData.text
    } catch (error) {
      // If PDF parsing fails, try OCR
      console.log('PDF parsing failed, attempting OCR...')
      try {
        const worker = await createWorker({
          logger: m => console.log(m) // Optional logging
        })
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        const { data: { text: ocrText } } = await worker.recognize(buffer)
        text = ocrText
        await worker.terminate()
      } catch (ocrError) {
        console.error('OCR failed:', ocrError)
        return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 400 })
      }
    }

    // Parse questions from text
    const questions = parseQuestionsFromText(text)

    return NextResponse.json({
      questions,
      processingTime: Date.now(),
      confidence: 0.85,
    })
  } catch (error) {
    console.error('Error processing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    )
  }
}

function parseQuestionsFromText(text: string): Question[] {
  const questions: Question[] = []
  const lines = text.split('\n').filter(line => line.trim())
  
  let currentQuestion: Partial<Question> | null = null
  let questionNumber = 1
  let currentCategory: string | undefined = undefined

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detect section/category headers
    const category = detectCategory(line)
    if (category) {
      currentCategory = category
      continue
    }
    
    // Enhanced question detection
    if (isQuestionLine(line)) {
      if (currentQuestion && currentQuestion.text) {
        questions.push(createQuestionFromPartial(currentQuestion, questionNumber++, currentCategory))
      }
      
      currentQuestion = {
        id: `q${questionNumber}`,
        text: line,
        type: 'multiple-choice',
        options: [],
        correctAnswer: '',
        category: currentCategory,
      }
    }
    // Check if line looks like an answer option (starts with A, B, C, D, etc.)
    else if (currentQuestion && isAnswerOption(line)) {
      if (!currentQuestion.options) currentQuestion.options = []
      currentQuestion.options.push(line)
    }
    // Check if line contains the correct answer indicator
    else if (currentQuestion && isCorrectAnswerLine(line)) {
      currentQuestion.correctAnswer = extractCorrectAnswer(line, currentQuestion.options || [])
    }
  }

  // Add the last question if exists
  if (currentQuestion && currentQuestion.text) {
    questions.push(createQuestionFromPartial(currentQuestion, questionNumber, currentCategory))
  }

  // If no structured questions found, create simple questions from text
  if (questions.length === 0) {
    return createSimpleQuestionsFromText(text)
  }

  return questions
}

function detectCategory(line: string): string | undefined {
  const categories = [
    { name: 'Anatomy', pattern: /anatomy/i },
    { name: 'Physiology', pattern: /physiology/i },
    { name: 'Pathology', pattern: /pathology/i },
    { name: 'Pharmacology', pattern: /pharmacology/i },
    { name: 'Microbiology', pattern: /microbiology/i },
    { name: 'Short Answer', pattern: /short answer/i },
  ]
  for (const cat of categories) {
    if (cat.pattern.test(line)) return cat.name
  }
  return undefined
}

function isQuestionLine(line: string): boolean {
  const questionPatterns = [
    /^\d+\./, // Number followed by dot
    /^\d+\)/, // Number followed by parenthesis
    /^[A-Z]\./, // Letter followed by dot
    /\?$/, // Ends with question mark
    /^(what|which|when|where|why|how)/i, // Starts with question words
    /^Question\s*\d+:/i, // "Question 1:"
    /^MCQ\s*\d+:/i, // "MCQ 1:"
  ]
  return questionPatterns.some(pattern => pattern.test(line))
}

function isAnswerOption(line: string): boolean {
  const optionPatterns = [
    /^[A-D]\./, // A, B, C, D followed by dot
    /^[A-D]\)/, // A, B, C, D followed by parenthesis
    /^[a-d]\./, // a, b, c, d followed by dot
    /^[a-d]\)/, // a, b, c, d followed by parenthesis
  ]
  
  return optionPatterns.some(pattern => pattern.test(line))
}

function isCorrectAnswerLine(line: string): boolean {
  const correctPatterns = [
    /correct.*answer/i,
    /answer.*correct/i,
    /key.*answer/i,
    /answer.*key/i,
    /^answer:/i,
    /^correct:/i,
  ]
  
  return correctPatterns.some(pattern => pattern.test(line))
}

function extractCorrectAnswer(line: string, options: string[]): string {
  // Try to find the correct answer from the line
  const answerMatch = line.match(/[A-D]/i)
  if (answerMatch) {
    const answerIndex = answerMatch[0].toUpperCase().charCodeAt(0) - 65 // A=0, B=1, etc.
    if (options[answerIndex]) {
      return options[answerIndex].replace(/^[A-D][.)]\s*/, '') // Remove option letter
    }
  }
  
  // If no match found, return the first option as default
  return options[0] ? options[0].replace(/^[A-D][.)]\s*/, '') : 'Answer not found'
}

function createQuestionFromPartial(partial: Partial<Question>, number: number, category?: string): Question {
  return {
    id: partial.id || `q${number}`,
    text: partial.text || `Question ${number}`,
    type: partial.type || 'multiple-choice',
    options: partial.options || ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: partial.correctAnswer || 'Answer not found',
    category: partial.category || category || 'Medical',
    difficulty: partial.difficulty || 'medium',
  }
}

function createSimpleQuestionsFromText(text: string): Question[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const questions: Question[] = []
  
  for (let i = 0; i < Math.min(sentences.length, 10); i++) {
    const sentence = sentences[i].trim()
    if (sentence.length > 10) {
      questions.push({
        id: `q${i + 1}`,
        text: sentence + '?',
        type: 'short-answer',
        correctAnswer: 'Answer varies',
        category: 'Medical',
        difficulty: 'medium',
      })
    }
  }
  
  return questions
}