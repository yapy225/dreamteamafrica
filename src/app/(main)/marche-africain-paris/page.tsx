import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Store, ShoppingBag } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Marché africain à Paris — Foires, salons & marchés 2026",
  description:
    "Où trouver un marché africain à Paris ? Découvrez les foires, salons et marchés de la diaspora : artisanat, tissus wax, épices, cosmétiques naturels. Calendrier 2026.",
  keywords: [
    "marché africain paris",
    "foire africaine paris",
    "salon africain paris",
    "marché wax paris",
    "marché artisanat africain paris",
    "épices africaines paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/marche-africain-paris" },
};

const MARCHES = [
  {
    name: "Foire d'Afrique Paris — 6e Édition",
    desc: "Le plus grand salon culturel africain de Paris. 50+ exposants : artisanat, gastronomie, mode, cosmétiques, épices.",
    date: "1-2 mai 2026",
    lieu: "Espace MAS, Paris 13e",
    href: "/saison-culturelle-africaine/foire-dafrique-paris",
    tag: "Flagship",
  },
  {
    name: "Salon Made In Africa",
    desc: "Mode, décoration, cosmétiques et épicerie fine africaine. Idéal pour les cadeaux de Noël.",
    date: "11-12 décembre 2026",
    lieu: "Espace MAS, Paris 13e",
    href: "/saison-culturelle-africaine/salon-made-in-africa-2026",
    tag: "Noël",
  },
  {
    name: "Festival de l'Autre Culture",
    desc: "Festival multiculturel en plein air avec stands artisanaux, food court africain et musique live.",
    date: "27 juin 2026",
    lieu: "Parc des Épivans, Fontenay-sous-Bois",
    href: "/saison-culturelle-africaine/festival-autre-culture-2026",
    tag: "Gratuit",
  },
];

export default function MarcheAfricainParis() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Store size={16} />
            Guide shopping
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Marché africain à Paris
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Tissus wax, beurre de karité, bijoux artisanaux, épices et gastronomie : Paris abrite une scène marchande africaine riche et diversifiée. Voici les meilleurs rendez-vous de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            pour faire vos emplettes. Et si vous ne pouvez pas vous déplacer, visitez notre{" "}
            <Link href="/made-in-africa" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              marketplace Made in Africa
            </Link>{" "}
            pour commander en ligne.
          </p>
        </div>
      </section>

      {/* Liste marchés/foires */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">
            Calendrier des foires & marchés africains 2026
          </h2>
          <div className="mt-8 space-y-5">
            {MARCHES.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group flex flex-col gap-4 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10">
                  <ShoppingBag size={24} className="text-dta-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-dta-dark transition-colors group-hover:text-dta-accent">
                      {m.name}
                    </h3>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">
                      {m.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dta-char/70">{m.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-dta-taupe">
                    <span className="flex items-center gap-1"><Calendar size={12} />{m.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{m.lieu}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="hidden flex-shrink-0 text-dta-taupe group-hover:text-dta-accent sm:block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Devenir exposant */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Vous êtes artisan ou créateur ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Exposez vos produits lors de nos foires et touchez directement la diaspora africaine à Paris. Stands à partir de 160 €/jour.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/exposants" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              Devenir exposant
            </Link>
            <Link href="/made-in-africa" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              Vendre en ligne — Made in Africa
            </Link>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="culture"
          title="Autres activités à découvrir à Paris"
          subtitle="Profitez de votre visite au marché pour explorer Paris."
          maxItems={3}
          utmSource="seo-marche-africain"
          eventName="la Foire d'Afrique Paris"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Maillage interne */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">À découvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
              { title: "Que faire à Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "🗼" },
              { title: "Restaurants africains à Paris", href: "/lafropeen/meilleurs-restaurants-africains-paris-2026", emoji: "🍽️" },
              { title: "Brunchs africains à Paris", href: "/lafropeen/meilleurs-brunchs-africains-paris-2026", emoji: "🥐" },
              { title: "Weekend à Paris pas cher", href: "/weekend-paris-pas-cher", emoji: "💰" },
              { title: "Séjour culturel africain", href: "/sejour-culturel-africain-paris", emoji: "✈️" },
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

      <div className="bg-dta-beige/20 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affiliés GetYourGuide. Dream Team Africa perçoit une commission de 8% sur chaque réservation via ces liens, sans frais supplémentaires pour vous.
        </p>
      </div>
    </div>
  );
}
