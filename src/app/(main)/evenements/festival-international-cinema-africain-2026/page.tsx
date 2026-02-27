import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Film, Users } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "FICA — Festival International du Cinéma Africain 2026",
  description:
    "Festival International du Cinéma Africain à Fontenay-sous-Bois — 3 & 4 avril 2026. Projections, débats et rencontres autour du cinéma africain.",
  openGraph: {
    title: "FICA — Festival International du Cinéma Africain 2026",
    description:
      "Projections, débats et rencontres autour du cinéma africain — Fontenay-sous-Bois, 3 & 4 avril 2026.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Vendredi 3 avril 2026",
    sessions: [
      {
        heure: "20h30",
        lieu: "Cinéma Kosmos",
        adresse: "243 Av. de la République, 94120 Fontenay-sous-Bois",
        titre: "Dahomey",
        sousTitre: "Film de Mati Diop — Ours d'Or, Berlinale 2024",
        description:
          "Projection du documentaire primé de Mati Diop, suivi d'un débat avec des spécialistes du patrimoine culturel africain. Le film explore le retour de 26 trésors royaux du Dahomey, pillés par les troupes coloniales françaises en 1892.",
        prix: "7 €",
        icon: "film",
      },
    ],
  },
  {
    jour: "Samedi 4 avril 2026",
    sessions: [
      {
        heure: "14h00",
        lieu: "Maison des Citoyens",
        adresse: "16 Rue du Révérend Père Aubry, 94120 Fontenay-sous-Bois",
        titre: "Les Ministres des poubelles",
        sousTitre: "Documentaire — Projection & débat",
        description:
          "Projection suivie d'un échange avec le réalisateur. Un regard poignant sur le quotidien des travailleurs de la collecte des déchets en Afrique de l'Ouest.",
        prix: "Gratuit sur réservation",
        icon: "film",
      },
    ],
  },
];

const tiers = [
  {
    name: "Projection Vendredi",
    price: "7 €",
    description: "Cinéma Kosmos — Dahomey de Mati Diop",
    features: ["Accès à la projection", "Débat post-projection", "Programme du festival"],
    highlight: true,
  },
  {
    name: "Projection Samedi",
    price: "Gratuit",
    description: "Maison des Citoyens — Les Ministres des poubelles",
    features: ["Accès à la projection", "Débat avec le réalisateur", "Sur réservation uniquement"],
    highlight: false,
  },
];

export default function FICAPage() {
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">avr.</span>
                <span className="block font-serif text-5xl font-bold text-white">3-4</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Festival de Cinéma
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Festival International du Cinéma Africain
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    3 & 4 avril 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Fontenay-sous-Bois
                  </span>
                  <span className="flex items-center gap-2">
                    <Film size={16} className="text-dta-accent" />
                    Partenaire : Ciné Club Afro
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
                <p className="text-sm font-medium text-dta-dark">3 & 4 avril 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Horaires</p>
                <p className="text-sm font-medium text-dta-dark">14h00 — 22h30</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <MapPin size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Lieu</p>
                <p className="text-sm font-medium text-dta-dark">Fontenay-sous-Bois</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Users size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Tarif</p>
                <p className="text-sm font-medium text-dta-dark">Dès 7 € / Gratuit</p>
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
                  Le Festival International du Cinéma Africain (FICA) revient à Fontenay-sous-Bois pour sa nouvelle édition 2026. Deux jours de projections, de débats et de rencontres autour du cinéma africain contemporain.
                </p>
                <p>
                  Au programme : des films primés dans les plus grands festivals internationaux, des échanges avec les réalisateurs et des moments de partage autour de la richesse culturelle du continent africain.
                </p>
                <p>
                  En partenariat avec le <strong>Ciné Club Afro</strong>, le FICA propose une programmation exigeante et accessible, mêlant documentaires engagés et fictions audacieuses.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieux</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium text-dta-dark">Cinéma Kosmos</p>
                  <p className="mt-1 text-sm text-dta-char/70">243 Av. de la République, 94120 Fontenay-sous-Bois</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Cin%C3%A9ma+Kosmos+Fontenay-sous-Bois"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-beige px-4 py-2.5 text-sm font-medium text-dta-dark transition-colors hover:bg-dta-sand"
                  >
                    <ExternalLink size={14} />
                    Google Maps
                  </a>
                </div>
                <div className="border-t border-dta-sand/50 pt-4">
                  <p className="font-medium text-dta-dark">Maison des Citoyens</p>
                  <p className="mt-1 text-sm text-dta-char/70">16 Rue du Révérend Père Aubry, 94120 Fontenay-sous-Bois</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Maison+des+Citoyens+Fontenay-sous-Bois"
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
            <p className="mt-2 text-sm text-dta-sand/70">2 jours, 2 projections, 2 lieux</p>
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
                          <Film size={22} className="text-dta-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold text-dta-accent">
                              {session.heure}
                            </span>
                            <span className="text-xs text-dta-sand/60">{session.lieu}</span>
                          </div>
                          <h4 className="mt-2 font-serif text-lg font-bold text-white">{session.titre}</h4>
                          <p className="text-sm font-medium text-dta-accent/80">{session.sousTitre}</p>
                          <p className="mt-2 text-sm leading-relaxed text-dta-sand/70">{session.description}</p>
                          <div className="mt-3">
                            <span className="rounded-[var(--radius-full)] bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                              {session.prix}
                            </span>
                          </div>
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
            <p className="mt-2 text-sm text-dta-char/70">Réservez vos places pour le FICA 2026</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight ? "ring-2 ring-dta-accent md:scale-105" : ""
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    Événement phare
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
