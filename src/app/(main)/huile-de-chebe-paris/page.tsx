import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShoppingBag, Leaf, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Huile de chebé à Paris — Où acheter, bienfaits & utilisation 2026",
  description:
    "Huile de chebé authentique à Paris : bienfaits, comment l’utiliser sur les cheveux, où l’acheter. Guide 2026, adresses Château-Rouge et Foire d’Afrique 1-2 mai.",
  keywords: [
    "huile de chebé",
    "huile de chebe",
    "huile de chebé paris",
    "huile de chebe bienfaits",
    "comment utiliser l'huile de chebe sur les cheveux",
    "chebe tchadien",
    "pousse cheveux afro",
    "cosmétique africaine paris",
  ],
  openGraph: {
    title: "Huile de chebé à Paris — Guide 2026",
    description: "Où acheter de l’huile de chebé authentique à Paris, bienfaits et mode d’emploi.",
    url: "https://dreamteamafrica.com/huile-de-chebe-paris",
    siteName: "Dream Team Africa",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/huile-de-chebe-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu’est-ce que l’huile de chebé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le chebé (ou chébé) est une poudre ancestrale utilisée par les femmes Basara du Tchad pour obtenir des cheveux très longs. Fabriquée à partir de graines de Croton Gratissimus mélangées à de la pierre de clou de girofle et du parfum Mahaleb, elle est souvent combinée à une huile végétale (karité, ricin, coco) pour former l’huile de chebé. Elle limite la casse et favorise la rétention de longueur sur cheveux afro et crépus.",
      },
    },
    {
      "@type": "Question",
      name: "Comment utiliser l’huile de chebé sur les cheveux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Appliquez l’huile de chebé sur cheveux propres et humides, mèche par mèche, des pointes vers les racines. Massez le cuir chevelu, puis faites des tresses ou vanilles et laissez poser 24 à 72 h avant le lavage suivant. Répétez 1 à 2 fois par semaine. Pour un effet maximal, associez avec un spray hydratant à base d’eau et d’aloé véra (méthode LOC).",
      },
    },
    {
      "@type": "Question",
      name: "Où acheter de l’huile de chebé authentique à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les boutiques spécialisées du quartier Château-Rouge (Goutte d’Or, 18e), du marché Dejean et de la rue des Poissonniers proposent de l’huile de chebé importée directement du Tchad. À la Foire d’Afrique Paris (1-2 mai 2026, Espace MAS 13e), plusieurs exposants présentent des marques africaines authentiques avec traçabilité.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les bienfaits de l’huile de chebé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L’huile de chebé limite la casse des cheveux, favorise la rétention de longueur, nourrit la fibre capillaire, scelle l’hydratation et renforce les cheveux fragilisés. Idéale pour les cheveux afro, crépus, bouclés et abîmés par les défrisants ou la chaleur.",
      },
    },
    {
      "@type": "Question",
      name: "Huile de chebé ou poudre de chebé : quelle différence ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La poudre de chebé est la forme traditionnelle tchadienne, à mélanger soi-même avec une huile végétale (ricin, karité fondu, coco). L’huile de chebé est la version prête à l’emploi, mélange déjà réalisé. Pour un usage maîtrisé et des ingrédients contrôlés, la poudre est préférée ; pour la praticité, optez pour l’huile.",
      },
    },
  ],
};

const QUARTIERS = [
  { nom: "Château-Rouge — Goutte d’Or (18e)", desc: "Le cœur afro-caribéen de Paris. Boutiques spécialisées cheveux afro, dizaines de marques dont des huiles de chebé importées du Tchad et d’Afrique de l’Ouest.", metro: "M° Château-Rouge (ligne 4)", tag: "Incontournable" },
  { nom: "Strasbourg-Saint-Denis / Château d’Eau (10e)", desc: "Axe afro et multiculturel, nombreuses boutiques capillaires. Sélection curée, service conseil souvent disponible.", metro: "M° Château d’Eau, Strasbourg-Saint-Denis", tag: "Conseil" },
  { nom: "Boutiques en ligne & marketplaces", desc: "Pratique mais attention aux contrefaçons. Vérifiez l’origine (Tchad, Afrique subsaharienne) et la composition (graines de Croton Gratissimus).", metro: "En ligne", tag: "Pratique" },
  { nom: "Foire d’Afrique & salons", desc: "Rencontrez directement les importatrices et marques afro-beauty sur la Foire d’Afrique Paris (1-2 mai 2026). Produits traçables, conseils personnalisés.", metro: "Espace MAS, Paris 13e", tag: "Producteurs" },
];

