import { RefreshCw, SearchX } from 'lucide-react';

export const EmptyState = ({ message = "No flights found matching your search criteria.", onReset }) => {
  return (
    <div className="apple-card p-10 text-center max-w-md w-full mx-auto my-6 shadow-xl">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)] shadow-sm">
        <SearchX className="w-7 h-7 text-[var(--text-main)]" />
      </div>

      <h3 className="text-lg font-bold font-display text-[var(--text-main)] mb-1">No Flights Discovered</h3>
      <p className="text-[var(--text-sub)] text-xs mb-6 max-w-xs mx-auto leading-relaxed">
        {message}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="apple-btn-primary inline-flex items-center space-x-2 px-4 py-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Search Filters</span>
        </button>
      )}
    </div>
  );
};
