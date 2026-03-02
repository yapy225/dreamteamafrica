export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-dta-sand" />
        <div className="h-4 w-64 animate-pulse rounded bg-dta-sand/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="h-4 w-20 animate-pulse rounded bg-dta-sand/60" />
            <div className="mt-3 h-7 w-32 animate-pulse rounded-lg bg-dta-sand" />
          </div>
        ))}
      </div>
      {/* Revenue skeleton */}
      <div className="mb-10 mt-10 space-y-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-dta-sand" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-[var(--radius-card)] bg-dta-sand/30" />
          ))}
        </div>
        <div className="h-[350px] animate-pulse rounded-[var(--radius-card)] bg-dta-sand/20" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[240px] animate-pulse rounded-[var(--radius-card)] bg-dta-sand/20" />
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-[var(--radius-card)] bg-dta-sand/40" />
        ))}
      </div>
    </div>
  );
}
