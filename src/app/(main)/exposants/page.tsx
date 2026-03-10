import Link from "next/link";
import { CalendarDays, MapPin, Clock, Check, Star } from "lucide-react";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS, formatDate } from "@/lib/exhibitor-events";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Devenir Exposant — Foire d'Afrique Paris & Salons 2026",
  description:
    "Réservez votre stand exposant pour la Foire d'Afrique Paris, Salon Made In Africa et 4 autres événements. À partir de 350€, paiement en 5 fois sans frais.",
  keywords: [
    "exposer salon africain Paris",
    "devenir exposant salon africain",
    "stand exposition africaine Paris",
    "exposant foire d'Afrique Paris",
    "inscription salon africain Paris",
    "salon artisanat africain Paris",
  ],
  openGraph: {
    title: "Devenir Exposant — Saison Culturelle Africaine 2026",
    description: "Réservez votre stand pour la Foire d'Afrique Paris et les salons de la Saison Culturelle Africaine 2026.",
    type: "website",
    url: `${siteUrl}/exposants`,
  },
  alternates: {
    canonical: `${siteUrl}/exposants`,
  },
};

const exposantJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Devenir Exposant — Saison Culturelle Africaine 2026",
  description: "Réservez votre stand exposant pour la Foire d'Afrique Paris et les salons africains à Paris.",
  url: `${siteUrl}/exposants`,
  provider: {
    "@type": "Organization",
    name: "Dream Team Africa",
    url: siteUrl,
  },
};

export default function ExposantsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exposantJsonLd) }} />
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Devenez Exposant
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          Saison Culturelle Africaine 2026 — 4 événements, 6 jours
          d&apos;exposition pour faire rayonner votre activité
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-dta-taupe">
          <MapPin size={16} />
          <span>Espace MAS — Paris 13e</span>
        </div>
      </section>

      {/* Événements */}
      <section className="mb-16">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          Les 4 événements de la saison
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {EXHIBITOR_EVENTS.map((event) => (
            <div
              key={event.id}
              className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                {event.title}
              </h3>
              <div className="mt-3 space-y-1.5 text-sm text-dta-char/70">
                <p className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-dta-accent" />
                  {formatDate(event.date)}
                  {event.endDate && ` — ${formatDate(event.endDate)}`}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-dta-accent" />
                  {event.hours}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-dta-accent" />
                  {event.venue} — {event.address}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-2xl font-bold text-dta-dark">
                    {event.days}
                  </span>
                  <span className="text-sm text-dta-taupe">
                    jour{event.days > 1 ? "s" : ""} d&apos;exposition
                  </span>
                </div>
                <Link
                  href={`/resa-exposants/${event.id}`}
                  className="rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-xs font-semibold text-white hover:bg-dta-accent-dark"
                >
                  R&eacute;server
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="mb-16">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          Nos formules
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {EXHIBITOR_PACKS.map((pack) => {
            const totalSaison =
              pack.id === "SAISON"
                ? EXHIBITOR_EVENTS.reduce((s, e) => s + e.days, 0) *
                  pack.pricePerDay
                : null;

            return (
              <div
                key={pack.id}
                className={`relative rounded-[var(--radius-card)] border bg-white p-7 shadow-[var(--shadow-card)] ${
                  pack.highlight
                    ? "border-dta-accent ring-2 ring-dta-accent/20"
                    : "border-dta-sand"
                }`}
              >
                {pack.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-dta-accent px-3 py-0.5 text-xs font-semibold text-white">
                    Populaire
                  </div>
                )}

                <h3 className="font-serif text-xl font-bold text-dta-dark">
                  {pack.name}
                </h3>
                <p className="mt-2 text-sm text-dta-char/70">
                  {pack.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-bold text-dta-dark">
                    {pack.pricePerDay} &euro;
                  </span>
                  <span className="text-sm text-dta-taupe">/ jour</span>
                </div>

                {totalSaison && (
                  <p className="mt-1 text-sm font-medium text-dta-accent">
                    6 jours ={" "}
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(totalSaison)}{" "}
                    <span className="text-dta-taupe line-through">960 &euro;</span>
                  </p>
                )}

                <div className="mt-5 border-t border-dta-sand pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                    Kit exposant inclus
                  </p>
                  <ul className="space-y-2">
                    {pack.kit.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-dta-char"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-dta-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={pack.id === "SAISON" ? "/exposants/reservation?pack=SAISON" : `/resa-exposants/foire-dafrique-paris?pack=${pack.id}`}
                  className={`mt-6 block w-full rounded-[var(--radius-button)] px-4 py-3 text-center text-sm font-semibold transition-all ${
                    pack.highlight
                      ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
                      : "bg-dta-dark text-white hover:bg-dta-char"
                  }`}
                >
                  R&eacute;server mon stand
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Paiement fractionné */}
      <section className="mb-16 rounded-[var(--radius-card)] bg-dta-dark p-8 text-center text-white sm:p-12">
        <Star size={32} className="mx-auto mb-4 text-dta-accent" />
        <h2 className="font-serif text-2xl font-bold">
          Paiement jusqu&apos;en 5 fois sans frais
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
          R&eacute;servation confirm&eacute;e apr&egrave;s paiement ou acompte.
          Facture officielle transmise. Aucun statut sp&eacute;cifique
          exig&eacute; si vous &ecirc;tes d&eacute;clar&eacute;(e) dans votre
          pays ou en France.
        </p>
        <Link
          href="/exposants/reservation?pack=SAISON"
          className="mt-6 inline-block rounded-[var(--radius-button)] bg-dta-accent px-8 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          R&eacute;server maintenant
        </Link>
      </section>
    </div>
  );
}
