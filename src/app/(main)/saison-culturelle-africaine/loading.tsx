export default function EvenementsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3 text-center">
        <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-dta-sand" />
        <div className="mx-auto h-4 w-80 animate-pulse rounded bg-dta-sand/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
            <div className="aspect-[16/9] animate-pulse bg-dta-sand/50" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-dta-sand" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-dta-sand/60" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-dta-sand/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
