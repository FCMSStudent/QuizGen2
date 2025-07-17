# QuizGen2

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-green)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-blue)](https://tailwindcss.com/)

A modern web application that converts PDF question banks into interactive quizzes, specifically designed for medical students studying for board exams. Features OCR support for scanned documents, AI-powered explanations, and comprehensive progress tracking.

## 🚀 Features

### Core Functionality
- **📄 PDF Upload & OCR**: Upload scanned or digital PDF question banks with automatic text extraction
- **🤖 Smart Question Parsing**: Advanced algorithms to identify questions, answer options, and correct answers
- **📝 Interactive Quiz Interface**: Multiple-choice and short-answer question support
- **🧠 AI-Powered Explanations**: Get detailed explanations using OpenAI's ChatGPT API
- **📊 Progress Tracking**: Comprehensive analytics and performance monitoring

### Advanced Features
- **🎯 Study & Test Modes**: Choose between immediate feedback (study) or timed assessment (test)
- **🔍 Question Filtering**: Filter by category, difficulty, and question type
- **📈 Analytics Dashboard**: Track accuracy, timing, and progress over time
- **💾 Data Management**: Export/import quiz data and progress
- **🎨 Modern UI**: Beautiful, responsive design optimized for medical education

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quizgen2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Upload PDF Question Bank
- Click the upload area or drag and drop your PDF file
- Supports both digital and scanned PDFs (OCR enabled)
- Maximum file size: 10MB

### 2. Question Processing
The app automatically:
- Extracts text from the PDF
- Identifies question patterns
- Parses answer options and correct answers
- Categorizes questions by medical subject

### 3. Interactive Quiz
- **Study Mode**: Immediate feedback with explanations
- **Test Mode**: Timed assessment without immediate feedback
- Navigate between questions
- Mark questions for review
- Get AI explanations for any question

### 4. Advanced Features
- **Filter Questions**: By category, difficulty, or type
- **Analytics**: View performance statistics
- **Export/Import**: Backup and restore your progress

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Server-side functionality
- **PDF Processing**: pdf-parse for digital PDFs
- **OCR Engine**: Tesseract.js for scanned documents
- **AI Integration**: OpenAI GPT-3.5-turbo for explanations

### Data Storage
- **LocalStorage**: Client-side quiz sessions and progress
- **JSON Export/Import**: Data portability
- **Future**: Database integration for multi-user support

## 📁 Project Structure

```
quizgen2/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── process-pdf/   # PDF processing endpoint
│   │   └── get-explanation/ # AI explanation endpoint
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PDFUploader.tsx    # File upload component
│   ├── QuizInterface.tsx  # Main quiz interface
│   ├── QuestionDisplay.tsx # Question rendering
│   ├── ProgressTracker.tsx # Progress monitoring
│   ├── QuizResults.tsx    # Results display
│   ├── AdvancedFeatures.tsx # Advanced functionality
│   └── DatabaseManager.tsx # Data persistence
├── types/                 # TypeScript definitions
│   └── quiz.ts           # Quiz-related types
└── sample-questions.md    # Sample question format
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for explanations | Yes | - |
| `OPENAI_MODEL` | OpenAI model to use | No | gpt-3.5-turbo |
| `OPENAI_MAX_TOKENS` | Max tokens for explanations | No | 300 |

### Question Format Support

The app recognizes various question formats:
- Numbered questions (1., 2., etc.)
- Lettered options (A., B., C., D.)
- Question words (What, Which, How, etc.)
- Answer indicators (Correct Answer:, Answer:)

## 🧪 Testing

### Sample Data
Use the included `sample-questions.md` to test the application without uploading a PDF.

### Manual Testing
1. Upload a PDF with medical questions
2. Verify question parsing accuracy
3. Test quiz functionality in both modes
4. Check AI explanation generation
5. Validate progress tracking

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any Node.js hosting platform:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in `/components`
2. Add API routes in `/app/api`
3. Update types in `/types`
4. Test thoroughly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Q: PDF processing fails**
A: Ensure your PDF is not password-protected and under 10MB

**Q: OCR not working properly**
A: Try with a higher-quality scan or different PDF format

**Q: No AI explanations**
A: Check your OpenAI API key is valid and has credits

**Q: Questions not parsing correctly**
A: The PDF format may not be recognized. Check the sample format

### Getting Help
- Check the sample questions format
- Review the console for error messages
- Ensure all environment variables are set
- Verify internet connection for AI features

## 🔮 Future Enhancements

- [ ] Database integration for multi-user support
- [ ] Real-time collaboration
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Integration with learning management systems
- [ ] Support for more question types
- [ ] Automated question generation
- [ ] Peer comparison features

---

**Built with ❤️ for medical students preparing for board exams**
