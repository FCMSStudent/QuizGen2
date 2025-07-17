// Demo Script for QuizGen Application
// This script helps create a demo session using the sample questions

// Sample questions data that matches the format expected by the application
const demoQuestions = [
  {
    id: "q1",
    text: "What is the primary function of the heart?",
    type: "multiple-choice",
    options: [
      "To produce blood cells",
      "To pump blood throughout the body",
      "To filter waste products",
      "To store oxygen"
    ],
    correctAnswer: "To pump blood throughout the body",
    category: "Anatomy",
    difficulty: "medium"
  },
  {
    id: "q2",
    text: "Which of the following is NOT a function of the liver?",
    type: "multiple-choice",
    options: [
      "Detoxification",
      "Protein synthesis",
      "Oxygen transport",
      "Bile production"
    ],
    correctAnswer: "Oxygen transport",
    category: "Anatomy",
    difficulty: "medium"
  },
  {
    id: "q3",
    text: "What is the normal range for blood pressure in adults?",
    type: "multiple-choice",
    options: [
      "90/60 - 120/80 mmHg",
      "140/90 - 160/100 mmHg",
      "180/110 - 200/120 mmHg",
      "60/40 - 80/60 mmHg"
    ],
    correctAnswer: "90/60 - 120/80 mmHg",
    category: "Physiology",
    difficulty: "easy"
  },
  {
    id: "q4",
    text: "Which hormone is responsible for regulating blood glucose levels?",
    type: "multiple-choice",
    options: [
      "Insulin",
      "Testosterone",
      "Estrogen",
      "Thyroxine"
    ],
    correctAnswer: "Insulin",
    category: "Physiology",
    difficulty: "easy"
  },
  {
    id: "q5",
    text: "What are the three main types of blood vessels in the human body?",
    type: "short-answer",
    correctAnswer: "Arteries, veins, and capillaries",
    category: "Anatomy",
    difficulty: "medium"
  }
];

// Function to create a demo quiz session
function createDemoSession() {
  const demoSession = {
    id: `demo_${Date.now()}`,
    questions: demoQuestions,
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    startTime: new Date(),
    markForReview: Array(demoQuestions.length).fill(false),
    mode: 'study'
  };
  
  return demoSession;
}

// Function to simulate PDF processing result
function createDemoProcessingResult() {
  return {
    questions: demoQuestions,
    processingTime: 2500, // Simulated processing time
    confidence: 0.92 // Simulated confidence score
  };
}

// Function to load demo data in the browser
function loadDemoData() {
  if (typeof window !== 'undefined') {
    // Store demo questions in localStorage for testing
    localStorage.setItem('quizgen_demo_questions', JSON.stringify(demoQuestions));
    localStorage.setItem('quizgen_demo_session', JSON.stringify(createDemoSession()));
    
    console.log('Demo data loaded successfully!');
    console.log('Questions:', demoQuestions.length);
    console.log('Categories:', [...new Set(demoQuestions.map(q => q.category))]);
    console.log('Types:', [...new Set(demoQuestions.map(q => q.type))]);
  }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demoQuestions,
    createDemoSession,
    createDemoProcessingResult,
    loadDemoData
  };
}

// Usage instructions:
console.log(`
QuizGen Demo Script
==================

To use this demo:

1. Open the QuizGen application in your browser
2. Open browser developer tools (F12)
3. Go to the Console tab
4. Copy and paste this script
5. Run: loadDemoData()
6. The demo questions will be available for testing

Demo includes:
- ${demoQuestions.length} sample medical questions
- Multiple choice and short answer types
- Various categories (Anatomy, Physiology)
- Different difficulty levels

This is perfect for testing the application without needing to upload a PDF!
`); 