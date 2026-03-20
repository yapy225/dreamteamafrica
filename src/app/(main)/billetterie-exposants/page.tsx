import Link from "next/link";
import { CalendarDays, MapPin, Clock, Store, Check, ArrowRight } from "lucide-react";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS, formatDate } from "@/lib/exhibitor-events";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Billetterie Exposants — Saison Culturelle Africaine 2026",
  description:
    "Réservez votre stand pour tous les événements de la Saison Culturelle Africaine 2026. Foire d'Afrique, Juste Une Danse, Festival du Conte, Salon Made In Africa.",
};

export default async function BilletterieExposantsPage() {
  const fmt = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  // Nombre d'exposants par événement
  const bookingCounts = await Promise.all(
    EXHIBITOR_EVENTS.map(async (event) => {
      const count = await prisma.exhibitorBooking.count({
        where: {
          events: { has: event.id },
          status: { in: ["PARTIAL", "CONFIRMED"] },
        },
      });
      return { eventId: event.id, count };
    }),
  );

  const countMap = Object.fromEntries(
    bookingCounts.map((c) => [c.eventId, c.count]),
  );

  const now = new Date();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-dta-taupe mb-3">
          Saison Culturelle Africaine 2026
        </p>
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Billetterie Exposants
        </h1>
        <p className="mt-4 text-lg text-dta-char/70 max-w-2xl mx-auto">
          R&eacute;servez votre stand pour un ou plusieurs &eacute;v&eacute;nements
          de la saison. Paiement jusqu&apos;&agrave; 5 fois sans frais, &agrave;
          partir de 50&nbsp;&euro; d&apos;acompte.
        </p>
      </div>

      {/* Pack résumé */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {EXHIBITOR_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`rounded-xl border p-5 text-center ${
              pack.highlight
                ? "border-dta-accent bg-dta-accent/5"
                : "border-dta-sand bg-white"
            }`}
          >
            <p className="text-sm font-semibold text-dta-dark">{pack.name}</p>
            <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">
              {fmt.format(pack.pricePerDay)}
              <span className="text-sm font-normal text-dta-taupe">/jour</span>
            </p>
            <ul className="mt-3 space-y-1 text-xs text-dta-char/70">
              {pack.kit.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check size={12} className="text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Événements */}
      <h2 className="font-serif text-2xl font-bold text-dta-dark mb-6">
        &Eacute;v&eacute;nements de la saison
      </h2>

      <div className="space-y-6">
        {EXHIBITOR_EVENTS.map((event) => {
          const eventDate = new Date(event.date + "T12:00:00");
          const isPast = eventDate < now;
          const exposants = countMap[event.id] || 0;

          return (
            <div
              key={event.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                isPast ? "opacity-60 border-gray-200" : "border-dta-sand"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Date badge */}
                    <div className="flex-shrink-0 rounded-xl bg-dta-accent/10 px-3 py-2 text-center">
                      <span className="block text-[10px] font-bold uppercase text-dta-accent">
                        {eventDate.toLocaleDateString("fr-FR", {
                          month: "short",
                        })}
                      </span>
                      <span className="block font-serif text-xl font-bold text-dta-dark">
                        {eventDate.getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-dta-dark">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-dta-char/70 mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {formatDate(event.date)}
                          {event.endDate && ` — ${formatDate(event.endDate)}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {event.hours}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm text-dta-char/70">
                      <Store size={14} className="text-dta-accent" />
                      <strong>{exposants}</strong> exposant{exposants !== 1 ? "s" : ""} inscrit{exposants !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm text-dta-char/70">
                      {event.days} jour{event.days > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium text-dta-accent">
                      &agrave; partir de {fmt.format(
                        event.days === 1
                          ? EXHIBITOR_PACKS[0].pricePerDay
                          : EXHIBITOR_PACKS[1].pricePerDay * event.days,
                      )}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  {isPast ? (
                    <span className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-500">
                      Termin&eacute;
                    </span>
                  ) : (
                    <Link
                      href={`/resa-exposants/${event.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-dta-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark transition-colors"
                    >
                      R&eacute;server un stand
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pass saison */}
      <div className="mt-12 rounded-2xl border-2 border-dta-accent bg-dta-accent/5 p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-dta-dark mb-2">
          Pass Saison Compl&egrave;te
        </h3>
        <p className="text-dta-char/70 mb-4">
          Exposez sur <strong>tous les &eacute;v&eacute;nements</strong> de la
          saison 2026 et b&eacute;n&eacute;ficiez du tarif pr&eacute;f&eacute;rentiel.
        </p>
        <div className="flex items-center justify-center gap-6 mb-6">
          {EXHIBITOR_PACKS.filter((p) => p.id !== "RESTAURATION").map((pack) => (
            <div key={pack.id} className="text-center">
              <p className="text-xs text-dta-taupe">{pack.name}</p>
              <p className="font-serif text-lg font-bold text-dta-accent">
                {fmt.format(pack.allEventsPricePerDay)}
                <span className="text-xs font-normal text-dta-taupe">/jour</span>
              </p>
              <p className="text-xs text-green-600 line-through">
                {fmt.format(pack.pricePerDay)}/jour
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-2 rounded-full bg-dta-accent px-8 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Demander un devis saison
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Avantages */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl bg-white border border-dta-sand p-5 text-center">
          <p className="text-2xl mb-2">💳</p>
          <p className="font-semibold text-dta-dark text-sm">Paiement en 5x</p>
          <p className="text-xs text-dta-char/70 mt-1">
            Sans frais, &agrave; partir de 50&nbsp;&euro; d&apos;acompte
          </p>
        </div>
        <div className="rounded-xl bg-white border border-dta-sand p-5 text-center">
          <p className="text-2xl mb-2">📢</p>
          <p className="font-semibold text-dta-dark text-sm">Visibilit&eacute; incluse</p>
          <p className="text-xs text-dta-char/70 mt-1">
            Promotion sur 7 plateformes (FB, IG, X, LinkedIn, TikTok, L&apos;Afrop&eacute;en, L&apos;Officiel)
          </p>
        </div>
        <div className="rounded-xl bg-white border border-dta-sand p-5 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-semibold text-dta-dark text-sm">Emplacement au choix</p>
          <p className="text-xs text-dta-char/70 mt-1">
            Plan interactif pour choisir votre stand
          </p>
        </div>
      </div>
    </div>
  );
}
