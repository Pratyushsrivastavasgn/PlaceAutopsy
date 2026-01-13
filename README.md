# 🎯 Analytix - AI-Powered Placement Analytics Platform

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Supercharge your placement journey with AI-driven resume analysis and actionable insights**

[Live Demo](https://placeautopsy.vercel.app) • [Report Bug](https://github.com/yourusername/analytix/issues)

</div>

---

## 🌟 Overview

**PlaceAutopsy **is a modern, AI-powered placement analytics dashboard that helps students and job seekers optimize their resumes for Applicant Tracking Systems (ATS). Built with Google's cutting-edge AI technology, it provides instant resume scoring, personalized recommendations, and comprehensive placement readiness analytics.

## ✨ Key Features

### 🤖 AI-Powered Resume Analysis

- **Gemini AI Integration** - Leverages Google's Gemini API for intelligent resume parsing and analysis
- **ATS Compatibility Scoring** - Get instant scores based on industry-standard ATS criteria
- **Smart Recommendations** - AI-generated suggestions to improve your resume's effectiveness

### 🔐 Seamless Authentication

- **Google OAuth 2.0** - One-click sign-in with your Google account
- **Secure Sessions** - JWT-based authentication with automatic session management

### 📊 Analytics Dashboard

- **Placement Readiness Score** - Comprehensive KPI tracking across multiple dimensions
- **Skill Gap Matrix** - Visual representation of skills vs. industry requirements
- **Failure Pattern Analysis** - Identify trends in interview rejections
- **Personalized Action Plans** - Step-by-step improvement roadmap

### 💾 Cloud Data Persistence

- **Firebase Firestore** - Real-time database for user data and analytics
- **Cross-Device Sync** - Access your data from anywhere

## 🛠️ Tech Stack

### Frontend

| Technology    | Purpose            |
| ------------- | ------------------ |
| React 19      | UI Framework       |
| TypeScript    | Type Safety        |
| Vite          | Build Tool         |
| Tailwind CSS  | Styling            |
| Framer Motion | Animations         |
| Recharts      | Data Visualization |
| Lucide React  | Icons              |

### Backend & AI

| Technology                   | Purpose            |
| ---------------------------- | ------------------ |
| **Google Gemini API**  | AI Resume Analysis |
| **Google OAuth 2.0**   | Authentication     |
| **Firebase Firestore** | Database           |

### Deployment

| Technology | Purpose          |
| ---------- | ---------------- |
| Vercel     | Hosting & CI/CD  |
| Firebase   | Backend Services |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console account
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/analytix.git
   cd analytix
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=your_google_client_id

   # Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. **Start development server**

   ```bash
   npm run dev
   ```
5. **Open in browser**

   ```
   http://localhost:5173
   ```

## 🔧 API Setup

### Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized origins and redirect URIs

### Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to your `.env` file

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Add a web app and copy config values

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard widgets
│   ├── Sidebar.tsx
│   ├── TopNavbar.tsx
│   └── MagicBento.tsx
├── context/             # React Context providers
│   ├── AuthContext.tsx  # Google OAuth state
│   └── AppContext.tsx   # App-wide state
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── lib/                 # Utilities
│   ├── firebase.ts      # Firebase initialization
│   └── utils.ts
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── ResumeAnalysis.tsx
│   ├── Jobs.tsx
│   └── Settings.tsx
├── services/            # API integrations
│   ├── geminiService.ts # Gemini AI
│   └── firestoreService.ts
└── types/               # TypeScript definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Firebase](https://firebase.google.com/) for backend services
- [Vercel](https://vercel.com/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">

**Built with ❤️ using Google AI & Firebase**

⭐ Star this repo if you find it helpful!

</div>
