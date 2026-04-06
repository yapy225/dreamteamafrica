import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Music, Mic2, Radio, Calendar, MapPin } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Concerts afro a Paris — afrobeats, jazz, musique live 2026",
  description:
    "Decouvrez les meilleurs concerts afro a Paris en 2026 : afrobeats, jazz africain, musique live, soirees afro. Calendrier, salles et billetterie.",
  keywords: [
    "concert afro paris",
    "afrobeats paris",
    "musique africaine paris",
    "concert africain paris",
    "soiree afro paris",
    "jazz africain paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/concert-afro-paris" },
};

const SCENES = [
  {
    icon: Mic2,
    title: "Afrobeats & amapiano",
    desc: "L'afrobeats domine les charts mondiaux et Paris est l'une des capitales europeennes du genre. Burna Boy, Wizkid, Asake, Ayra Starr : les plus grandes stars se produisent regulierement a l'Accor Arena, au Zenith ou a la Cigale.",
    salles: "Accor Arena, Zenith, La Cigale, Elysee Montmartre",
    tag: "Tendance",
  },
  {
    icon: Music,
    title: "Jazz africain & world music",
    desc: "Le New Morning, le Sunset-Sunside et le Duc des Lombards accueillent les meilleurs musiciens jazz du continent. Manu Dibango, Hugh Masekela, Richard Bona : la tradition continue avec une nouvelle generation de talents.",
    salles: "New Morning, Sunset-Sunside, Duc des Lombards",
    tag: "Jazz",
  },
  {
    icon: Radio,
    title: "Musique live aux evenements DTA",
    desc: "La Saison Culturelle Africaine integre la musique live dans chacun de ses evenements. Du Festival de l'Autre Culture (gratuit) a Evasion Paris sur la Seine, chaque rendez-vous est l'occasion de decouvrir des artistes emergents.",
    salles: "Espace MAS, Seine, Fontenay-sous-Bois",
    tag: "DTA",
  },
];

export default function ConcertAfroParis() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Music size={16} />
            Concerts &amp; musique
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Concerts afro a Paris — afrobeats, jazz, musique live 2026
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris vibre au son de l&apos;Afrique. L&apos;<strong>afrobeats</strong> et l&apos;<strong>amapiano</strong> remplissent les salles, le <strong>jazz africain</strong> illumine les clubs, et la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            met en scene les artistes du continent. Retrouvez la musique live au{" "}
            <Link href="/saison-culturelle-africaine/festival-autre-culture-2026" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Festival de l&apos;Autre Culture
            </Link>{" "}
            et lors de{" "}
            <Link href="/saison-culturelle-africaine/juste-une-danse" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Juste Une Danse
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Scenes */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            La scene afro a Paris
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Des grandes salles aux clubs intimistes, voici ou ecouter de la musique africaine a Paris.
          </p>
          <div className="mt-8 space-y-5">
            {SCENES.map((s) => (
              <div
                key={s.title}
                className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                    <s.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-dta-dark">{s.title}</h3>
                      <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{s.tag}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{s.desc}</p>
                    <p className="mt-2 text-xs text-dta-taupe">
                      <strong>Salles :</strong> {s.salles}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA evenements */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Musique live aux evenements DTA</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Chaque evenement de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
              Saison Culturelle Africaine
            </Link>{" "}
            est l&apos;occasion de decouvrir des artistes africains en live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine/festival-autre-culture-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              <Calendar size={14} /> Festival de l&apos;Autre Culture — 27 juin
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
          theme="music"
          title="Experiences musicales a Paris"
          subtitle="Concerts, spectacles et sorties musicales dans la capitale."
          maxItems={4}
          utmSource="seo-concert-afro"
          eventName="le Festival de l'Autre Culture"
          eventSlug="festival-autre-culture-2026"
        />
      </div>

      {/* Maillage */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">A decouvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Sortir a Paris ce soir", href: "/sortir-paris-ce-soir", emoji: "\uD83C\uDF19" },
              { title: "Spectacles africains a Paris", href: "/spectacle-africain-paris", emoji: "\uD83C\uDFAD" },
              { title: "Croisieres sur la Seine", href: "/croisiere-seine-paris", emoji: "\uD83D\uDEA2" },
              { title: "L'afrobeats dans les charts mondiaux", href: "/lafropeen/afrobeats-charts-mondiaux", emoji: "\uD83C\uDF0D" },
              { title: "Evasion Paris — soiree africaine 2026", href: "/lafropeen/evasion-paris-soiree-africaine-2026", emoji: "\uD83C\uDFB6" },
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
