import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Palette, UtensilsCrossed, Music, Wine, Shirt } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "LUXURY BOAT PARTY by YVY'S — Fashion Week Africa Paris",
  description:
    "Croisière exclusive sur la Seine — Défilés maillots de bain Afro & lingerie, cocktail, champagne, finger food et DJ set. Samedi 13 juin 2026, Paris. Dress code : ALL IN WHITE.",
  openGraph: {
    title: "LUXURY BOAT PARTY by YVY'S — Fashion Week Africa Paris",
    description:
      "Croisière privée sur la Seine — Défilés, champagne, DJ set. Samedi 13 juin 2026, Paris. Dress code ALL IN WHITE.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Samedi 13 juin 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Embarquement",
        sousTitre: "Accueil champagne & cocktail de bienvenue",
        description:
          "Montez à bord et laissez-vous accueillir avec une coupe de champagne et un cocktail de bienvenue. L'aventure Fashion Week sur la Seine commence ici.",
        icon: "wine" as const,
      },
      {
        heure: "13h00",
        titre: "Défilé maillots de bain Afro",
        sousTitre: "Créateurs africains",
        description:
          "Découvrez les collections de créateurs africains émergents lors d'un défilé exclusif de maillots de bain aux inspirations afro, avec la Seine comme décor.",
        icon: "palette" as const,
      },
      {
        heure: "14h00",
        titre: "Défilé lingerie",
        sousTitre: "Collections exclusives",
        description:
          "Un défilé lingerie d'exception mettant en lumière des collections exclusives de créateurs africains. Élégance, audace et savoir-faire au rendez-vous.",
        icon: "palette2" as const,
      },
      {
        heure: "14h45",
        titre: "Finger food & champagne",
        sousTitre: "Pause gastronomique",
        description:
          "Savourez une sélection raffinée de finger food accompagnée de champagne. Un moment de convivialité et de gourmandise entre les défilés.",
        icon: "utensils" as const,
      },
      {
        heure: "15h00",
        titre: "DJ Set",
        sousTitre: "Afrobeats & amapiano on the Seine",
        description:
          "Le DJ prend les commandes pour un set envoûtant mêlant afrobeats, amapiano et sonorités actuelles. Dansez sur la Seine avec Paris en toile de fond.",
        icon: "music" as const,
      },
      {
        heure: "16h00",
        titre: "Débarquement",
        sousTitre: "Fin de la croisière",
        description:
          "Retour au quai après quatre heures d'exception. Gardez en mémoire cette expérience unique Fashion Week sur la Seine.",
        icon: "mappin" as const,
      },
    ],
  },
];

const tiers = [
  {
    name: "Queen / King",
    price: "150 €",
    description: "L'expérience Fashion Week sur la Seine",
    features: [
      "Croisière privée",
      "Cocktail de bienvenue",
      "Champagne & finger food",
      "Accès défilés",
      "DJ set",
      "Dress code ALL IN WHITE",
    ],
    highlight: true,
    badge: "Fashion Week",
  },
  {
    name: "VIP",
    price: "250 €",
    description: "Le privilège ultime — Accès exclusif",
    features: [
      "Tout Queen/King inclus",
      "Espace VIP privatif",
      "Bouteille de champagne",
      "Place front row défilés",
      "Accès backstage",
      "Cadeau surprise",
    ],
    highlight: false,
    badge: null,
  },
];

function ProgrammeIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "wine":
      return <Wine size={22} className="text-dta-accent" />;
    case "palette":
      return <Palette size={22} className="text-dta-accent" />;
    case "palette2":
      return <Palette size={22} className="text-dta-accent" />;
    case "utensils":
      return <UtensilsCrossed size={22} className="text-dta-accent" />;
    case "music":
      return <Music size={22} className="text-dta-accent" />;
    case "mappin":
      return <MapPin size={22} className="text-dta-accent" />;
    default:
      return <Palette size={22} className="text-dta-accent" />;
  }
}

export default function LuxuryBoatPartyPage() {
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">juin</span>
                <span className="block font-serif text-5xl font-bold text-white">13</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Croisière Privée
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  LUXURY BOAT PARTY by YVY&apos;S
                </h1>
                <p className="mt-2 text-lg font-medium text-dta-accent">Fashion Week Africa Paris</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    Samedi 13 juin 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Croisière sur la Seine, Paris
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-dta-accent" />
                    12h — 16h
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
                <p className="text-sm font-medium text-dta-dark">Samedi 13 juin 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Horaires</p>
                <p className="text-sm font-medium text-dta-dark">12h — 16h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <MapPin size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Lieu</p>
                <p className="text-sm font-medium text-dta-dark">Seine, Paris</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Shirt size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Dress code</p>
                <p className="text-sm font-medium text-dta-dark">ALL IN WHITE</p>
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
              <h2 className="font-serif text-2xl font-bold text-dta-dark">À propos de l&apos;événement</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-dta-char/80">
                <p>
                  La <strong>LUXURY BOAT PARTY by YVY&apos;S</strong> est l&apos;événement mode incontournable de la Fashion Week Africa Paris. Embarquez pour une croisière exclusive sur la Seine avec défilés maillots de bain Afro & lingerie, cocktail, champagne, finger food et DJ set.
                </p>
                <p>
                  Pendant quatre heures, vivez une expérience premium au fil de l&apos;eau avec Paris comme décor. Des créateurs africains présentent leurs collections dans un cadre d&apos;exception, entre élégance et festivité.
                </p>
                <p>
                  <strong>Dress code obligatoire : ALL IN WHITE.</strong> Une expérience unique alliant mode, gastronomie et musique sur les eaux de la Seine.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium text-dta-dark">Croisière privée sur la Seine</p>
                  <p className="mt-1 text-sm text-dta-char/70">Point d&apos;embarquement communiqué par email après réservation</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Croisi%C3%A8re+Seine+Paris"
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
            <p className="mt-2 text-sm text-dta-sand/70">4 heures d&apos;exception sur la Seine</p>
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
                          <ProgrammeIcon icon={session.icon} />
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
            <p className="mt-2 text-sm text-dta-char/70">Réservez votre place pour la croisière Fashion Week</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight ? "ring-2 ring-dta-accent md:scale-105" : ""
                }`}
              >
                {tier.badge && (
                  <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
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
