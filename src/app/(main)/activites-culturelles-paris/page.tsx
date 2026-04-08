import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Compass,
} from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

/* ------------------------------------------------------------------ */
/*  SEO                                                                */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title:
    "Activités culturelles à Paris 2026 — nos meilleures recommandations",
  description:
    "Découvrez les meilleures activités culturelles à Paris en 2026 : musées, croisières, spectacles et expériences uniques. Sélection par Dream Team Africa.",
  openGraph: {
    title:
      "Activités culturelles à Paris 2026 — Dream Team Africa",
    description:
      "Musées, croisières, spectacles et food tours : notre sélection des meilleures expériences culturelles à Paris.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  Données saison DTA                                                 */
/* ------------------------------------------------------------------ */

const SAISON_EVENTS = [
  {
    title: "Festival International du Cinéma Africain",
    date: "4-5 avril 2026",
    slug: "festival-international-cinema-africain-2026",
    emoji: "🎬",
  },
  {
    title: "Foire d'Afrique Paris",
    date: "1-2 mai 2026",
    slug: "foire-dafrique-paris",
    emoji: "🏪",
  },
  {
    title: "Évasion Paris",
    date: "13 juin 2026",
    slug: "evasion-paris-2026",
    emoji: "🚢",
  },
  {
    title: "Festival de l'Autre Culture",
    date: "27 juin 2026",
    slug: "festival-autre-culture-2026",
    emoji: "🎶",
  },
  {
    title: "Juste Une Danse",
    date: "31 octobre 2026",
    slug: "juste-une-danse-2026",
    emoji: "💃",
  },
  {
    title: "Festival du Conte Africain",
    date: "11 novembre 2026",
    slug: "festival-conte-africain-2026",
    emoji: "📖",
  },
  {
    title: "Salon Made In Africa",
    date: "11-12 décembre 2026",
    slug: "salon-made-in-africa-2026",
    emoji: "🎨",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ActivitesCulturellesParis() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Compass size={16} />
            Guide
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Les meilleures activités culturelles
            <br className="hidden sm:block" /> à Paris en 2026
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Vous venez à Paris pour la{" "}
            <Link
              href="/saison-culturelle-africaine"
              className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent"
            >
              Saison Culturelle Africaine 2026
            </Link>{" "}
            ? Profitez de votre séjour pour découvrir le meilleur de la
            capitale : musées incontournables, croisières sur la Seine,
            spectacles vivants et expériences gastronomiques. Voici notre
            sélection coup de cœur pour enrichir votre voyage.
          </p>
        </div>
      </section>

      {/* Section 1 — Musées */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="museums"
          title="Visites & musées incontournables"
          subtitle="Le musée du quai Branly abrite l'une des plus belles collections d'art africain au monde — à ne pas manquer si vous venez pour la Foire d'Afrique."
          maxItems={4}
          utmSource="page-activites"
          eventName="la Foire d'Afrique Paris"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Section 2 — Croisières */}
      <div className="bg-dta-bg">
        <GetYourGuideWidget
          city="Paris"
          theme="cruises"
          title="Croisières & promenades sur la Seine"
          subtitle="Notre événement Évasion Paris du 13 juin vous propose une croisière culturelle exclusive. En attendant, voici nos recommandations."
          maxItems={3}
          utmSource="page-activites"
          eventName="Évasion Paris"
          eventSlug="evasion-paris-2026"
        />
      </div>

      {/* Section 3 — Spectacles */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="shows"
          title="Spectacles & performances"
          subtitle="Paris vibre au rythme des cabarets, concerts et spectacles. Idéal à combiner avec nos festivals de danse et de conte."
          maxItems={3}
          utmSource="page-activites"
          eventName="Juste Une Danse"
          eventSlug="juste-une-danse-2026"
        />
      </div>

      {/* Section 4 — Gastronomie */}
      <div className="bg-dta-bg">
        <GetYourGuideWidget
          city="Paris"
          theme="food"
          title="Expériences gastronomiques"
          subtitle="Food tours, cours de cuisine et dégustations : la gastronomie parisienne s'explore aussi à pied."
          maxItems={3}
          utmSource="page-activites"
        />
      </div>

      {/* Section 5 — Saison Culturelle Africaine */}
      <section className="bg-gradient-to-b from-white to-dta-beige/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-dta-accent">
              Dream Team Africa
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              La Saison Culturelle Africaine 2026
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-dta-char/70">
              7 événements exceptionnels célébrant la richesse culturelle
              africaine à Paris, d&apos;avril à décembre 2026.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAISON_EVENTS.map((evt) => (
              <Link
                key={evt.slug}
                href={`/saison-culturelle-africaine/${evt.slug}`}
                className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="text-2xl">{evt.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-dta-dark transition-colors group-hover:text-dta-accent">
                    {evt.title}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-dta-taupe">
                    <Calendar size={11} />
                    {evt.date}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 text-dta-taupe transition-colors group-hover:text-dta-accent"
                />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/saison-culturelle-africaine"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-dark px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dta-char"
            >
              <MapPin size={16} />
              Découvrir toute la saison
            </Link>
          </div>
        </div>
      </section>

      {/* Zaouli */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/danse-zaouli-paris"
            className="group flex items-center gap-6 rounded-[var(--radius-card)] border border-dta-sand/40 bg-dta-beige/30 p-6 transition-all hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="text-4xl">💃</span>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-dta-dark transition-colors group-hover:text-dta-accent">
                Cours de danse Zaouli &amp; spectacles
              </h3>
              <p className="mt-1 text-sm text-dta-char/70">
                Découvrez le Zaouli, danse traditionnelle de Côte d&apos;Ivoire inscrite au patrimoine de l&apos;UNESCO. Cours à Paris et spectacles pour vos événements.
              </p>
            </div>
            <ArrowRight size={20} className="flex-shrink-0 text-dta-taupe transition-colors group-hover:text-dta-accent" />
          </Link>
        </div>
      </section>

      {/* Disclosure finale */}
      <div className="bg-dta-beige/30 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affiliés GetYourGuide. Dream Team
          Africa perçoit une commission de 8% sur chaque réservation effectuée
          via ces liens, sans frais supplémentaires pour vous. Cela nous aide à
          financer la Saison Culturelle Africaine et à proposer du contenu
          gratuit.
        </p>
      </div>
    </div>
  );
}
