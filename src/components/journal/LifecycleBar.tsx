import { type JournalZone } from "@/lib/journal";

/* ─── Types ─────────────────────────────────────────────── */

interface LifecycleBarProps {
  activeZone: JournalZone;
}

/* ─── Segments ──────────────────────────────────────────── */

type Segment = {
  zone: JournalZone;
  shortLabel: string;
  fullLabel: string;
};

const computedSegments: Segment[] = [
  { zone: "UNE", shortLabel: "Une", fullLabel: "J1-3 \u00b7 \u00c0 la Une" },
  { zone: "FACE_UNE", shortLabel: "Face", fullLabel: "J4-6 \u00b7 Face Une" },
  { zone: "PAGES_4_5", shortLabel: "P.4-5", fullLabel: "J7-8 \u00b7 Pages 4\u20135" },
  { zone: "PAGES_6_7", shortLabel: "P.6-7", fullLabel: "J9-10 \u00b7 Pages 6\u20137" },
  { zone: "PAGES_8_9", shortLabel: "P.8-9", fullLabel: "J11-12 \u00b7 Pages 8\u20139" },
  { zone: "PAGES_10_11", shortLabel: "P.10-11", fullLabel: "J13-16 \u00b7 Pages 10\u201311" },
  { zone: "PAGES_12_13", shortLabel: "P.12-13", fullLabel: "J17-21 \u00b7 Pages 12\u201313" },
  { zone: "ARCHIVES", shortLabel: "Archives", fullLabel: "J22+ \u00b7 Archives" },
];

/* ─── Component ─────────────────────────────────────────── */

export default function LifecycleBar({ activeZone }: LifecycleBarProps) {
  const activeIndex = computedSegments.findIndex((s) => s.zone === activeZone);

  return (
    <div
      role="navigation"
      aria-label="Cycle de vie de l'article"
      className="overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-1 min-w-max px-1 py-3">
        {computedSegments.map((segment, i) => {
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

              {/* Label — short on mobile, full on desktop */}
              <span
                className={`whitespace-nowrap text-xs sm:hidden ${
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
              <span
                className={`hidden whitespace-nowrap text-xs sm:inline ${
                  isActive
                    ? "font-bold text-dta-accent"
                    : isPast
                      ? "text-dta-sand"
                      : isFuture
                        ? "text-dta-taupe/50"
                        : "text-dta-taupe"
                }`}
              >
                {segment.fullLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
