import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Compass, Ticket, ShoppingBag, Music, Utensils } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Que faire à Paris ce weekend ? Sorties culturelles & bons plans 2026",
  description:
    "Découvrez que faire à Paris ce weekend : événements culturels africains, musées, croisières sur la Seine, spectacles et bons plans. Guide mis à jour chaque semaine.",
  keywords: [
    "que faire à paris ce weekend",
    "sortie paris weekend",
    "activité paris samedi dimanche",
    "événement paris ce weekend",
    "idée sortie paris",
    "bons plans paris weekend",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/que-faire-paris-ce-weekend" },
};

const PICKS = [
  {
    icon: Ticket,
    title: "Foire d'Afrique Paris",
    desc: "Le plus grand salon culturel africain de Paris — artisanat, gastronomie, musique live.",
    date: "1-2 mai 2026",
    href: "/saison-culturelle-africaine/foire-dafrique-paris",
    tag: "Incontournable",
  },
  {
    icon: Music,
    title: "Festival de l'Autre Culture",
    desc: "Festival multiculturel en plein air — musique, danse, gastronomie. Entrée gratuite.",
    date: "27 juin 2026",
    href: "/saison-culturelle-africaine/festival-autre-culture-2026",
    tag: "Gratuit",
  },
  {
    icon: Utensils,
    title: "Évasion Paris — Croisière culturelle",
    desc: "Croisière exclusive sur la Seine avec concerts, dégustations et art contemporain africain.",
    date: "13 juin 2026",
    href: "/saison-culturelle-africaine/evasion-paris-2026",
    tag: "Exclusif",
  },
  {
    icon: ShoppingBag,
    title: "Salon Made In Africa",
    desc: "Mode, décoration, cosmétiques et épicerie fine — 500+ artisans exposants.",
    date: "11-12 déc. 2026",
    href: "/saison-culturelle-africaine/salon-made-in-africa-2026",
    tag: "Noël",
  },
];

export default function QueFaireParisCeWeekend() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Compass size={16} />
            Guide Paris
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Que faire à Paris ce weekend ?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris regorge de sorties culturelles, de{" "}
            <Link href="/spectacle-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              spectacles
            </Link>
            , de{" "}
            <Link href="/musee-art-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              musées
            </Link>{" "}
            et d&apos;expériences uniques. Voici notre sélection pour profiter au maximum de votre weekend dans la capitale, entre{" "}
            <Link href="/croisiere-seine-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              croisières sur la Seine
            </Link>
            ,{" "}
            <Link href="/concert-afro-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              concerts afro
            </Link>
            ,{" "}
            <Link href="/danse-zaouli-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              cours de danse Zaouli
            </Link>{" "}
            et{" "}
            <Link href="/marche-africain-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              marchés africains
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Événements DTA à venir */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Les événements à ne pas manquer
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            La{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            propose 7 rendez-vous exceptionnels d&apos;avril à décembre.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PICKS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                  <p.icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-dta-dark transition-colors group-hover:text-dta-accent">
                      {p.title}
                    </h3>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">
                      {p.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dta-char/70">{p.desc}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-dta-taupe">
                    <Calendar size={12} />
                    {p.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Widget GYG — Culture */}
      <div className="bg-dta-bg">
        <GetYourGuideWidget
          city="Paris"
          theme="culture"
          title="Activités culturelles populaires à Paris"
          subtitle="Musées, visites guidées et expériences incontournables pour votre weekend."
          maxItems={3}
          utmSource="seo-que-faire"
          eventName="la Saison Culturelle Africaine"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Section conseils + maillage */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">
            Nos idées par thème
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Croisières sur la Seine", href: "/croisiere-seine-paris", emoji: "🚢" },
              { title: "Musées & art africain", href: "/musee-art-africain-paris", emoji: "🎨" },
              { title: "Marchés africains", href: "/marche-africain-paris", emoji: "🏪" },
              { title: "Spectacles africains", href: "/spectacle-africain-paris", emoji: "🎭" },
              { title: "Danse Zaouli", href: "/danse-zaouli-paris", emoji: "💃" },
              { title: "Concerts afro", href: "/concert-afro-paris", emoji: "🎵" },
              { title: "Weekend pas cher", href: "/weekend-paris-pas-cher", emoji: "💰" },
              { title: "Boutiques africaines", href: "/boutique-africaine-paris", emoji: "🛍️" },
              { title: "Sortir ce soir", href: "/sortir-paris-ce-soir", emoji: "🌙" },
              { title: "Foires & salons 2026", href: "/foire-paris-2026", emoji: "📅" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-dta-sand/40 bg-dta-beige/20 p-4 transition-all hover:bg-dta-accent/5 hover:shadow-sm"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                  {item.title}
                </span>
                <ArrowRight size={14} className="ml-auto text-dta-taupe group-hover:text-dta-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles liés */}
      <section className="bg-dta-beige/30 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">
            À lire aussi sur L&apos;Afropéen
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Les 10 meilleurs restaurants africains à Paris", href: "/lafropeen/meilleurs-restaurants-africains-paris-2026" },
              { title: "Activités culturelles à Paris en mai 2026", href: "/lafropeen/activites-culturelles-paris-mai-2026" },
              { title: "Sorties famille & culture africaine à Paris", href: "/lafropeen/sorties-famille-culture-africaine-paris-enfants-2026" },
              { title: "Les meilleurs brunchs africains à Paris", href: "/lafropeen/meilleurs-brunchs-africains-paris-2026" },
              { title: "10 expériences africaines à offrir à Paris", href: "/lafropeen/experiences-africaines-offrir-paris-2026" },
              { title: "Guide séjour culturel africain à Paris", href: "/sejour-culturel-africain-paris" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <h3 className="text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                  {a.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-dta-accent">
                  Lire l&apos;article <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <div className="bg-dta-beige/20 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affiliés GetYourGuide. Dream Team Africa perçoit une commission de 8% sur chaque réservation effectuée via ces liens, sans frais supplémentaires pour vous.
        </p>
      </div>
    </div>
  );
}
