import { LIFECYCLE_RULES, type JournalZone } from "@/lib/journal";

/* ─── Types ─────────────────────────────────────────────── */

interface LifecycleBarProps {
  activeZone: JournalZone;
}

/* ─── Segments ──────────────────────────────────────────── */

type Segment = {
  zone: JournalZone;
  shortLabel: string;
};

const segments: Segment[] = [
  ...LIFECYCLE_RULES.map((r) => ({
    zone: r.zone,
    shortLabel: r.shortLabel,
  })),
  { zone: "ARCHIVES" as JournalZone, shortLabel: "Archives" },
];

/* ─── Component ─────────────────────────────────────────── */

export default function LifecycleBar({ activeZone }: LifecycleBarProps) {
  const activeIndex = segments.findIndex((s) => s.zone === activeZone);

  return (
    <div
      role="navigation"
      aria-label="Cycle de vie de l'article"
      className="overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-1 min-w-max px-1 py-3">
        {segments.map((segment, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const isFuture = i > activeIndex;

          return (
            <div
              key={segment.zone}
              className="flex items-center gap-1.5"
            >
              {/* Connector line (before each item except the first) */}
              {i > 0 && (
                <div
                  className={`h-px w-4 sm:w-6 ${
                    isPast || isActive ? "bg-dta-accent/40" : "bg-dta-sand"
                  }`}
                />
              )}

              {/* Dot */}
              <div
                className={`h-2 w-2 shrink-0 rounded-full ${
                  isActive
                    ? "bg-dta-accent"
                    : isPast
                      ? "bg-dta-sand"
                      : "bg-dta-taupe/30"
                }`}
              />

              {/* Label */}
              <span
                className={`whitespace-nowrap text-xs ${
                  isActive
                    ? "font-bold text-dta-accent"
                    : isPast
                      ? "text-dta-sand"
                      : isFuture
                        ? "text-dta-taupe/50"
                        : "text-dta-taupe"
                }`}
              >
                {segment.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
