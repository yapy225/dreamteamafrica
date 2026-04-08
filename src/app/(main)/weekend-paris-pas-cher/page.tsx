import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PiggyBank, Ticket, MapPin, Sun, Heart, Calendar } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Weekend a Paris pas cher — bons plans & activites gratuites 2026",
  description:
    "Que faire a Paris sans se ruiner ? Activites gratuites, bons plans, evenements culturels gratuits et astuces budget pour un weekend a Paris pas cher en 2026.",
  keywords: [
    "weekend paris pas cher",
    "activite gratuite paris",
    "que faire paris gratuit",
    "paris budget",
    "sortie gratuite paris",
    "bon plan paris 2026",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/weekend-paris-pas-cher" },
};

const BONS_PLANS = [
  {
    icon: Ticket,
    title: "Festival de l'Autre Culture — Gratuit",
    desc: "Le festival multiculturel en plein air de Dream Team Africa : musique live, danse, theatre et gastronomie. Entree 100% gratuite pour toute la famille.",
    date: "27 juin 2026",
    prix: "Gratuit",
    href: "/saison-culturelle-africaine/festival-autre-culture-2026",
    tag: "Gratuit",
  },
  {
    icon: Heart,
    title: "Festival International du Cinema Africain",
    desc: "Projections, debats et rencontres avec les realisateurs. Le jour 2 est en acces libre — une occasion unique de decouvrir le cinema du continent sans debourser un centime.",
    date: "1er septembre 2026",
    prix: "Jour 2 gratuit",
    href: "/saison-culturelle-africaine/festival-cinema-africain",
    tag: "Bon plan",
  },
  {
    icon: Sun,
    title: "Musees gratuits le 1er dimanche",
    desc: "De nombreux musees parisiens sont gratuits le premier dimanche du mois : Louvre, Orsay, quai Branly. Profitez-en pour decouvrir les collections d'art africain sans frais.",
    date: "Chaque 1er dimanche",
    prix: "Gratuit",
    href: "/musee-art-africain-paris",
    tag: "Musees",
  },
  {
    icon: MapPin,
    title: "Balades gratuites dans Paris",
    desc: "Le Marais, Montmartre, les quais de Seine, le canal Saint-Martin : Paris se decouvre a pied gratuitement. Combinez avec un marche africain pour une journee complete.",
    date: "Toute l'annee",
    prix: "Gratuit",
    href: "/que-faire-paris-ce-weekend",
    tag: "Balade",
  },
];

const ASTUCES = [
  "Reservez vos billets DTA en avance : tarifs early-bird disponibles pour la plupart des evenements.",
  "Le Paris Museum Pass donne acces a 60+ musees et monuments — rentable des 2 visites en 2 jours.",
  "Les terrasses des grands magasins (Galeries Lafayette, Printemps) offrent des vues gratuites sur Paris.",
  "Les marches africains de Chateau-Rouge permettent de gouter la cuisine africaine a petits prix.",
  "Le Festival de l'Autre Culture et certaines journees du FICA sont entierement gratuits.",
];

export default function WeekendParisPasCher() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <PiggyBank size={16} />
            Bons plans &amp; budget
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Weekend a Paris pas cher — bons plans &amp; activites gratuites 2026
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris n&apos;est pas forcement hors budget. Entre les{" "}
            <Link href="/musee-art-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              musees gratuits le 1er dimanche
            </Link>
            , les{" "}
            <Link href="/saison-culturelle-africaine/festival-autre-culture-2026" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              festivals gratuits
            </Link>
            , les{" "}
            <Link href="/marche-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              marches africains
            </Link>{" "}
            et les balades le long de la Seine, il est tout a fait possible de profiter de la capitale sans se ruiner. La{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            propose meme des evenements a entree libre.
          </p>
        </div>
      </section>

      {/* Bons plans */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Activites gratuites et bons plans
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Voici notre selection d&apos;activites gratuites ou a petit prix pour un weekend reussi a Paris.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BONS_PLANS.map((bp) => (
              <Link
                key={bp.href + bp.title}
                href={bp.href}
                className="group flex gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                  <bp.icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-dta-dark transition-colors group-hover:text-dta-accent">{bp.title}</h3>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{bp.tag}</span>
                  </div>
                  <p className="mt-1 text-sm text-dta-char/70">{bp.desc}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-dta-taupe">
                    <span className="flex items-center gap-1"><Calendar size={12} />{bp.date}</span>
                    <span className="font-semibold text-dta-accent-dark">{bp.prix}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Astuces budget */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Astuces budget pour Paris</h2>
          <ul className="mt-6 space-y-3">
            {ASTUCES.map((astuce, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-dta-char/80">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent/10 text-xs font-bold text-dta-accent">
                  {i + 1}
                </span>
                {astuce}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="culture"
          title="Activites a prix reduit a Paris"
          subtitle="Billets coupe-file, visites guidees et experiences culturelles au meilleur prix."
          maxItems={4}
          utmSource="seo-weekend-pas-cher"
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
              { title: "Que faire a Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
              { title: "Danse Zaouli — cours & spectacles", href: "/danse-zaouli-paris", emoji: "\uD83D\uDC83" },
              { title: "Sortir a Paris ce soir", href: "/sortir-paris-ce-soir", emoji: "\uD83C\uDF19" },
              { title: "Activites culturelles a Paris en mai 2026", href: "/lafropeen/activites-culturelles-paris-mai-2026", emoji: "\uD83C\uDFA8" },
              { title: "Sorties famille & culture africaine", href: "/lafropeen/sorties-famille-culture-africaine-paris-enfants-2026", emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66" },
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
