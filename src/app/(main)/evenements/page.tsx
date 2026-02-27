import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Événements",
  description:
    "Découvrez les événements culturels africains à Paris — Saison 2026",
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
    include: { _count: { select: { tickets: true } } },
  });

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1);

  const venues = new Set(events.map((e) => e.venue));

  function lowestPrice(e: (typeof events)[number]) {
    return Math.min(e.priceEarly, e.priceStd, e.priceVip);
  }

  function capacityPercent(e: (typeof events)[number]) {
    if (!e.capacity || e.capacity === 0) return 0;
    return Math.round((e._count.tickets / e.capacity) * 100);
  }

  function remainingPlaces(e: (typeof events)[number]) {
    if (!e.capacity) return null;
    return Math.max(0, e.capacity - e._count.tickets);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── A. Page Header ─────────────────────────────── */}
      <div className="mb-14 text-center">
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Saison Culturelle Africaine
        </h1>
        <h2 className="mt-2 font-serif text-2xl text-dta-accent">
          Paris 2026
        </h2>
        <span className="mt-4 inline-block rounded-[var(--radius-full)] bg-dta-accent/10 px-4 py-1.5 text-sm font-medium text-dta-accent">
          {events.length} événement{events.length > 1 ? "s" : ""} · Avril —
          Décembre 2026
        </span>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          {events.length} rendez-vous exceptionnels célébrant la richesse
          culturelle africaine à Paris. Réservez vos places.
        </p>
      </div>

      {/* ── B. Featured Event Hero ─────────────────────── */}
      {featuredEvent && (
        <Link
          href={`/evenements/${featuredEvent.slug}`}
          className="group mb-14 block rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-accent/20 to-dta-sand lg:aspect-auto lg:min-h-[400px] lg:rounded-l-[var(--radius-card)] lg:rounded-tr-none">
              {featuredEvent.coverImage && (
                <Image
                  src={featuredEvent.coverImage}
                  alt={featuredEvent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center p-8">
              {/* Date badge */}
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                  Prochain événement
                </span>
                <span className="rounded-[var(--radius-button)] bg-dta-accent/10 px-3 py-2 text-center">
                  <span className="block text-xs font-semibold uppercase text-dta-accent">
                    {new Date(featuredEvent.date).toLocaleDateString("fr-FR", {
                      month: "short",
                    })}
                  </span>
                  <span className="block font-serif text-2xl font-bold text-dta-dark">
                    {new Date(featuredEvent.date).getDate()}
                  </span>
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold leading-tight text-dta-dark transition-colors group-hover:text-dta-accent sm:text-3xl">
                {featuredEvent.title}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
                {featuredEvent.description}
              </p>

              {/* Metadata */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-dta-taupe">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {featuredEvent.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  {formatDate(featuredEvent.date)}
                </span>
              </div>

              {/* Price */}
              <p className="mt-5 text-sm text-dta-char/70">
                À partir de{" "}
                <span className="font-serif text-lg font-bold text-dta-accent">
                  {formatPrice(lowestPrice(featuredEvent))}
                </span>
              </p>

              {/* Capacity bar */}
              {featuredEvent.capacity > 0 && (
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-dta-taupe">
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      {remainingPlaces(featuredEvent)} places restantes
                    </span>
                    <span>{capacityPercent(featuredEvent)}% réservé</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-dta-beige">
                    <div
                      className="h-full rounded-[var(--radius-full)] bg-dta-accent transition-all"
                      style={{
                        width: `${Math.min(capacityPercent(featuredEvent), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-dta-accent-dark">
                  Réserver
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── C. Upcoming Events Grid ────────────────────── */}
      {upcomingEvents.length > 0 && (
        <>
          <h3 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Prochains événements
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/evenements/${event.slug}`}
                className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Cover image with date badge overlay */}
                <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-beige to-dta-sand">
                  {event.coverImage && (
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  {/* Date badge on image */}
                  <div className="absolute left-3 top-3 rounded-[var(--radius-button)] bg-white/90 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
                    <span className="block text-xs font-semibold uppercase text-dta-accent">
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        month: "short",
                      })}
                    </span>
                    <span className="block font-serif text-xl font-bold text-dta-dark">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent">
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                    {event.description}
                  </p>

                  {/* Venue + date */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {event.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDate(event.date)}
                    </span>
                  </div>

                  {/* Price + remaining */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-dta-char/70">
                      À partir de{" "}
                      <span className="font-serif text-base font-bold text-dta-accent">
                        {formatPrice(lowestPrice(event))}
                      </span>
                    </p>
                    {event.capacity > 0 && (
                      <span className="flex items-center gap-1 rounded-[var(--radius-full)] bg-dta-beige px-2.5 py-1 text-xs font-medium text-dta-char">
                        <Ticket size={12} />
                        {remainingPlaces(event)} places
                      </span>
                    )}
                  </div>

                  {/* Capacity bar */}
                  {event.capacity > 0 && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-[var(--radius-full)] bg-dta-beige">
                      <div
                        className="h-full rounded-[var(--radius-full)] bg-dta-accent/70 transition-all"
                        style={{
                          width: `${Math.min(capacityPercent(event), 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── D. Info Strip ──────────────────────────────── */}
      <div className="mt-16 grid grid-cols-1 gap-4 rounded-[var(--radius-card)] bg-dta-beige/50 p-6 sm:grid-cols-3 sm:gap-6 sm:p-8">
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <Calendar size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              {events.length}
            </p>
            <p className="text-xs text-dta-taupe">Événements</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <MapPin size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              {venues.size}
            </p>
            <p className="text-xs text-dta-taupe">Lieux à Paris</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <Ticket size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              Avr — Déc
            </p>
            <p className="text-xs text-dta-taupe">Saison 2026</p>
          </div>
        </div>
      </div>

      {/* ── E. Footer CTA ─────────────────────────────── */}
      <div className="mt-12 text-center">
        <p className="text-sm text-dta-char/70">
          Des questions ?{" "}
          <Link
            href="/contact"
            className="font-medium text-dta-accent underline underline-offset-2 hover:text-dta-accent-dark"
          >
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
}
