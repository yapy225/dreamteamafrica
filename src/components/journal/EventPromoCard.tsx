import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Ticket } from "lucide-react";

interface EventPromoCardProps {
  title: string;
  slug: string;
  date: Date;
  endDate?: Date | null;
  venue: string;
  coverImage: string | null;
  capacity?: number | null;
  description?: string | null;
}

export default function EventPromoCard({
  title,
  slug,
  date,
  endDate,
  venue,
  coverImage,
  capacity,
  description,
}: EventPromoCardProps) {
  const formatEventDate = (d: Date, end?: Date | null) => {
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" };
    const dayOpts: Intl.DateTimeFormatOptions = { day: "numeric", timeZone: "Europe/Paris" };
    const start = d.toLocaleDateString("fr-FR", opts);
    if (end) {
      const startDay = d.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric", timeZone: "Europe/Paris" });
      const endDay = end.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric", timeZone: "Europe/Paris" });
      if (startDay !== endDay) {
        // Same month? Show "3 — 4 avril 2026" instead of "3 avril 2026 — 4 avril 2026"
        const startMonth = d.toLocaleDateString("fr-FR", { month: "long", timeZone: "Europe/Paris" });
        const endMonth = end.toLocaleDateString("fr-FR", { month: "long", timeZone: "Europe/Paris" });
        if (startMonth === endMonth) {
          return `${d.toLocaleDateString("fr-FR", dayOpts)} — ${end.toLocaleDateString("fr-FR", opts)}`;
        }
        return `${start} — ${end.toLocaleDateString("fr-FR", opts)}`;
      }
    }
    return start;
  };

  return (
    <div className="not-prose my-10 overflow-hidden rounded-[var(--radius-card)] border border-dta-accent/20 bg-gradient-to-br from-dta-accent/5 via-white to-dta-beige shadow-[var(--shadow-card)]">
      {/* Header badge */}
      <div className="flex items-center gap-2 bg-dta-accent/10 px-5 py-2.5">
        <Ticket size={14} className="text-dta-accent" />
        <span className="text-xs font-semibold uppercase tracking-wider text-dta-accent">
          Saison Culturelle Africaine 2026
        </span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Event image */}
        {coverImage && (
          <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-2/5">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
        )}

        {/* Event info */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <h3 className="font-serif text-xl font-bold leading-tight text-dta-dark sm:text-2xl">
              {title}
            </h3>

            <div className="mt-3 space-y-1.5">
              <p className="flex items-center gap-2 text-sm text-dta-char/70">
                <Calendar size={14} className="shrink-0 text-dta-accent" />
                {formatEventDate(date, endDate)}
              </p>
              <p className="flex items-center gap-2 text-sm text-dta-char/70">
                <MapPin size={14} className="shrink-0 text-dta-accent" />
                {venue}
              </p>
            </div>

            {description && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-dta-char/60">
                {description}
              </p>
            )}
          </div>

          <Link
            href={`/saison-culturelle-africaine/${slug}`}
            className="mt-4 inline-flex items-center gap-2 self-start rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-dta-accent-dark hover:shadow-md"
          >
            Découvrir l&apos;événement
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
