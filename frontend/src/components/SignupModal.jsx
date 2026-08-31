import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validEmail, normalizeEmail } from '../utils/email';

export default function SignupModal({ isOpen, onClose, onShowToast }) {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) return "Full name must be at least 2 characters";
    if (!formData.email.trim()) return "Email is required";
    if (!validEmail(formData.email)) return "Invalid email format";
    if (!formData.password || formData.password.length < 6) return "Password must be at least 6 characters";
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
      fullName: formData.fullName.trim(),
      email: normalizeEmail(formData.email),
      password: formData.password
    };

    try {
      const response = await fetch('/api/auth/signup', {
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
        setFormData({ fullName: '', email: '', password: '' });
        const name = data.fullName?.trim() || data.email || 'User';
        onShowToast?.({
          type: 'success',
          message: `Account created successfully! Welcome to Airways, ${name}.`
        });
      } else {
        if (data.errors && Object.keys(data.errors).length > 0) {
          const firstError = Object.values(data.errors)[0];
          setError(firstError);
        } else {
          setError(data.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup. Please try again.');
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
        className="animate-modal apple-modal rounded-3xl w-full max-w-md overflow-hidden relative z-10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Create an Account</h2>
          <button
            onClick={onClose}
            className="apple-btn-icon p-2 rounded-xl"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs font-semibold text-[var(--status-danger)] bg-[var(--status-danger-bg)] rounded-xl border border-[var(--status-danger)]/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="signup-fullname" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest">
              Full Name *
            </label>
            <input
              id="signup-fullname"
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setError('');
                setFormData(prev => ({ ...prev, fullName: e.target.value }));
              }}
              className="apple-input w-full"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest">
              Email *
            </label>
            <input
              id="signup-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setError('');
                setFormData(prev => ({ ...prev, email: e.target.value }));
              }}
              className="apple-input w-full"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] uppercase tracking-widest">
              Password *
            </label>
            <input
              id="signup-password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setError('');
                setFormData(prev => ({ ...prev, password: e.target.value }));
              }}
              className="apple-input w-full"
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="apple-btn-primary w-full mt-6 py-3 text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
