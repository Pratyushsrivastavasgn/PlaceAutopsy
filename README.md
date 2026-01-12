# Analytix - Placement Analytics Dashboard

AI-Powered placement analytics dashboard built with React, TypeScript.


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- **FREE** Gemini API key from [console.Gemini.com](https://console.Gemini.com/)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Get your FREE Gemini API key:
   - Visit https://console.Gemini.com/
   - Sign up (no credit card required)
   - Create an API key

3. Create `.env` file:
```bash
VITE_Gemini_API_KEY=your_Gemini_api_key_here
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5175

## ✨ Features

- 📊 **AI-Powered Analytics**: Resume analysis using Gemini's Llama 3.1 70B model
- 📈 **Placement Readiness Score**: Comprehensive KPI tracking
- 🎯 **Skill Gap Analysis**: Visual skill gap matrix with recommendations
- 📉 **Failure Analysis**: Identify patterns in interview rejections
- ✅ **Action Plan**: Personalized recommendations with resources
- 💼 **Job Application Tracking**: Manage applications and interview feedback
- 🎓 **Skills Inventory**: Track and showcase your skills with proof links
- 🌙 **Dark Theme**: Beautiful dark green analytics theme

## 🤖 AI Integration

**Powered by Gemini + Llama 3.1**

- **Model:** llama-3.1-70b-versatile
- **Free Tier:** 30 requests/min, 14,400/day
- **Speed:** Ultra-fast inference
- **Cost:** FREE (no credit card needed!)

See [Gemini_SETUP.md](Gemini_SETUP.md) for detailed setup instructions.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v3
- **Charts**: Recharts
- **AI**: Gemini
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage

## 📖 Usage

1. **Upload Resume**: Start by uploading your resume (PDF, DOCX, or TXT)
2. **Fill Profile**: Complete your profile information
3. **Get Analytics**: AI analyzes your resume and generates comprehensive analytics
4. **View Dashboard**: Explore your placement readiness, skill gaps, and action plan
5. **Manage Skills**: Add, edit, or delete skills in the Assessments page
6. **Track Applications**: Monitor job applications and interview progress
7. **Update Settings**: Modify your profile and preferences

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── Sidebar.tsx
│   ├── TopNavbar.tsx
│   └── ResumeUpload.tsx
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API and service layer
│   ├── geminiService.ts  # Gemini API integration
│   └── resumeParser.ts
└── types/              # TypeScript type definitions
```

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌟 Why Gemini?

## 📝 Future Enhancements (Phase 2)

- Firebase Authentication
- Firestore data persistence
- Firebase Storage for resume files
- Multi-user support
- Data synchronization across devices

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using React, TypeScript, and Gemini AI
