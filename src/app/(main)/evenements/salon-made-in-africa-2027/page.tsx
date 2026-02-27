import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Palette, UtensilsCrossed, Music, Users } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "Salon Made in Africa — Le Savoir-Faire Africain 2026",
  description:
    "Salon Made in Africa, le premier Marché de Noël Africain à Paris — 11 & 12 décembre 2026. Artisanat, mode, gastronomie et arts africains à l'Espace MAS.",
  openGraph: {
    title: "Salon Made in Africa — Le Savoir-Faire Africain 2026",
    description:
      "Le premier Marché de Noël Africain à Paris — Espace MAS, 11 & 12 décembre 2026.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Vendredi 11 décembre 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Ouverture du marché de Noël africain",
        sousTitre: "Artisanat, mode & gastronomie",
        description:
          "Ouverture officielle du Salon Made in Africa. Découvrez les stands d'artisans, créateurs et restaurateurs venus de tout le continent.",
        icon: "palette",
      },
      {
        heure: "14h00",
        titre: "Ateliers artisanat",
        sousTitre: "Tissage, poterie, couture",
        description:
          "Participez à des ateliers pratiques animés par des artisans africains. Initiez-vous au tissage de kenté, à la poterie traditionnelle et à la couture de wax.",
        icon: "palette",
      },
      {
        heure: "17h00",
        titre: "Dégustation",
        sousTitre: "Cuisine africaine festive",
        description:
          "Un voyage culinaire à travers le continent : plats traditionnels revisités pour les fêtes, pâtisseries africaines et boissons artisanales.",
        icon: "utensilscrossed",
      },
      {
        heure: "20h00",
        titre: "Concert live",
        sousTitre: "Musique africaine contemporaine",
        description:
          "Soirée musicale avec des artistes de la scène afro contemporaine. Afrobeats, rumba, coupé-décalé et highlife pour lancer les festivités.",
        icon: "music",
      },
    ],
  },
  {
    jour: "Samedi 12 décembre 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Marché de Noël",
        sousTitre: "Suite des expositions",
        description:
          "Le marché reprend avec de nouveaux produits et créations. Trouvez des cadeaux de Noël uniques et authentiques, fabriqués en Afrique.",
        icon: "palette",
      },
      {
        heure: "14h00",
        titre: "Défilé de mode",
        sousTitre: "Créateurs Made in Africa",
        description:
          "Défilé de mode mettant en lumière les créateurs africains. Prêt-à-porter, haute couture et accessoires inspirés du savoir-faire continental.",
        icon: "palette",
      },
      {
        heure: "16h00",
        titre: "Conférences",
        sousTitre: "Entreprendre en Afrique",
        description:
          "Tables rondes et témoignages d'entrepreneurs africains. Échanges sur les opportunités, les défis et l'avenir de l'entrepreneuriat sur le continent.",
        icon: "users",
      },
      {
        heure: "20h00",
        titre: "Soirée de clôture",
        sousTitre: "DJ set afro",
        description:
          "Grande soirée de clôture avec DJ set aux sonorités afro. Ambiance festive pour célébrer la fin de cette première édition du Salon Made in Africa.",
        icon: "music",
      },
    ],
  },
];

const tiers = [
  {
    name: "Early Bird",
    price: "5 €",
    description: "Accès aux 2 journées — Tarif limité",
    features: ["Accès au marché", "Accès aux ateliers", "Programme officiel"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "10 €",
    description: "Accès complet aux 2 journées",
    features: ["Accès au marché", "Accès aux ateliers", "Concerts inclus", "Programme officiel"],
    highlight: true,
  },
  {
    name: "Sur place",
    price: "15 €",
    description: "Billets à l'entrée selon disponibilité",
    features: ["Accès au marché", "Programme officiel"],
    highlight: false,
  },
];

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette size={22} className="text-dta-accent" />,
  utensilscrossed: <UtensilsCrossed size={22} className="text-dta-accent" />,
  music: <Music size={22} className="text-dta-accent" />,
  users: <Users size={22} className="text-dta-accent" />,
};

export default function SalonMadeInAfricaPage() {
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">déc.</span>
                <span className="block font-serif text-5xl font-bold text-white">11-12</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Marché de Noël
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Salon Made in Africa — Le Savoir-Faire Africain
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    11 & 12 décembre 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Espace MAS, Paris
                  </span>
                  <span className="flex items-center gap-2">
                    <Palette size={16} className="text-dta-accent" />
                    Artisanat, Mode & Gastronomie
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
                <p className="text-sm font-medium text-dta-dark">11 & 12 décembre 2026</p>
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
                <p className="text-sm font-medium text-dta-dark">Dès 5 €</p>
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
              <h2 className="font-serif text-2xl font-bold text-dta-dark">À propos du salon</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-dta-char/80">
                <p>
                  Le Salon Made in Africa est le premier Marché de Noël Africain à Paris. Découvrez le savoir-faire
                  africain à travers l&apos;artisanat, la mode, la gastronomie et les arts.
                </p>
                <p>
                  Deux jours d&apos;expositions, ateliers, défilés et rencontres pour célébrer la créativité africaine
                  pendant les fêtes.
                </p>
                <p>
                  Une occasion unique de découvrir des créateurs talentueux, de déguster des saveurs du continent et de
                  trouver des cadeaux de Noël authentiques et originaux.
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
            <p className="mt-2 text-sm text-dta-sand/70">2 jours, 8 temps forts</p>
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
            <p className="mt-2 text-sm text-dta-char/70">Réservez vos places pour le Salon Made in Africa 2026</p>
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
