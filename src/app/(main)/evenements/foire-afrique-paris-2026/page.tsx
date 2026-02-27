import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Users, Music, Palette, UtensilsCrossed } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "Foire d'Afrique a Paris 2026",
  description:
    "La Foire d'Afrique a Paris reunit le meilleur de l'artisanat, de la gastronomie et de la mode africaine. 1er & 2 mai 2026, Espace MAS, Paris.",
  openGraph: {
    title: "Foire d'Afrique a Paris 2026",
    description:
      "Marche, conferences, ateliers et decouvertes culturelles au coeur de Paris — 1er & 2 mai 2026, Espace MAS.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Vendredi 1er mai 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Ouverture du marche africain",
        sousTitre: "Artisanat, mode, gastronomie",
        description:
          "Decouvrez les stands d'artisans, createurs de mode et restaurateurs venus de toute l'Afrique et de la diaspora. Un marche vibrant au coeur de Paris.",
        icon: "palette" as const,
      },
      {
        heure: "15h00",
        titre: "Conferences & tables rondes",
        sousTitre: "Entrepreneuriat et diaspora",
        description:
          "Echanges et debats autour de l'entrepreneuriat africain, du role de la diaspora et des opportunites economiques entre l'Afrique et l'Europe.",
        icon: "users" as const,
      },
      {
        heure: "19h00",
        titre: "Soiree musicale",
        sousTitre: "Live afrobeat & DJ set",
        description:
          "Cloturez la premiere journee en musique avec des artistes afrobeat live et un DJ set aux sonorités africaines contemporaines.",
        icon: "music" as const,
      },
    ],
  },
  {
    jour: "Samedi 2 mai 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Marche africain",
        sousTitre: "Suite des expositions",
        description:
          "Retrouvez l'ensemble des exposants pour une deuxieme journee de decouvertes, degustations et shopping.",
        icon: "palette" as const,
      },
      {
        heure: "14h00",
        titre: "Ateliers cuisine",
        sousTitre: "Decouverte culinaire africaine",
        description:
          "Participez a des ateliers de cuisine africaine animes par des chefs de la diaspora. Apprenez les secrets des plats emblematiques du continent.",
        icon: "utensils" as const,
      },
      {
        heure: "18h00",
        titre: "Defile de mode",
        sousTitre: "Createurs africains emergents",
        description:
          "Un defile exceptionnel mettant en lumiere les jeunes createurs africains et afro-descendants. Mode, tissus et savoir-faire d'exception.",
        icon: "palette" as const,
      },
    ],
  },
];

const tiers = [
  {
    name: "Early Bird",
    price: "5 \u20AC",
    description: "Acces aux 2 journees \u2014 Tarif limite premiere vague",
    features: ["Acces au marche", "Acces aux conferences", "Programme officiel"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "10 \u20AC",
    description: "Acces complet aux 2 journees",
    features: ["Acces au marche", "Acces aux conferences", "Ateliers inclus", "Programme officiel"],
    highlight: true,
  },
  {
    name: "Sur place",
    price: "15 \u20AC",
    description: "Billets disponibles a l'entree selon disponibilite",
    features: ["Acces au marche", "Programme officiel"],
    highlight: false,
  },
];

function SessionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "music":
      return <Music size={22} className="text-dta-accent" />;
    case "users":
      return <Users size={22} className="text-dta-accent" />;
    case "utensils":
      return <UtensilsCrossed size={22} className="text-dta-accent" />;
    case "palette":
    default:
      return <Palette size={22} className="text-dta-accent" />;
  }
}

