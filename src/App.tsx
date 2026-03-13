import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Configure from './pages/Configure';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Showcase from './pages/Showcase';

// Components
import Layout from './components/Layout';
import AIChatAssistant from './components/AIChatAssistant';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // Or a loading spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { fontSize } = useAccessibility();

  useEffect(() => {
    // Apply font size scaling to html element
    const html = document.documentElement;
    html.classList.remove('font-normal', 'font-large', 'font-xlarge');
    if (fontSize === 'large') html.classList.add('font-large');
    else if (fontSize === 'extra-large') html.classList.add('font-xlarge');
    else html.classList.add('font-normal');
  }, [fontSize]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/configure" element={<ProtectedRoute><Configure /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/showcase" element={<Showcase />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-brand-bg">
              <AppRoutes />
              <AIChatAssistant />
            </div>
          </Router>
        </AuthProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
