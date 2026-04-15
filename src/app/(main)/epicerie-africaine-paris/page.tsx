import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShoppingBag, UtensilsCrossed, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Épicerie africaine à Paris — Produits africains, épices, aliments 2026",
  description:
    "Épicerie africaine à Paris : où acheter des produits africains, épices, farines, sauces, poisson séché. Guide 2026 Château-Rouge, Marché Dejean. Foire d’Afrique 1-2 mai.",
  keywords: [
    "épicerie africaine paris",
    "produits africains",
    "produits africains paris",
    "produits alimentaires africains paris",
    "épices africaines paris",
    "marché africain paris",
    "marché dejean",
    "cuisine africaine paris",
    "africa bbq",
  ],
  openGraph: {
    title: "Épicerie africaine à Paris — Guide 2026",
    description: "Où acheter des produits alimentaires africains à Paris : épices, farines, sauces, poisson, légumes.",
    url: "https://dreamteamafrica.com/epicerie-africaine-paris",
    siteName: "Dream Team Africa",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/epicerie-africaine-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où acheter des produits africains à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le Marché Dejean (Château-Rouge, 18e) est la référence historique de l’épicerie africaine à Paris : poisson séché, viande de brousse, patates douces, igname, manioc, plantain, légumes africains frais, épices. Autour se concentrent plusieurs dizaines d’épiceries africaines, caribéennes et exotiques. À Bagnolet, Saint-Denis et Aubervilliers se trouvent également des épiceries spécialisées.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les produits africains incontournables en cuisine ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les indispensables : plantain, manioc, igname, patate douce, gombo, niébé (haricot noir), attiéké (couscous de manioc), fonio, poisson séché ou fumé, crevettes séchées, pâte d’arachide, huile de palme rouge, piments, bissap, feuilles de bissap, gingembre, cube Maggi, bouillons africains, farine de mil, de fonio, de manioc.",
      },
    },
    {
      "@type": "Question",
      name: "Trouve-t-on des épices africaines à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les épiceries africaines de Paris proposent piment oiseau, poivre de Guinée (grains de paradis), gingembre séché, piment antillais, bissap, moringa, feuilles de baobab, calalou, kinkéliba, ail noir, curry africain, ras el hanout. Pour une sélection premium, plusieurs exposants épices et herbes seront présents à la Foire d’Afrique Paris 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Où goûter la cuisine africaine à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paris compte plus de 300 restaurants africains, concentrés à Château-Rouge, Belleville, Château d’Eau et Bagnolet. Sénégalais (thieb, yassa), ivoiriens (attiéké poisson, kedjenou), camerounais (ndolè, poisson braisé), éthiopiens (injera), maghrébins (couscous, tajine). La Foire d’Afrique Paris 2026 propose également un village gastronomie avec street food des 54 pays africains.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on commander des produits africains en ligne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, plusieurs marketplaces livrent des produits alimentaires africains en France. La future marketplace Made in Africa (Dream Team Africa) proposera une sélection curée de nos exposants avec traçabilité : épicerie fine, épices, cosmétiques naturels et artisanat. Inscrivez-vous pour être prévenu·e du lancement.",
      },
    },
  ],
};

const QUARTIERS = [
  { nom: "Marché Dejean — Château-Rouge (18e)", desc: "LA référence de l’épicerie africaine à Paris. Poissonniers, bouchers, maraîchers africains. Produits frais importés du continent. Ambiance marché populaire, prix imbattables.", metro: "M° Château-Rouge (ligne 4)", tag: "Historique" },
  { nom: "Rue Myrha, rue des Poissonniers (18e)", desc: "Dizaines d’épiceries africaines, sénégalaises, ivoiriennes, maliennes. Stocks impressionnants de produits secs, huiles, farines, sauces.", metro: "M° Marcadet-Poissonniers", tag: "Densité" },
  { nom: "Belleville / Ménilmontant (20e)", desc: "Axe multiculturel avec plusieurs épiceries africaines et asiatiques. Moins bondé, bonne alternative le samedi.", metro: "M° Belleville, Ménilmontant", tag: "Alternative" },
  { nom: "Bagnolet / Saint-Denis / Aubervilliers (93)", desc: "Banlieue nord-est : grandes épiceries africaines de gros, produits à prix dégressif, large choix pour familles nombreuses et restaurateurs.", metro: "M° Gallieni, Basilique Saint-Denis", tag: "Gros volumes" },
];

