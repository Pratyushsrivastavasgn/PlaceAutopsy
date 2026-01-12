import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Assessments } from './pages/Assessments';
import { Jobs } from './pages/Jobs';
import { Settings } from './pages/Settings';
import ResumeAnalysis from './pages/ResumeAnalysis';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/resume-analysis" element={<ResumeAnalysis />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
