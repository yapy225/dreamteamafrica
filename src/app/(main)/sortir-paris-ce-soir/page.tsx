import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Moon, Music, Wine, Sparkles, Calendar } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Sortir a Paris ce soir — soirees, concerts & culture 2026",
  description:
    "Que faire a Paris ce soir ? Soirees afro, concerts live, bars, spectacles et sorties culturelles. Guide des meilleures sorties nocturnes a Paris.",
  keywords: [
    "sortir paris ce soir",
    "soiree paris",
    "bar paris",
    "concert paris ce soir",
    "sortie paris soir",
    "soiree afro paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/sortir-paris-ce-soir" },
};

const SORTIES = [
  {
    icon: Music,
    title: "Concerts afrobeats & jazz",
    desc: "Le New Morning, La Cigale, le Cabaret Sauvage ou la Bellevilloise programment regulierement des artistes afro. Consultez aussi nos concerts dedies lors de la Saison Culturelle Africaine.",
    tag: "Musique live",
  },
  {
    icon: Wine,
    title: "Bars & lounges afro",
    desc: "Des bars a cocktails aux ambiances afro-lounge, Paris regorge de spots ou passer une soiree chaleureuse. Quartiers de Chateau-Rouge, Oberkampf et Bastille en tete.",
    tag: "Bars",
  },
  {
    icon: Sparkles,
    title: "Spectacles & cabarets",
    desc: "Theatre, danse contemporaine, one-man-show : les salles parisiennes offrent un programme riche chaque soir. Decouvrez aussi les spectacles africains de la Saison 2026.",
    tag: "Spectacles",
  },
  {
    icon: Moon,
    title: "Soirees culturelles DTA",
    desc: "Evasion Paris sur la Seine, Juste Une Danse a l'Espace MAS : les evenements Dream Team Africa sont aussi des soirees d'exception avec musique, degustation et ambiance festive.",
    tag: "Exclusif DTA",
  },
];

export default function SortirParisCeSoir() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Moon size={16} />
            Sorties &amp; soirees
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Sortir a Paris ce soir — soirees, concerts &amp; culture
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Envie de sortir a Paris ce soir ? La capitale ne dort jamais. Entre{" "}
            <Link href="/concert-afro-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              concerts afro
            </Link>
            ,{" "}
            <Link href="/spectacle-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              spectacles
            </Link>
            , bars a cocktails et{" "}
            <Link href="/croisiere-seine-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              croisieres nocturnes sur la Seine
            </Link>
            , il y a toujours quelque chose a faire. Les evenements de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            ajoutent une touche unique au paysage nocturne parisien.
          </p>
        </div>
      </section>

      {/* Idees sorties */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Idees de sorties pour ce soir
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SORTIES.map((s) => (
              <div
                key={s.title}
                className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                    <s.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-dta-dark">{s.title}</h3>
                      <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{s.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-dta-char/70">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evenements DTA en soiree */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Soirees Dream Team Africa</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Nos evenements de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
              Saison Culturelle Africaine
            </Link>{" "}
            sont aussi des soirees exceptionnelles. Musique live, degustation, ambiance festive.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine/evasion-paris-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              <Calendar size={14} /> Evasion Paris — 13 juin
            </Link>
            <Link href="/saison-culturelle-africaine/juste-une-danse" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              <Calendar size={14} /> Juste Une Danse — 29 oct.
            </Link>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="shows"
          title="Spectacles et sorties a Paris ce soir"
          subtitle="Reservez vos places pour les meilleurs spectacles, croisieres nocturnes et experiences de la capitale."
          maxItems={4}
          utmSource="seo-sortir-soir"
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
              { title: "Danse Zaouli — cours & spectacles", href: "/danse-zaouli-paris", emoji: "\uD83D\uDC83" },
              { title: "Concerts afro a Paris", href: "/concert-afro-paris", emoji: "\uD83C\uDFB5" },
              { title: "Croisieres sur la Seine", href: "/croisiere-seine-paris", emoji: "\uD83D\uDEA2" },
              { title: "Les meilleurs restaurants africains a Paris", href: "/lafropeen/meilleurs-restaurants-africains-paris-2026", emoji: "\uD83C\uDF7D\uFE0F" },
              { title: "Evasion Paris — soiree africaine 2026", href: "/lafropeen/evasion-paris-soiree-africaine-2026", emoji: "\uD83D\uDEA2" },
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