const CATEGORIES = [
  { titre: "Féculents & tubercules", desc: "Plantain, manioc, igname, patate douce, taro, fonio." },
  { titre: "Épices & condiments", desc: "Piment oiseau, poivre de Guinée, gingembre, bissap, cube Maggi, pâte d’arachide." },
  { titre: "Poisson & viande", desc: "Poisson séché, fumé, crevettes séchées, viande de brousse (selon arrivage)." },
  { titre: "Farines & céréales", desc: "Fonio, mil, sorgho, manioc, attiéké, semoule de maïs." },
];

export default function EpicerieAfricaineParisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <UtensilsCrossed size={16} />
              Guide gastronomie africaine
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">Épicerie africaine à Paris — Produits africains, épices, aliments</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
              <strong>Plantain, manioc, igname, poisson séché, pâte d’arachide, bissap, attiéké</strong> : Paris concentre l’une des plus grandes offres d’<strong>épicerie africaine</strong> d’Europe, du Marché Dejean historique aux épiceries de gros de Seine-Saint-Denis. Voici les meilleures adresses 2026 et le village gastronomie de la{" "}
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">Foire d’Afrique Paris</Link>{" "}
              les 1 et 2 mai 2026.
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Que trouve-t-on en épicerie africaine ?</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <div key={c.titre} className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-dta-accent" />
                    <h3 className="font-serif text-base font-bold text-dta-dark">{c.titre}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Où acheter des produits africains à Paris ?</h2>
            <p className="mt-3 max-w-2xl text-sm text-dta-char/70">4 zones phares, du marché populaire aux grossistes pour les restaurateurs.</p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {QUARTIERS.map((q) => (
                <div key={q.nom} className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10">
                      <MapPin size={20} className="text-dta-accent" />
                    </div>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{q.tag}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-dta-dark">{q.nom}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{q.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-dta-taupe">{q.metro}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-dta-dark px-4 py-14 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Ticket size={14} /> 1-2 mai 2026 — Espace MAS Paris 13e
            </div>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Village gastronomie à la Foire d’Afrique 2026</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">Street food des 54 pays, démonstrations culinaires, producteurs d’épices et épiceries fines. Dégustez, achetez, repartez avec votre cadeau gourmand.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">Voir les billets <ArrowRight size={14} /></Link>
              <Link href="/lafropeen/meilleurs-restaurants-africains-paris-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Restaurants africains</Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Conseils pour bien choisir en épicerie africaine</h2>
            <ul className="mt-6 space-y-3">
              {[
                { t: "Vérifiez l’origine", d: "Pays importateur affiché sur l’emballage (Sénégal, Côte d’Ivoire, Cameroun, Ghana…)." },
                { t: "Fraîcheur du poisson séché", d: "Il doit être sec, cassant, sans odeur rance. Refusez tout produit huileux au toucher." },
                { t: "Farines et céréales", d: "Préférez les petits conditionnements pour éviter l’infestation par les charançons." },
                { t: "Légumes & tubercules", d: "Plantain bien jaune à noir pour cuisson, manioc ferme sans taches noires." },
              ].map((item) => (
                <li key={item.t} className="flex gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-dta-accent" />
                  <div>
                    <strong className="text-dta-dark">{item.t}</strong>
                    <span className="ml-1 text-dta-char/70">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-dta-beige/40 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <ShoppingBag size={14} /> Bientôt en ligne
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Made in Africa — épicerie fine en ligne</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">Épices rares, sauces artisanales, produits secs : sélection curée de producteurs africains bientôt disponible sur la marketplace Dream Team Africa.</p>
            <div className="mt-6">
              <Link href="/made-in-africa" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">Découvrir Made in Africa <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">À découvrir aussi</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Marché africain à Paris", href: "/marche-africain-paris", emoji: "🛒" },
                { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
                { title: "Cosmétique africaine à Paris", href: "/cosmetique-africaine-paris", emoji: "✨" },
                { title: "Beurre de karité à Paris", href: "/beurre-de-karite-paris", emoji: "🧴" },
                { title: "Tissu wax à Paris", href: "/tissu-wax-paris", emoji: "🎨" },
                { title: "Foire d’Afrique Paris 2026", href: "/saison-culturelle-africaine/foire-dafrique-paris", emoji: "🌍" },
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
      </div>
    </>
  );
}
