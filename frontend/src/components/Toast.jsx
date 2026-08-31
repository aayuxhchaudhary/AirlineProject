import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  const isSuccess = toast?.type === 'success';
  const isError = toast?.type === 'error';

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 left-0 right-0 sm:left-auto sm:right-6 z-50 px-4 sm:px-0 sm:max-w-md w-full pointer-events-none flex justify-center sm:justify-end">
          <div
            role="status"
            aria-live="polite"
            className="animate-toast pointer-events-auto p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-modal)] text-[var(--text-main)] flex items-center justify-between shadow-2xl backdrop-blur-xl w-full max-w-md"
          >
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-[var(--status-danger)] shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[var(--text-sub)] shrink-0" />}
              <p className="text-sm font-semibold text-[var(--text-main)] break-words">{toast.message}</p>
            </div>
            <button
              onClick={onClose}
              className="apple-btn-icon p-1 rounded-lg shrink-0 ml-2"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
