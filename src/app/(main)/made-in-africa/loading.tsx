export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-[#FAFAF7] via-[#F5EDE4] to-[#E8D5C4] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <div className="mx-auto h-4 w-32 rounded-full bg-[#C4704B]/20 shimmer" />
          <div className="mx-auto h-10 w-80 rounded-lg bg-[#D4B89C]/30 shimmer" />
          <div className="mx-auto h-4 w-96 max-w-full rounded-full bg-[#D4B89C]/20 shimmer" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar skeleton */}
        <div className="-mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="h-10 w-full rounded-full bg-[#F5F0EB] shimmer" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-full bg-[#F5F0EB] shimmer"
                style={{ width: `${60 + i * 12}px` }}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-[#F0ECE7] pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-[#F5F0EB] shimmer" />
            ))}
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 gap-6 pb-20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-square bg-[#F5F0EB] shimmer" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-[#F0ECE7] shimmer" />
                <div className="h-3 w-1/2 rounded bg-[#F0ECE7]/70 shimmer" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 rounded bg-[#F0ECE7] shimmer" />
                  <div className="h-5 w-20 rounded-full bg-[#F5F0EB] shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .shimmer {
              background-image: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255,255,255,0.4) 50%,
                transparent 100%
              );
              background-size: 200% 100%;
              animation: shimmer 1.8s infinite ease-in-out;
            }
          `,
        }}
      />
    </div>
  );
}
