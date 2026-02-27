export default function MarketplaceLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3 text-center">
        <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-dta-sand" />
        <div className="mx-auto h-4 w-72 animate-pulse rounded bg-dta-sand/60" />
      </div>
      <div className="mb-8 flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-[var(--radius-button)] bg-dta-sand/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
            <div className="aspect-square animate-pulse bg-dta-sand/50" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-dta-sand" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-dta-sand/60" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-dta-sand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
