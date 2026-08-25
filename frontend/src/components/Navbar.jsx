import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogOut, Plus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AscendingPlaneIcon } from './AscendingPlaneIcon';

export const Navbar = ({ onOpenCreateModal, onOpenLoginModal }) => {
  const { logoutAdmin, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <AscendingPlaneIcon className="h-9 w-auto text-[var(--text-main)] transition-opacity group-hover:opacity-80" />
          <span className="text-base font-bold font-display tracking-[0.25em] text-[var(--text-main)] uppercase leading-none">
            AIRWAYS
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--text-main)] hover:bg-[var(--bg-pill)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-[var(--text-main)]" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-[var(--text-main)]" />
            )}
          </button>

          {isAdmin ? (
            <div className="flex items-center space-x-2.5">
              <button
                onClick={onOpenCreateModal}
                className="apple-btn-primary py-2 px-4 text-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Flight</span>
              </button>

              <button
                onClick={() => {
                  logoutAdmin();
                  navigate('/');
                }}
                className="p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-pill)] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="apple-btn-primary py-2 px-4 text-xs flex items-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5 text-[var(--btn-main-text)]" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
