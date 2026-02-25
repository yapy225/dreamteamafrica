import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Événements",
  description: "Découvrez les événements culturels africains à Paris — Saison 2026",
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Événements culturels
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          Saison 2026 — 8 rendez-vous exceptionnels célébrant la culture
          africaine à Paris, de mars à novembre.
        </p>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/evenements/${event.slug}`}
            className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
          >
            {/* Color bar */}
            <div className="h-2 rounded-t-[var(--radius-card)] bg-gradient-to-r from-dta-accent to-dta-accent-light" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-bold text-dta-dark group-hover:text-dta-accent transition-colors">
                    {event.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dta-char/70">
                    {event.description}
                  </p>
                </div>
                <div className="flex-shrink-0 rounded-[var(--radius-button)] bg-dta-accent/10 px-3 py-2 text-center">
                  <span className="block text-xs font-semibold uppercase text-dta-accent">
                    {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
                  </span>
                  <span className="block font-serif text-2xl font-bold text-dta-dark">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-dta-taupe">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {event.venue}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-[var(--radius-full)] bg-dta-beige px-3 py-1 text-xs font-medium text-dta-char">
                  Early Bird {formatPrice(event.priceEarly)}
                </span>
                <span className="rounded-[var(--radius-full)] bg-dta-sand/50 px-3 py-1 text-xs font-medium text-dta-char">
                  Standard {formatPrice(event.priceStd)}
                </span>
                <span className="rounded-[var(--radius-full)] bg-dta-accent/10 px-3 py-1 text-xs font-medium text-dta-accent">
                  VIP {formatPrice(event.priceVip)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
