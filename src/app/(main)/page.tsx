import Link from "next/link";
import { Calendar, ShoppingBag, Newspaper, Megaphone } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Événements culturels",
    description:
      "7 événements exclusifs d'avril à décembre 2026. Cinéma, musique, danse, gastronomie et artisanat africain.",
    href: "/evenements",
    cta: "Voir le programme",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace artisanale",
    description:
      "Découvrez les créations uniques d'artisans africains. Mode, bijoux, décoration et bien plus.",
    href: "/marketplace",
    cta: "Explorer la boutique",
  },
  {
    icon: Newspaper,
    title: "L'Afropéen",
    description:
      "Le journal de la diaspora africaine en Europe. Actualités, culture, business et lifestyle.",
    href: "/journal",
    cta: "Lire le journal",
  },
  {
    icon: Megaphone,
    title: "DTA Ads",
    description:
      "Boostez votre visibilité auprès de la communauté africaine de Paris. Articles sponsorisés, bannières et vidéos.",
    href: "/ads",
    cta: "En savoir plus",
  },
];

const upcomingEvents = [
  { month: "AVR", day: "3", title: "Festival International du Cinéma Africain", venue: "Cinéma Kosmos, Fontenay-sous-Bois" },
  { month: "MAI", day: "1", title: "Foire D'Afrique Paris", venue: "Espace Mas, Paris" },
  { month: "JUN", day: "13", title: "Évasion Paris", venue: "La Seine, Paris" },
  { month: "JUN", day: "27", title: "Festival de l'Autre Culture", venue: "Parc des Épivans, Fontenay-sous-Bois" },
  { month: "OCT", day: "31", title: "Juste Une Danse", venue: "Espace Mas, Paris" },
  { month: "NOV", day: "11", title: "Festival du Conte Africain", venue: "Espace Mas, Paris" },
  { month: "DÉC", day: "11", title: "Salon Made In Africa", venue: "Espace Mas, Paris" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dta-dark px-4 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-dta-dark via-dta-char to-dta-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-dta-accent">
              Saison 2026
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              La culture africaine
              <br />
              <span className="text-dta-accent">rayonne à Paris</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-dta-sand">
              Événements exclusifs, marketplace artisanale et journal de la
              diaspora. Rejoignez la communauté Dream Team Africa.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/evenements"
                className="inline-flex items-center justify-center rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark hover:shadow-lg"
              >
                Découvrir les événements
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-[var(--radius-button)] border border-dta-taupe/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-dta-accent hover:text-dta-accent"
              >
                Explorer la marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
              Votre plateforme culturelle
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-dta-char/70">
              Dream Team Africa réunit événements, commerce et média pour
              célébrer la richesse de la culture africaine en Europe.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-[var(--radius-button)] bg-dta-accent/10 p-3 text-dta-accent transition-colors group-hover:bg-dta-accent group-hover:text-white">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-dta-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dta-char/70">
                  {feature.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-dta-accent transition-colors group-hover:text-dta-accent-dark">
                  {feature.cta} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
                Prochains événements
              </h2>
              <p className="mt-3 text-dta-char/70">
                Saison culturelle 2026 — Avril à Décembre
              </p>
            </div>
            <Link
              href="/evenements"
              className="hidden text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:block"
            >
              Tout voir &rarr;
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex-shrink-0 rounded-[var(--radius-button)] bg-dta-accent/10 px-3 py-2 text-center">
                  <span className="block text-xs font-semibold uppercase text-dta-accent">
                    {event.month}
                  </span>
                  <span className="block font-serif text-2xl font-bold text-dta-dark">
                    {event.day}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold leading-snug text-dta-dark">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs text-dta-taupe">{event.venue}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/evenements"
              className="text-sm font-medium text-dta-accent"
            >
              Voir tous les événements &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="rounded-[var(--radius-card)] bg-dta-dark px-8 py-16 text-center sm:px-16">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Rejoignez la communauté
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-dta-sand">
              Que vous soyez amateur de culture, artisan créateur ou
              professionnel, Dream Team Africa est votre plateforme.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark"
              >
                Créer un compte
              </Link>
              <Link
                href="/auth/signup?role=artisan"
                className="inline-flex items-center rounded-[var(--radius-button)] border border-dta-taupe/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-dta-accent"
              >
                Devenir artisan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
