export default function JournalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3 text-center">
        <div className="mx-auto h-8 w-44 animate-pulse rounded-lg bg-dta-sand" />
        <div className="mx-auto h-4 w-72 animate-pulse rounded bg-dta-sand/60" />
      </div>
      {/* Featured article skeleton */}
      <div className="mb-12 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <div className="aspect-[21/9] animate-pulse bg-dta-sand/50" />
        <div className="space-y-3 p-6">
          <div className="h-6 w-2/3 animate-pulse rounded bg-dta-sand" />
          <div className="h-4 w-full animate-pulse rounded bg-dta-sand/50" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-dta-sand/40" />
        </div>
      </div>
      {/* Article grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
            <div className="aspect-[16/9] animate-pulse bg-dta-sand/50" />
            <div className="space-y-2 p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-dta-sand/60" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-dta-sand" />
              <div className="h-4 w-full animate-pulse rounded bg-dta-sand/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
