import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Clock, Ticket, Star } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Foires & salons africains à Paris 2026 — Foire d'Afrique, expositions",
  description:
    "Calendrier 2026 des foires, salons et expositions africaines à Paris : Foire d'Afrique (1-2 mai), Fashion Week Africa, Salon Made In Africa. Dates, lieux et billets.",
  keywords: [
    "foire afrique paris",
    "foire afrique paris 2026",
    "exposition afrique paris 2026",
    "exposition africaine paris",
    "salon afrique paris",
    "salon africain paris",
    "paris africa",
    "afrique paris",
    "foire paris 2026",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/foire-paris-2026" },
};

const EVENTS = [
  {
    title: "Foire d'Afrique Paris",
    desc: "Le plus grand salon culturel africain de Paris. Artisanat, gastronomie, musique live, danse et conferences. Plus de 100 exposants reunis sur 2 jours.",
    date: "1-2 mai 2026",
    lieu: "Espace MAS, Paris 13e",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/foire-dafrique-paris",
    tag: "Incontournable",
    highlight: true,
  },
  {
    title: "Festival de l'Autre Culture",
    desc: "Festival multiculturel en plein air : musique, danse, theatre, gastronomie du monde. Un rendez-vous festif et familial. Entree gratuite.",
    date: "27 juin 2026",
    lieu: "Fontenay-sous-Bois",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/festival-autre-culture-2026",
    tag: "Gratuit",
    highlight: false,
  },
  {
    title: "Evasion Paris — Croisiere culturelle",
    desc: "Croisiere exclusive sur la Seine avec concerts, degustations et art contemporain africain. Une soiree d'exception sur l'eau.",
    date: "13 juin 2026",
    lieu: "Seine, Paris",
    horaires: "Soiree",
    href: "/saison-culturelle-africaine/evasion-paris-2026",
    tag: "Exclusif",
    highlight: false,
  },
  {
    title: "Festival International du Cinema Africain",
    desc: "Projections, rencontres avec les realisateurs et debats autour du cinema africain contemporain. Une journee dediee au 7e art du continent.",
    date: "1er septembre 2026",
    lieu: "Maison des Citoyens, Fontenay-sous-Bois",
    horaires: "10h - 22h",
    href: "/saison-culturelle-africaine/festival-cinema-africain",
    tag: "Cinema",
    highlight: false,
  },
  {
    title: "Fashion Week Africa",
    desc: "La mode africaine a l'honneur : defiles, createurs emergents, stylistes reconnus. Le grand rendez-vous de la mode ethique et du wax.",
    date: "3 octobre 2026",
    lieu: "Espace MAS, Paris 13e",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/fashion-week-africa",
    tag: "Mode",
    highlight: true,
  },
  {
    title: "Juste Une Danse",
    desc: "Spectacle de danse africaine contemporaine et traditionnelle. Choregraphes du continent et de la diaspora reunis pour une soiree de performances.",
    date: "29 octobre 2026",
    lieu: "Espace MAS, Paris 13e",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/juste-une-danse",
    tag: "Danse",
    highlight: false,
  },
  {
    title: "Festival du Conte Africain",
    desc: "Griots et conteurs partagent les recits ancestraux du continent. Une experience immersive dans la tradition orale africaine.",
    date: "11 novembre 2026",
    lieu: "Espace MAS, Paris 13e",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/festival-conte-africain-2026",
    tag: "Conte",
    highlight: false,
  },
  {
    title: "Salon Made In Africa",
    desc: "Mode, decoration, cosmetiques, epicerie fine : le salon de Noel dedie au made in Africa. Plus de 500 artisans exposants sur 2 jours.",
    date: "11-12 decembre 2026",
    lieu: "Espace MAS, Paris 13e",
    horaires: "12h - 22h",
    href: "/saison-culturelle-africaine/salon-made-in-africa-2026",
    tag: "Noel",
    highlight: true,
  },
];

export default function FoireParis2026() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <CalendarDays size={16} />
            Foires &amp; salons
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Foires &amp; salons africains à Paris en 2026
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris est la capitale des foires et salons. En 2026, la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine
            </Link>{" "}
            propose <strong>7 evenements majeurs</strong> dedies a la culture africaine, de la{" "}
            <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Foire d&apos;Afrique
            </Link>{" "}
            en mai au{" "}
            <Link href="/saison-culturelle-africaine/salon-made-in-africa-2026" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Salon Made In Africa
            </Link>{" "}
            en decembre. Retrouvez egalement nos{" "}
            <Link href="/exposants" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              exposants
            </Link>{" "}
            et la{" "}
            <Link href="/made-in-africa" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              marketplace Made in Africa
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Calendrier */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Calendrier des evenements 2026
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            7 rendez-vous exceptionnels d&apos;avril a decembre — retrouvez toutes les dates, lieux et informations pratiques.
          </p>
          <div className="mt-8 space-y-4">
            {EVENTS.map((evt) => (
              <Link
                key={evt.href}
                href={evt.href}
                className="group flex gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${evt.highlight ? "bg-dta-accent text-white" : "bg-dta-accent/10 text-dta-accent"}`}>
                  {evt.highlight ? <Star size={22} /> : <Ticket size={22} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-dta-dark transition-colors group-hover:text-dta-accent">{evt.title}</h3>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{evt.tag}</span>
                  </div>
                  <p className="mt-1 text-sm text-dta-char/70">{evt.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-dta-taupe">
                    <span className="flex items-center gap-1"><CalendarDays size={12} />{evt.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{evt.lieu}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{evt.horaires}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-dta-taupe transition-colors group-hover:text-dta-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-dta-bg">
        <GetYourGuideWidget
          city="Paris"
          theme="culture"
          title="Activites culturelles a Paris"
          subtitle="Completez votre programme avec les meilleures activites culturelles de la capitale."
          maxItems={3}
          utmSource="seo-foire-paris"
          eventName="la Saison Culturelle Africaine"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Maillage */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">A decouvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Boutiques africaines a Paris", href: "/boutique-africaine-paris", emoji: "\uD83D\uDECD\uFE0F" },
              { title: "Spectacles africains a Paris", href: "/spectacle-africain-paris", emoji: "\uD83C\uDFAD" },
              { title: "Que faire a Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
              { title: "Foire d'Afrique Paris — salon africain", href: "/lafropeen/foire-dafrique-paris-salon-africain", emoji: "\uD83C\uDF0D" },
              { title: "Guide visiteur Fashion Week Africa", href: "/lafropeen/guide-visiteur-fashion-week-africa-paris-2026", emoji: "\uD83D\uDC57" },
              { title: "Nos exposants", href: "/exposants", emoji: "\uD83C\uDFAA" },
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
