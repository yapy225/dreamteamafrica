import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Calendar, Music, Palette, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Événements africains à Paris — Foires, spectacles, concerts 2026",
  description:
    "Calendrier complet des événements africains à Paris en 2026. Foire d'Afrique, spectacles, concerts, expositions, gastronomie. Réservez dès 5€ avec Culture pour Tous.",
  keywords: [
    "événement africain paris",
    "fête africaine paris",
    "festival africain paris 2026",
    "foire africaine paris",
    "concert africain paris",
    "culture africaine paris",
    "sortie africaine paris",
    "exposition africaine paris",
  ],
  openGraph: {
    title: "Événements africains à Paris 2026 — Dès 5€",
    description: "Foires, spectacles, concerts, gastronomie. La culture africaine à Paris dès 5€.",
    url: "https://dreamteamafrica.com/evenement-africain-paris",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/evenement-africain-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Événements africains à Paris 2026",
  description: "Calendrier des événements culturels africains à Paris : foires, spectacles, concerts, gastronomie.",
  url: "https://dreamteamafrica.com/evenement-africain-paris",
  publisher: { "@type": "Organization", name: "Dream Team Africa", url: "https://dreamteamafrica.com" },
};

const CATEGORIES = [
  { icon: Globe, title: "Foires & salons", desc: "La Foire d'Afrique, le Salon Made in Africa — mode, artisanat, cosmétiques, gastronomie sous un même toit.", link: "/saison-culturelle-africaine/foire-dafrique-paris" },
  { icon: Music, title: "Concerts & musique", desc: "Afrobeat, rumba, jazz mandingue, coupé-décalé — les meilleurs artistes africains sur scène à Paris.", link: "/saison-culturelle-africaine" },
  { icon: Palette, title: "Spectacles & danse", desc: "Danse contemporaine africaine, conte, théâtre — Juste une Danse, Fashion Week Africa et plus.", link: "/saison-culturelle-africaine/juste-une-danse" },
  { icon: UtensilsCrossed, title: "Gastronomie", desc: "Street food africain, dégustation, ateliers cuisine — goûtez l'Afrique à chaque événement.", link: "/saison-culturelle-africaine" },
];

export default function EvenementAfricainParis() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold text-dta-accent">
            <Calendar size={14} />
            Saison 2026
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
            Événements africains à Paris
          </h1>
          <p className="mt-4 text-lg text-dta-char/70">
            La richesse de la culture africaine à Paris. Foires, spectacles, concerts, gastronomie.<br />
            <strong className="text-dta-dark">Tous accessibles dès 5&nbsp;&euro;</strong> avec{" "}
            <Link href="/culture-pour-tous" className="font-semibold text-green-700 underline underline-offset-2">Culture pour Tous</Link>.
          </p>
          <div className="mt-6">
            <Link href="/saison-culturelle-africaine" className="inline-flex items-center gap-2 rounded-xl bg-dta-accent px-6 py-3 text-sm font-bold text-white hover:bg-dta-accent-dark">
              Voir le calendrier <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        <section className="mb-14">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
            Que découvrir aux événements africains de Paris&nbsp;?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.link} className="group rounded-2xl border border-dta-sand bg-white p-6 transition-shadow hover:shadow-md">
                <cat.icon size={24} className="text-dta-accent" />
                <h3 className="mt-3 font-serif text-lg font-bold text-dta-dark group-hover:text-dta-accent">{cat.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-dta-char/70">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-green-800">Réservez dès 5&nbsp;&euro;</h2>
          <p className="mt-3 text-sm text-green-700 max-w-xl mx-auto">
            Avec <strong>Culture pour Tous</strong>, chaque événement africain à Paris est accessible.
            Réservez avec 5&nbsp;&euro;, rechargez à votre rythme, profitez le jour&nbsp;J.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">
              Réserver maintenant <ArrowRight size={14} />
            </Link>
            <Link href="/culture-pour-tous" className="inline-flex items-center rounded-xl border border-green-300 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-100">
              En savoir plus
            </Link>
          </div>
        </section>

        <section className="mb-14 prose prose-sm max-w-none text-dta-char/70">
          <h2 className="font-serif text-xl font-bold text-dta-dark">La culture africaine à Paris en 2026</h2>
          <p>
            Paris est la capitale européenne de la culture africaine. Chaque année, des dizaines d&apos;événements
            célèbrent la richesse du continent&nbsp;: <strong>mode africaine</strong>, <strong>artisanat</strong>,
            <strong>gastronomie</strong>, <strong>musique live</strong>, <strong>danse contemporaine</strong> et <strong>art</strong>.
          </p>
          <p>
            Dream Team Africa organise la <strong>Saison Culturelle Africaine 2026</strong>, un programme
            de 6 événements majeurs à Paris&nbsp;: la Foire d&apos;Afrique, Évasion Paris, le Salon Made in Africa,
            Juste une Danse, la Fashion Week Africa et le Festival du Conte Africain.
          </p>
          <p>
            Grâce au programme <Link href="/culture-pour-tous" className="text-green-700 font-semibold">Culture pour Tous</Link>,
            tous ces événements sont accessibles <strong>dès 5&nbsp;&euro;</strong>. Un système de paiement flexible
            qui permet à chacun de vivre la culture africaine, quel que soit son budget.
          </p>
        </section>

        <div className="text-center">
          <Link href="/saison-culturelle-africaine" className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white hover:bg-dta-accent-dark">
            Voir tous les événements
          </Link>
        </div>
      </div>
    </>
  );
}
