import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({ toast, onClose }) => {
  const isSuccess = toast?.type === 'success';
  const isError = toast?.type === 'error';

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 pointer-events-none">
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="pointer-events-auto p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-between shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-[var(--status-danger)] shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[var(--text-sub)] shrink-0" />}
              <p className="text-sm font-semibold text-[var(--text-main)]">{toast.message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-[var(--text-dim)] hover:text-[var(--text-main)] p-1 rounded-lg hover:bg-[var(--bg-pill)]"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
