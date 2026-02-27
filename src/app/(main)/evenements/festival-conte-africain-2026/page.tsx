import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, BookOpen, Music, Globe, Users, Palette } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "Sous l'Arbre à Palabre — Festival du Conte Africain 2026",
  description:
    "Festival du Conte Africain à Paris — 11 novembre 2026. Conteurs, griots, musiciens traditionnels et un pays invité surprise. Direction artistique : Ange Grah & Compagnie Bak In Gado.",
  openGraph: {
    title: "Sous l'Arbre à Palabre — Festival du Conte Africain 2026",
    description:
      "Un voyage au cœur de l'oralité africaine — Espace MAS, Paris, 11 novembre 2026.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Mercredi 11 novembre 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Ouverture",
        sousTitre: "Accueil & village du conte",
        description:
          "Ouverture officielle du festival. Découvrez le village du conte avec ses artisans, ses espaces de lecture et ses ateliers pour petits et grands.",
        icon: "palette",
      },
      {
        heure: "13h00",
        titre: "Contes d'Afrique de l'Ouest",
        sousTitre: "Griots & musiciens traditionnels",
        description:
          "Immersion dans la tradition orale ouest-africaine portée par des griots et musiciens d'exception. Récits ancestraux accompagnés de kora, balafon et djembé.",
        icon: "bookopen",
      },
      {
        heure: "14h30",
        titre: "Compagnie Bak In Gado",
        sousTitre: "Direction Ange Grah",
        description:
          "Spectacle de conte et musique par la Compagnie Bak In Gado sous la direction artistique d'Ange Grah. Un voyage entre tradition et modernité.",
        icon: "music",
      },
      {
        heure: "16h00",
        titre: "Pays invité surprise",
        sousTitre: "Spectacle inédit",
        description:
          "Un pays invité d'honneur sera révélé prochainement. Découvrez ses traditions orales à travers un spectacle exclusif créé pour le festival.",
        icon: "globe",
      },
      {
        heure: "17h30",
        titre: "Grand final",
        sousTitre: "Conte participatif & clôture",
        description:
          "Le festival se clôture par un grand conte participatif où le public devient acteur de l'histoire. Un moment de partage collectif unique.",
        icon: "users",
      },
    ],
  },
];

const tiers = [
  {
    name: "Early Bird",
    price: "15 €",
    description: "Tarif réduit premiers inscrits",
    features: ["Accès à tous les spectacles", "Village du conte", "Programme officiel"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "30 €",
    description: "Accès complet à la journée",
    features: ["Accès à tous les spectacles", "Village du conte", "Espace restauration", "Programme officiel"],
    highlight: true,
  },
  {
    name: "Confort",
    price: "55 €",
    description: "Expérience premium — Places réservées",
    features: [
      "Places assises réservées",
      "Accès prioritaire",
      "Village du conte",
      "Espace restauration VIP",
      "Rencontre artistes",
    ],
    highlight: false,
  },
];

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette size={22} className="text-dta-accent" />,
  bookopen: <BookOpen size={22} className="text-dta-accent" />,
  music: <Music size={22} className="text-dta-accent" />,
  globe: <Globe size={22} className="text-dta-accent" />,
  users: <Users size={22} className="text-dta-accent" />,
};

export default function FestivalConteAfricainPage() {
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
            Retour aux événements
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">nov.</span>
                <span className="block font-serif text-5xl font-bold text-white">11</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Conte & Tradition
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Sous l&apos;Arbre à Palabre — Festival du Conte Africain
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    11 novembre 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Espace MAS, Paris
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-dta-accent" />
                    Direction artistique : Ange Grah
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
                <p className="text-sm font-medium text-dta-dark">11 novembre 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Horaires</p>
                <p className="text-sm font-medium text-dta-dark">12h — 18h</p>
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
                <p className="text-sm font-medium text-dta-dark">Dès 15 €</p>
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
              <h2 className="font-serif text-2xl font-bold text-dta-dark">À propos du festival</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-dta-char/80">
                <p>
                  Le Festival du Conte Africain &laquo;&nbsp;Sous l&apos;Arbre à Palabre&nbsp;&raquo; vous invite à un voyage au
                  cœur de l&apos;oralité africaine. Direction artistique assurée par Ange Grah et la Compagnie Bak In
                  Gado.
                </p>
                <p>
                  Au programme : conteurs d&apos;exception, griots, musiciens traditionnels et un pays invité surprise
                  qui sera révélé prochainement.
                </p>
                <p>
                  Une journée unique pour découvrir la richesse des traditions orales africaines, où chaque récit
                  transporte le public dans un univers de sagesse, d&apos;humour et de poésie.
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
            <p className="mt-2 text-sm text-dta-sand/70">1 journée, 5 temps forts</p>
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
                          {iconMap[session.icon]}
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
            <p className="mt-2 text-sm text-dta-char/70">Réservez vos places pour le Festival du Conte Africain 2026</p>
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
                  Réserver
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
            Voir tous les événements
          </Link>
        </div>
      </div>
    </div>
  );
}
