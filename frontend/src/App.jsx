import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
            <Navbar
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
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

            <AdminLoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onShowToast={showToast}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
