import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            onClick={onCancel}
            className="fixed inset-0 bg-[var(--backdrop)] backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="apple-card w-full max-w-md rounded-3xl p-6 shadow-2xl relative z-10"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)] p-2 rounded-xl hover:bg-[var(--bg-pill)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-[var(--text-main)] mb-4">
              <div className="p-3 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--text-main)]">{title}</h3>
                <p className="text-xs text-[var(--text-sub)]">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-sub)] mb-6 leading-relaxed">
              {message}
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onCancel}
                className="apple-btn-secondary py-2 px-4 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="apple-btn-primary py-2 px-4 text-xs shadow-md"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
