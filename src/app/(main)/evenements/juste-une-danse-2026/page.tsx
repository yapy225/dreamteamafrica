import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Users, Music, Palette } from "lucide-react";
import ShareButton from "../[slug]/ShareButton";

export const metadata = {
  title: "Juste une Danse 2026",
  description:
    "Juste une Danse celebre la richesse des danses africaines traditionnelles et contemporaines — 31 octobre 2026, Paris.",
  openGraph: {
    title: "Juste une Danse 2026",
    description:
      "Zaouli, Ballet Diaspora Camerounaise, exposition artisanale et restauration africaine — 31 octobre 2026, Paris.",
    type: "website" as const,
  },
};

const programme = [
  {
    jour: "Samedi 31 octobre 2026",
    sessions: [
      {
        heure: "12h00",
        titre: "Ouverture",
        sousTitre: "Exposition artisanale & espace restauration africaine",
        description:
          "Decouvrez les stands d'artisans et savourez les saveurs du continent dans l'espace restauration dedie. Un moment convivial pour lancer la journee.",
        icon: "palette" as const,
      },
      {
        heure: "13h30",
        titre: "Zaouli",
        sousTitre: "Danse traditionnelle de Cote d'Ivoire",
        description:
          "Le mythique Zaouli, danse traditionnelle Gouro de Cote d'Ivoire, reconnue pour ses mouvements rapides et hypnotiques. Un spectacle envoutant celebrant l'heritage culturel ivoirien.",
        icon: "music" as const,
      },
      {
        heure: "15h00",
        titre: "Ballet Diaspora Camerounaise",
        sousTitre: "\"De la graine a la vie\"",
        description:
          "Le Ballet de la Diaspora Camerounaise presente son spectacle \"De la graine a la vie\", une oeuvre choreographique puissante explorant les racines, la croissance et la transmission culturelle.",
        icon: "music" as const,
      },
      {
        heure: "17h00",
        titre: "Final collectif",
        sousTitre: "Danses participatives",
        description:
          "Rejoignez les danseurs sur scene pour un final collectif et festif. Toutes les danses se melent dans un moment de partage et de celebration ouvert a tous.",
        icon: "users" as const,
      },
    ],
  },
];

const tiers = [
  {
    name: "Early Bird",
    price: "15 \u20AC",
    description: "Tarif reduit premiers inscrits",
    features: ["Acces a tous les spectacles", "Exposition artisanale", "Programme officiel"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "30 \u20AC",
    description: "Acces complet a la journee",
    features: ["Acces a tous les spectacles", "Exposition artisanale", "Espace restauration", "Programme officiel"],
    highlight: true,
  },
  {
    name: "Confort",
    price: "55 \u20AC",
    description: "Experience premium \u2014 Places reservees",
    features: ["Places assises reservees", "Acces prioritaire", "Exposition artisanale", "Espace restauration VIP", "Programme officiel"],
    highlight: false,
  },
];

function SessionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "music":
      return <Music size={22} className="text-dta-accent" />;
    case "users":
      return <Users size={22} className="text-dta-accent" />;
    case "palette":
    default:
      return <Palette size={22} className="text-dta-accent" />;
  }
}

export default function JusteUneDansePage() {
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
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">oct.</span>
                <span className="block font-serif text-5xl font-bold text-white">31</span>
              </div>
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                  Danse & Culture
                </span>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Juste une Danse 2026
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    31 octobre 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    Paris
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-dta-accent" />
                    12h — 18h
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
                <p className="text-sm font-medium text-dta-dark">31 octobre 2026</p>
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
                <p className="text-sm font-medium text-dta-dark">Lieu a confirmer, Paris</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Users size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Tarif</p>
                <p className="text-sm font-medium text-dta-dark">Des 15 \u20AC</p>
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
                  Juste une Danse celebre la richesse des danses africaines traditionnelles et contemporaines. Une journee exceptionnelle dediee a la danse sous toutes ses formes.
                </p>
                <p>
                  Au programme : le mythique <strong>Zaouli</strong> de Cote d&apos;Ivoire, danse traditionnelle Gouro aux mouvements rapides et envoutants, suivie du <strong>Ballet de la Diaspora Camerounaise</strong> avec leur spectacle &quot;De la graine a la vie&quot;, une oeuvre choreographique puissante sur les racines et la transmission.
                </p>
                <p>
                  L&apos;evenement propose egalement une exposition artisanale et un espace restauration africaine, pour une immersion complete dans la culture du continent. La journee se cloture par un final collectif et participatif ouvert a tous.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium text-dta-dark">Lieu a confirmer</p>
                  <p className="mt-1 text-sm text-dta-char/70">Paris</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Paris"
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
            <p className="mt-2 text-sm text-dta-sand/70">1 journee de spectacles et de partage</p>
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
            <p className="mt-2 text-sm text-dta-char/70">Reservez vos places pour Juste une Danse 2026</p>
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
