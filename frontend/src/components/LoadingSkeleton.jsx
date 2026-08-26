export const LoadingSkeleton = ({ count = 6, viewMode = 'list' }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="apple-card p-6 animate-pulse"
            style={{ minHeight: '320px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-24 bg-[var(--bg-pill)] rounded-lg"></div>
              <div className="h-5 w-20 bg-[var(--bg-pill)] rounded-full"></div>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)]" style={{ height: '100px' }}></div>

            <div className="space-y-2 mb-4">
              <div className="h-4 w-32 bg-[var(--bg-pill)] rounded"></div>
              <div className="h-1.5 w-full bg-[var(--bg-pill)] rounded-full"></div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div className="h-6 w-20 bg-[var(--bg-pill)] rounded"></div>
              <div className="h-8 w-24 bg-[var(--bg-pill)] rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="apple-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="min-w-[130px]">
              <div className="flex items-center space-x-2 mb-1">
                <div className="h-5 w-16 bg-[var(--bg-pill)] rounded-lg"></div>
                <div className="h-4 w-16 bg-[var(--bg-pill)] rounded-full"></div>
              </div>
              <div className="h-4 w-24 bg-[var(--bg-pill)] rounded mt-1"></div>
            </div>

            <div className="flex items-center space-x-4 flex-1">
              <div className="min-w-[110px]">
                <div className="h-5 w-20 bg-[var(--bg-pill)] rounded mb-1"></div>
                <div className="h-3 w-16 bg-[var(--bg-pill)] rounded"></div>
              </div>
              <div className="flex-1 max-w-[120px]">
                <div className="h-px w-full bg-[var(--bg-pill)]"></div>
              </div>
              <div className="min-w-[110px] flex flex-col items-end">
                <div className="h-5 w-20 bg-[var(--bg-pill)] rounded mb-1"></div>
                <div className="h-3 w-16 bg-[var(--bg-pill)] rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
            <div className="min-w-[110px]">
              <div className="h-3 w-full bg-[var(--bg-pill)] rounded mb-1"></div>
              <div className="h-1.5 w-full bg-[var(--bg-pill)] rounded-full"></div>
            </div>
            <div className="min-w-[95px] flex flex-col items-end">
              <div className="h-3 w-8 bg-[var(--bg-pill)] rounded mb-1"></div>
              <div className="h-5 w-16 bg-[var(--bg-pill)] rounded"></div>
            </div>
            <div className="h-8 w-20 bg-[var(--bg-pill)] rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