export default function FoireAfriquePage() {
  return (
    <div>
      {/* A — Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-dta-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/evenements"
            className="flex items-center gap-2 text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={16} />
            Retour aux evenements
          </Link>
          <ShareButton />
        </div>
      </div>

      {/* B — Immersive Hero */}
      <div className="relative flex min-h-[70vh] items-end bg-dta-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_60%)]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_50%)] opacity-15" />

        <div className="relative w-full px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end gap-6">
              <div className="hidden flex-shrink-0 rounded-[var(--radius-card)] bg-white/10 px-6 py-5 text-center backdrop-blur-sm sm:block">
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">mai</span>
                <span className="block font-serif text-5xl font-bold text-white">1-2</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Marche & Culture
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Foire d&apos;Afrique a Paris 2026
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    1er & 2 mai 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Espace MAS, Paris
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-dta-accent" />
                    12h — 22h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C — Quick-Info Strip */}
      <div className="border-b border-dta-sand/50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Calendar size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Date</p>
                <p className="text-sm font-medium text-dta-dark">1er & 2 mai 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Horaires</p>
                <p className="text-sm font-medium text-dta-dark">12h — 22h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <MapPin size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Lieu</p>
                <p className="text-sm font-medium text-dta-dark">Espace MAS, Paris</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Users size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Tarif</p>
                <p className="text-sm font-medium text-dta-dark">Des 5 \u20AC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D — About */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">A propos de l&apos;evenement</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-dta-char/80">
                <p>
                  La Foire d&apos;Afrique a Paris reunit le meilleur de l&apos;artisanat, de la gastronomie et de la mode africaine. Deux jours de marche, conferences, ateliers et decouvertes culturelles au coeur de Paris.
                </p>
                <p>
                  Venez a la rencontre d&apos;artisans, de createurs de mode et de chefs cuisiniers venus de tout le continent africain et de la diaspora. Un rendez-vous incontournable pour celebrer la richesse et la diversite culturelle africaine.
                </p>
                <p>
                  Entre conferences sur l&apos;entrepreneuriat, ateliers culinaires immersifs et defile de mode, la Foire d&apos;Afrique a Paris offre une experience complete et festive pour toute la famille.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium text-dta-dark">Espace MAS</p>
                  <p className="mt-1 text-sm text-dta-char/70">Paris</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Espace+MAS+Paris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-beige px-4 py-2.5 text-sm font-medium text-dta-dark transition-colors hover:bg-dta-sand"
                  >
                    <ExternalLink size={14} />
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E — Programme */}
      <div className="bg-dta-dark py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-white">Programme</h2>
            <p className="mt-2 text-sm text-dta-sand/70">2 jours de marche, conferences et festivites</p>
          </div>
          <div className="mt-10 space-y-8">
            {programme.map((day) => (
              <div key={day.jour}>
                <h3 className="mb-4 font-serif text-xl font-bold text-dta-accent">{day.jour}</h3>
                <div className="space-y-4">
                  {day.sessions.map((session) => (
                    <div
                      key={session.titre}
                      className="rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                    >
                      <div className="flex flex-wrap items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/20">
                          <SessionIcon icon={session.icon} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold text-dta-accent">
                              {session.heure}
                            </span>
                          </div>
                          <h4 className="mt-2 font-serif text-lg font-bold text-white">{session.titre}</h4>
                          <p className="text-sm font-medium text-dta-accent/80">{session.sousTitre}</p>
                          <p className="mt-2 text-sm leading-relaxed text-dta-sand/70">{session.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* F — Billetterie */}
      <div className="bg-dta-beige py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark">Billetterie</h2>
            <p className="mt-2 text-sm text-dta-char/70">Reservez vos places pour la Foire d&apos;Afrique a Paris 2026</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight ? "ring-2 ring-dta-accent md:scale-105" : ""
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    Populaire
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-bold text-dta-dark">{tier.name}</h3>
                  <span className="font-serif text-2xl font-bold text-dta-accent">{tier.price}</span>
                </div>
                <p className="mt-1 text-xs text-dta-char/60">{tier.description}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-dta-char/70">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dta-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-6 block rounded-[var(--radius-button)] px-4 py-3 text-center text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
                      : "bg-dta-beige text-dta-dark hover:bg-dta-sand"
                  }`}
                >
                  Reserver
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* G — Footer CTA */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-dta-char/60">
            Des questions ?{" "}
            <Link href="/contact" className="font-medium text-dta-accent hover:text-dta-accent-dark">
              Contactez-nous
            </Link>
          </p>
          <Link
            href="/evenements"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-dta-char/50 transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={14} />
            Voir tous les evenements
          </Link>
        </div>
      </div>
    </div>
  );
}
