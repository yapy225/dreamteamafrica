import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Palette, UtensilsCrossed, Music, Users } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "Festival Autre Culture — Diversité culturelle africaine en plein air",
  description:
    "Le Festival Autre Culture célèbre la diversité culturelle africaine en plein air à Fontenay-sous-Bois. Prestations scéniques, danses traditionnelles, BBQ, exposition artisanale. Gratuit sur réservation.",
  openGraph: {
    title: "Festival Autre Culture — Diversité culturelle africaine en plein air",
    description:
      "Prestations scéniques, danses traditionnelles, BBQ plein air, exposition artisanale — Fontenay-sous-Bois, 2026.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Programme de la journée",
    sessions: [
      {
        heure: "11h00",
        titre: "Ouverture",
        sousTitre: "Accueil & exposition artisanale",
        description:
          "Découvrez les créations d'artisans africains : bijoux, tissus, sculptures et objets d'art. Un espace de rencontre et de découverte pour bien commencer la journée.",
        icon: "palette" as const,
      },
      {
        heure: "12h30",
        titre: "BBQ plein air",
        sousTitre: "Grillades et cuisine africaine",
        description:
          "Savourez des grillades et des spécialités culinaires africaines préparées sur place. Un moment convivial autour de la gastronomie du continent.",
        icon: "utensils" as const,
      },
      {
        heure: "14h00",
        titre: "Prestations scéniques",
        sousTitre: "Musique live & performances",
        description:
          "Artistes et musiciens se succèdent sur scène pour des performances live mêlant sonorités traditionnelles et contemporaines.",
        icon: "music" as const,
      },
      {
        heure: "15h30",
        titre: "Danses traditionnelles",
        sousTitre: "Spectacles de danse africaine",
        description:
          "Des troupes de danse présentent des spectacles vibrants, célébrant la richesse des traditions chorégraphiques du continent africain.",
        icon: "music2" as const,
      },
      {
        heure: "17h00",
        titre: "Clôture festive",
        sousTitre: "Danse participative",
        description:
          "Rejoignez la piste pour une clôture en musique et en danse. Tout le monde est invité à participer pour finir la journée en beauté.",
        icon: "users" as const,
      },
    ],
  },
];

const tiers = [
  {
    name: "Entrée gratuite",
    price: "Gratuit",
    description: "Sur réservation uniquement — Places limitées",
    features: ["Accès à toutes les activités", "BBQ plein air", "Exposition artisanale", "Spectacles & danses"],
    highlight: true,
  },
];

function ProgrammeIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "palette":
      return <Palette size={22} className="text-dta-accent" />;
    case "utensils":
      return <UtensilsCrossed size={22} className="text-dta-accent" />;
    case "music":
      return <Music size={22} className="text-dta-accent" />;
    case "music2":
      return <Music size={22} className="text-dta-accent" />;
    case "users":
      return <Users size={22} className="text-dta-accent" />;
    default:
      return <Palette size={22} className="text-dta-accent" />;
  }
}

export default function FestivalAutreCulturePage() {
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">2026</span>
                <span className="block font-serif text-5xl font-bold text-white">TBC</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Festival Plein Air
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Festival Autre Culture
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    Date à confirmer — 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Fontenay-sous-Bois
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-dta-accent" />
                    Gratuit sur réservation
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
                <p className="text-sm font-medium text-dta-dark">À confirmer — 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Horaires</p>
                <p className="text-sm font-medium text-dta-dark">11h00 — 17h00</p>
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
                <p className="text-sm font-medium text-dta-dark">Gratuit</p>
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
                  Le Festival Autre Culture célèbre la diversité culturelle africaine en plein air. Au programme : prestations scéniques, danses traditionnelles, BBQ plein air, exposition artisanale et moments de partage.
                </p>
                <p>
                  Un événement familial et festif, gratuit sur réservation, qui rassemble les communautés autour de la richesse des cultures africaines. Musique, danse, gastronomie et artisanat se mêlent pour une journée inoubliable.
                </p>
                <p>
                  Venez en famille ou entre amis découvrir les talents d&apos;artisans, savourer des grillades en plein air et vibrer au rythme des musiques et danses du continent.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium text-dta-dark">28 Av. de Neuilly</p>
                  <p className="mt-1 text-sm text-dta-char/70">94120 Fontenay-sous-Bois</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=28+Av+de+Neuilly+94120+Fontenay-sous-Bois"
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
            <p className="mt-2 text-sm text-dta-sand/70">1 journée de festivités en plein air</p>
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
            <p className="mt-2 text-sm text-dta-char/70">Événement gratuit — Réservation obligatoire</p>
          </div>
          <div className="mx-auto mt-10 max-w-md">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight ? "ring-2 ring-dta-accent" : ""
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    Entrée libre
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
                  className="mt-6 block rounded-[var(--radius-button)] bg-dta-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
                >
                  Réserver gratuitement
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
