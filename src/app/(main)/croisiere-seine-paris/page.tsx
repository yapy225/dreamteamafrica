import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ship, Clock, Sunset, UtensilsCrossed, Music } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Croisieres sur la Seine a Paris — Guide complet 2026",
  description:
    "Decouvrez les meilleures croisieres sur la Seine a Paris : bateau mouche, diner croisiere, balade au coucher du soleil. Tarifs, horaires et reservation en ligne.",
  keywords: [
    "croisiere seine paris",
    "bateau mouche paris",
    "croisiere paris",
    "balade seine",
    "diner croisiere paris",
    "croisiere coucher soleil paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/croisiere-seine-paris" },
};

const CROISIERES = [
  {
    icon: Ship,
    title: "Croisiere classique (1h)",
    desc: "La balade incontournable pour decouvrir les monuments de Paris depuis la Seine : Tour Eiffel, Notre-Dame, Louvre, Musee d'Orsay. Commentaires en plusieurs langues.",
    duree: "1 heure",
    prix: "A partir de 16 \u20ac",
    tag: "Populaire",
  },
  {
    icon: UtensilsCrossed,
    title: "Diner croisiere gastronomique",
    desc: "Un repas raffine servi a bord avec vue panoramique sur Paris illumine. Menu 3 plats, champagne et musique live pour une soiree inoubliable.",
    duree: "2h30",
    prix: "A partir de 85 \u20ac",
    tag: "Romantique",
  },
  {
    icon: Sunset,
    title: "Croisiere au coucher du soleil",
    desc: "Embarquez en fin de journee pour admirer le coucher du soleil sur la Seine. Ambiance lounge, cocktails et panorama dore sur les ponts de Paris.",
    duree: "1h30",
    prix: "A partir de 35 \u20ac",
    tag: "Coup de coeur",
  },
  {
    icon: Music,
    title: "Evasion Paris — Croisiere culturelle africaine",
    desc: "La croisiere exclusive de Dream Team Africa : concerts afro live, degustations de cuisine africaine, art contemporain et ambiance festive sur la Seine.",
    duree: "3 heures",
    prix: "Billet DTA",
    tag: "Exclusif DTA",
  },
];

export default function CroisiereSeineParis() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Ship size={16} />
            Croisieres &amp; balades
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Croisieres sur la Seine a Paris
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            La Seine est le fil conducteur de Paris. Embarquez pour une{" "}
            <strong>croisiere inoubliable</strong> et decouvrez la capitale sous un autre angle. Du simple bateau mouche au{" "}
            <strong>diner croisiere gastronomique</strong>, il y en a pour tous les gouts. Et pour une experience unique, ne manquez pas{" "}
            <Link href="/saison-culturelle-africaine/evasion-paris-2026" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Evasion Paris
            </Link>
            , la croisiere culturelle africaine de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Types de croisieres */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Les types de croisieres a Paris
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Quelle que soit l&apos;occasion, une croisiere sur la Seine reste un moment magique. Voici les formats les plus populaires.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CROISIERES.map((c) => (
              <div
                key={c.title}
                className="group rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                    <c.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-dta-dark">{c.title}</h3>
                      <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{c.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-dta-char/70">{c.desc}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-dta-taupe">
                      <span className="flex items-center gap-1"><Clock size={12} />{c.duree}</span>
                      <span className="font-semibold text-dta-accent-dark">{c.prix}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Evasion Paris */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Evasion Paris — La croisiere culturelle africaine</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Le 13 juin 2026, vivez une experience inedite sur la Seine : concerts afrobeats &amp; jazz, degustations africaines et art contemporain a bord. Un evenement exclusif de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
              Saison Culturelle Africaine
            </Link>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine/evasion-paris-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              Decouvrir Evasion Paris <ArrowRight size={14} />
            </Link>
            <Link href="/sejour-culturel-africain-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              Preparer votre sejour
            </Link>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="cruises"
          title="Reservez votre croisiere sur la Seine"
          subtitle="Bateaux mouches, diners croisieres et balades au coucher du soleil — reservez en ligne."
          maxItems={4}
          utmSource="seo-croisiere-seine"
          eventName="Evasion Paris"
          eventSlug="evasion-paris-2026"
        />
      </div>

      {/* Maillage */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">A decouvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Sortir a Paris ce soir", href: "/sortir-paris-ce-soir", emoji: "\uD83C\uDF19" },
              { title: "Que faire a Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
              { title: "Concerts afro a Paris", href: "/concert-afro-paris", emoji: "\uD83C\uDFB5" },
              { title: "Activites culturelles a Paris en mai 2026", href: "/lafropeen/activites-culturelles-paris-mai-2026", emoji: "\uD83C\uDFA8" },
              { title: "10 experiences africaines a offrir a Paris", href: "/lafropeen/experiences-africaines-offrir-paris-2026", emoji: "\uD83C\uDF81" },
              { title: "Sejour culturel africain a Paris", href: "/sejour-culturel-africain-paris", emoji: "\u2708\uFE0F" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 transition-all hover:bg-dta-accent/5 hover:shadow-sm">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">{item.title}</span>
                <ArrowRight size={14} className="ml-auto text-dta-taupe group-hover:text-dta-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <div className="bg-dta-beige/20 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affilies GetYourGuide. Dream Team Africa percoit une commission de 8% sur chaque reservation effectuee via ces liens, sans frais supplementaires pour vous.
        </p>
      </div>
    </div>
  );
}
