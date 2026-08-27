import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogOut, Plus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AscendingPlaneIcon } from './AscendingPlaneIcon';

export const Navbar = ({ onOpenCreateModal, onOpenLoginModal, onOpenSignupModal }) => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <AscendingPlaneIcon className="h-8 sm:h-9 w-auto text-[var(--text-main)] transition-opacity group-hover:opacity-80 shrink-0" />
          <span className="text-sm sm:text-base font-bold font-display tracking-[0.2em] sm:tracking-[0.25em] text-[var(--text-main)] uppercase leading-none">
            AIRWAYS
          </span>
        </Link>

        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <button
            onClick={toggleTheme}
            className="apple-btn-icon"
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--text-main)]" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--text-main)]" />
            )}
          </button>

          {user ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-xs sm:text-sm font-semibold hidden md:inline mr-2">Hello, {user.fullName?.split(' ')[0] ?? user.email}</span>
              
              {isAdmin && (
                <button
                  onClick={onOpenCreateModal}
                  className="apple-btn-primary py-1.5 px-3 sm:py-2 sm:px-4 text-xs flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Add Flight</span>
                </button>
              )}

              <button
                onClick={() => {
                  logoutUser();
                  navigate('/');
                }}
                className="apple-btn-icon"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={onOpenLoginModal}
                className="apple-btn-secondary py-1.5 px-3 sm:py-2 sm:px-4 text-xs"
              >
                Login
              </button>
              <button
                onClick={onOpenSignupModal}
                className="apple-btn-primary py-1.5 px-3 sm:py-2 sm:px-4 text-xs"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
