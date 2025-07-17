import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer } = await request.json()

    if (!question || !userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    const prompt = `You are a medical education expert. Please provide a clear, educational explanation for the following question:

Question: ${question}
Student's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
Is the student's answer correct? ${isCorrect ? 'Yes' : 'No'}

Please provide:
1. A brief explanation of why the correct answer is right
2. If the student was wrong, explain why their answer was incorrect
3. Key medical concepts related to this question
4. A helpful study tip for remembering this information

Keep the explanation concise but educational, suitable for medical students studying for board exams.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical education assistant. Provide clear, accurate explanations for medical questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const explanation = completion.choices[0]?.message?.content || 'Unable to generate explanation'

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('Error getting explanation:', error)
    
    // Get the request data again for fallback
    const { question, userAnswer, correctAnswer } = await request.json()
    
    // Fallback explanation if OpenAI API fails
    const fallbackExplanation = `This is a fallback explanation. The correct answer is "${correctAnswer}". Review the question carefully and consider the key medical concepts involved. For more detailed explanations, please try again later.`
    
    return NextResponse.json({ explanation: fallbackExplanation })
  }
}