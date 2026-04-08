import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Drama, Music, BookOpen, Calendar, MapPin } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Spectacles africains a Paris — danse, conte, musique 2026",
  description:
    "Decouvrez les meilleurs spectacles africains a Paris en 2026 : danse africaine, conte, musique live, festivals. Calendrier et billetterie.",
  keywords: [
    "spectacle africain paris",
    "danse africaine paris",
    "conte africain paris",
    "festival danse africaine",
    "spectacle danse africaine paris 2026",
    "theatre africain paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/spectacle-africain-paris" },
};

const SPECTACLES = [
  {
    icon: Drama,
    title: "Juste Une Danse",
    desc: "Le grand rendez-vous de la danse africaine a Paris. Spectacles de danse contemporaine, traditionnelle et urbaine. Des choregraphes du continent et de la diaspora reunis pour une soiree exceptionnelle.",
    date: "29 octobre 2026",
    lieu: "Espace MAS, Paris 13e",
    href: "/saison-culturelle-africaine/juste-une-danse",
    tag: "Danse",
  },
  {
    icon: BookOpen,
    title: "Festival du Conte Africain",
    desc: "Plongez dans l'univers fascinant des contes africains. Griots, conteurs et artistes du verbe partagent les recits ancestraux du continent dans une ambiance intime et chaleureuse.",
    date: "11 novembre 2026",
    lieu: "Espace MAS, Paris 13e",
    href: "/saison-culturelle-africaine/festival-conte-africain-2026",
    tag: "Conte",
  },
  {
    icon: Music,
    title: "Festival de l'Autre Culture",
    desc: "Festival multiculturel en plein air avec concerts live, danse, theatre de rue et gastronomie. Un espace d'expression artistique ouvert a toutes les cultures. Entree gratuite.",
    date: "27 juin 2026",
    lieu: "Fontenay-sous-Bois",
    href: "/saison-culturelle-africaine/festival-autre-culture-2026",
    tag: "Gratuit",
  },
];

export default function SpectacleAfricainParis() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Drama size={16} />
            Spectacles &amp; performances
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Spectacles africains a Paris — danse, conte, musique 2026
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris vibre au rythme de l&apos;Afrique. La scene parisienne accueille toute l&apos;annee des{" "}
            <strong>spectacles de danse africaine</strong>, des <strong>soirees de conte</strong> et des{" "}
            <strong>performances musicales live</strong>. En 2026, la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine
            </Link>{" "}
            met en lumiere les arts vivants du continent avec des evenements dedies, dont{" "}
            <Link href="/saison-culturelle-africaine/juste-une-danse" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Juste Une Danse
            </Link>{" "}
            et le{" "}
            <Link href="/saison-culturelle-africaine/festival-conte-africain-2026" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Festival du Conte Africain
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Evenements DTA */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Les rendez-vous spectacle de la Saison 2026
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Danse, conte, musique : retrouvez les evenements phares de Dream Team Africa dedies aux arts vivants africains.
          </p>
          <div className="mt-8 space-y-5">
            {SPECTACLES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                  <s.icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-dta-dark transition-colors group-hover:text-dta-accent">{s.title}</h3>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{s.tag}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-dta-char/70">{s.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-dta-taupe">
                    <span className="flex items-center gap-1"><Calendar size={12} />{s.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{s.lieu}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scene parisienne */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">La scene africaine a Paris</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-dta-char/80">
            <p>
              Paris est l&apos;une des capitales mondiales des arts africains. La ville abrite une scene dynamique ou se croisent{" "}
              <strong>danseurs contemporains</strong>, <strong>griots traditionnels</strong> et <strong>musiciens afrobeats</strong>.
              Des salles comme le Cabaret Sauvage, La Cigale ou le New Morning programment regulierement des artistes africains.
            </p>
            <p>
              La{" "}
              <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
                Saison Culturelle Africaine 2026
              </Link>{" "}
              amplifie cette dynamique avec 7 evenements dedies. Pour les amateurs de{" "}
              <Link href="/concert-afro-paris" className="font-semibold text-dta-accent hover:underline">
                concerts afro
              </Link>
              , de{" "}
              <Link href="/sortir-paris-ce-soir" className="font-semibold text-dta-accent hover:underline">
                sorties nocturnes
              </Link>{" "}
              ou de{" "}
              <Link href="/musee-art-africain-paris" className="font-semibold text-dta-accent hover:underline">
                musees d&apos;art africain
              </Link>
              , Paris offre un panorama culturel riche et varie.
            </p>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="shows"
          title="Spectacles et performances a Paris"
          subtitle="Decouvrez les meilleurs spectacles, cabarets et performances live de la capitale."
          maxItems={4}
          utmSource="seo-spectacle-africain"
          eventName="Juste Une Danse"
          eventSlug="juste-une-danse"
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
              { title: "Que faire a Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
              { title: "Foires & salons a Paris 2026", href: "/foire-paris-2026", emoji: "\uD83D\uDCC5" },
              { title: "Sorties famille & culture africaine", href: "/lafropeen/sorties-famille-culture-africaine-paris-enfants-2026", emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66" },
              { title: "Musees d'art africain a Paris", href: "/musee-art-africain-paris", emoji: "\uD83C\uDFDB\uFE0F" },
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
