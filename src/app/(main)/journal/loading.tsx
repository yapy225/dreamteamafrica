export default function JournalLoading() {
  return (
    <>
      {/* Nav skeleton */}
      <div className="sticky top-0 z-40 h-14 border-b border-dta-sand/50 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-dta-sand" />
          <div className="hidden gap-4 lg:flex">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 w-16 animate-pulse rounded bg-dta-sand/60" />
            ))}
          </div>
          <div className="h-7 w-24 animate-pulse rounded-[var(--radius-button)] bg-dta-sand" />
        </div>
      </div>

      {/* Ad banner skeleton */}
      <div className="h-[44px] animate-pulse bg-dta-beige" />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero carousel skeleton */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-5 w-44 animate-pulse rounded bg-dta-sand" />
            <div className="flex gap-1">
              <div className="h-1.5 w-4 animate-pulse rounded-full bg-dta-accent/40" />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-dta-sand" />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-dta-sand" />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="min-h-[500px] animate-pulse rounded-[var(--radius-card)] bg-dta-sand/50" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-h-[160px] flex-1 animate-pulse rounded-[var(--radius-card)] bg-dta-sand/40" />
              ))}
            </div>
          </div>
        </div>

        {/* Lifecycle bar skeleton */}
        <div className="flex items-center gap-1 py-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <div className="h-px w-6 bg-dta-sand/50" />}
              <div className="h-2 w-2 animate-pulse rounded-full bg-dta-sand" />
              <div className="h-3 w-10 animate-pulse rounded bg-dta-sand/40" />
            </div>
          ))}
        </div>

        {/* Article rows skeleton */}
        {Array.from({ length: 2 }).map((_, rowIdx) => (
          <div key={rowIdx}>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-5 w-28 animate-pulse rounded bg-dta-sand" />
              <div className="h-px flex-1 bg-dta-sand/50" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[160px_1fr] gap-4 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]"
                >
                  <div className="h-full animate-pulse bg-dta-sand/50" />
                  <div className="space-y-2 py-4 pr-4">
                    <div className="h-3 w-16 animate-pulse rounded bg-dta-sand/60" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-dta-sand" />
                    <div className="h-4 w-full animate-pulse rounded bg-dta-sand/40" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-dta-sand/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
