export const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="apple-card p-6 flex flex-col justify-between h-[280px] animate-pulse"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-24 bg-[var(--bg-pill)] rounded-lg"></div>
              <div className="h-5 w-20 bg-[var(--bg-pill)] rounded-full"></div>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)] h-[100px]"></div>

            <div className="space-y-2 mb-4">
              <div className="h-4 w-32 bg-[var(--bg-pill)] rounded"></div>
              <div className="h-1.5 w-full bg-[var(--bg-pill)] rounded-full"></div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <div className="h-6 w-20 bg-[var(--bg-pill)] rounded"></div>
            <div className="h-8 w-24 bg-[var(--bg-pill)] rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
