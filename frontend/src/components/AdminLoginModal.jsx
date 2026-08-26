import { useState } from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const AdminLoginModal = ({ isOpen, onClose, onShowToast }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.username, password: credentials.password })
      });

      if (response.ok) {
        loginAdmin(credentials.username);
        onShowToast({ type: 'success', message: 'Admin authenticated successfully' });
        setCredentials({ username: '', password: '' });
        onClose();
      } else {
        setError('Invalid admin credentials. Access denied.');
      }
    } catch (err) {
      setError('Connection error to auth server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--backdrop)] backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="apple-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)] p-2 rounded-xl hover:bg-[var(--bg-pill)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)] text-[var(--text-main)] flex items-center justify-center mb-3 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-display text-[var(--text-main)]">Admin Login</h2>
              <p className="text-xs text-[var(--text-sub)] mt-1">Authorized personnel only</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[var(--status-danger-bg)] border border-[var(--status-danger)]/30 rounded-xl flex items-start space-x-2 text-[var(--status-danger)]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1.5">
                  Email / Username
                </label>
                <input
                  id="admin-email"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="apple-input w-full"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="apple-input w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="apple-btn-primary w-full py-3 text-xs shadow-md mt-2"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
