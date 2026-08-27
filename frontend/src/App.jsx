import { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);

  const showToast = (toastObj) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(toastObj);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans transition-colors">
            <Navbar
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenSignupModal={() => setIsSignupModalOpen(true)}
            />

            <div className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      isCreateModalOpen={isCreateModalOpen}
                      setIsCreateModalOpen={setIsCreateModalOpen}
                      onShowToast={showToast}
                      toast={toast}
                      setToast={setToast}
                    />
                  }
                />
              </Routes>
            </div>

            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
            />
            
            <SignupModal
              isOpen={isSignupModalOpen}
              onClose={() => setIsSignupModalOpen(false)}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
