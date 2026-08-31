import { useState } from 'react';
import { X, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validEmail, normalizeEmail } from '../utils/email';

export default function LoginModal({ isOpen, onClose }) {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required";
    if (!validEmail(formData.email)) return "Invalid email format";
    if (!formData.password) return "Password is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    const payload = {
      email: normalizeEmail(formData.email),
      password: formData.password
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (response.ok) {
        loginUser(data);
        onClose();
        setFormData({ email: '', password: '' });
      } else {
        if (data.errors && Object.keys(data.errors).length > 0) {
          const firstError = Object.values(data.errors)[0];
          setError(firstError);
        } else {
          setError(data.message || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="animate-fade fixed inset-0 bg-[var(--backdrop)] backdrop-blur-md" />

      <div
        className="animate-modal apple-glass rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-pill)]">
          <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Welcome Back</h2>
          <button
            onClick={onClose}
            className="apple-btn-icon p-2 rounded-xl"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs font-semibold text-[var(--status-danger)] bg-[var(--status-danger-bg)] rounded-xl border border-[var(--status-danger)]/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest">
              Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input
                id="login-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setError('');
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                }}
                className="apple-input w-full pl-10"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input
                id="login-password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setError('');
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                }}
                className="apple-input w-full pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="apple-btn-primary w-full mt-6 py-3 text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