const BIENFAITS = [
  { titre: "Rétention de longueur", desc: "Limite drastiquement la casse, permet aux cheveux crépus de pousser sans se briser." },
  { titre: "Nutrition intense", desc: "Huiles végétales et graines nourrissent la fibre en profondeur." },
  { titre: "Cheveux fragilisés", desc: "Restaure les cheveux abîmés par défrisage, décoloration ou chaleur excessive." },
  { titre: "Scellement hydratation", desc: "Piège l’humidité apportée par les soins hydratants à base d’eau." },
];

export default function HuileDeChebeParisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Leaf size={16} />
              Guide capillaire — Soin afro
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
              Huile de chebé à Paris — Où l’acheter, bienfaits et utilisation
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
              L’<strong>huile de chebé</strong> est le secret ancestral des femmes Basara du Tchad, connues pour leurs cheveux d’une longueur exceptionnelle. Utilisée depuis des générations sur les cheveux afro et crépus, elle limite la casse et favorise la rétention de longueur. Voici où l’acheter à Paris en 2026 et comment l’utiliser, avec les exposants à rencontrer à la{" "}
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
                Foire d’Afrique Paris
              </Link>{" "}
              les 1 et 2 mai 2026.
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Comment utiliser l’huile de chebé sur les cheveux ?</h2>
            <p className="mt-4 text-base leading-relaxed text-dta-char/80">La méthode tchadienne ancestrale est simple mais exigeante en régularité. Voici les 4 étapes pour tirer le maximum de l’huile de chebé.</p>
            <ol className="mt-6 space-y-3">
              {[
                { t: "1. Hydratez d’abord", d: "Vaporisez un mélange eau + aloé véra sur cheveux propres et démêlés." },
                { t: "2. Appliquez l’huile de chebé", d: "Mèche par mèche, des pointes vers les racines. Massez le cuir chevelu." },
                { t: "3. Protégez en coiffure basse", d: "Tresses, vanilles ou chignon. Couvrez avec un foulard en satin la nuit." },
                { t: "4. Laissez poser 24 à 72 h", d: "Renouvelez 1 à 2 fois par semaine. Résultats visibles après 4 à 8 semaines." },
              ].map((item) => (
                <li key={item.t} className="flex gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-dta-accent" />
                  <div>
                    <strong className="text-dta-dark">{item.t}</strong>
                    <span className="ml-1 text-dta-char/70">{item.d}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Où acheter de l’huile de chebé à Paris ?</h2>
            <p className="mt-3 max-w-2xl text-sm text-dta-char/70">4 options pour trouver de l’huile de chebé authentique. Vérifiez toujours l’origine (Tchad, Afrique subsaharienne) et la traçabilité.</p>
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
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Afro-beauty à la Foire d’Afrique Paris 2026</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">Marques capillaires afro, huiles ancestrales, soins naturels : rencontrez les créatrices et importatrices sur 2 jours. Conseils personnalisés, produits testables.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">Voir les billets <ArrowRight size={14} /></Link>
              <Link href="/exposants" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Liste des exposants</Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Les bienfaits de l’huile de chebé</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {BIENFAITS.map((b) => (
                <div key={b.titre} className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-dta-accent" />
                    <h3 className="font-serif text-base font-bold text-dta-dark">{b.titre}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-dta-beige/40 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <ShoppingBag size={14} /> Bientôt en ligne
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Made in Africa — huiles & cosmétiques authentiques</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">Huile de chebé, beurre de karité, huile de coco, savon noir : les soins afro de nos exposants bientôt disponibles en ligne. Inscrivez-vous au lancement.</p>
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
                { title: "Beurre de karité à Paris", href: "/beurre-de-karite-paris", emoji: "🧴" },
                { title: "Cosmétique africaine à Paris", href: "/cosmetique-africaine-paris", emoji: "✨" },
                { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
                { title: "Marché africain à Paris", href: "/marche-africain-paris", emoji: "🛒" },
                { title: "Foire d’Afrique Paris 2026", href: "/saison-culturelle-africaine/foire-dafrique-paris", emoji: "🌍" },
                { title: "Marketplace Made in Africa", href: "/made-in-africa", emoji: "🌱" },
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
