import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShoppingBag, Leaf, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Cosmétique africaine à Paris — Guide des soins naturels 2026",
  description:
    "Cosmétique africaine à Paris : karité, chebé, savon noir, huile de coco, beurre de cacao. Guide 2026 des produits, adresses et marques afro-beauty. Foire d’Afrique 1-2 mai.",
  keywords: [
    "cosmétique afrique",
    "cosmétique africaine",
    "cosmétique africaine paris",
    "produits de beauté africains paris",
    "soins naturels afro paris",
    "afro beauty paris",
    "savon noir africain paris",
    "beurre de cacao paris",
    "huile de coco paris",
    "salon de coiffure afro paris",
  ],
  openGraph: {
    title: "Cosmétique africaine à Paris — Guide 2026",
    description: "Les soins naturels africains à Paris : karité, chebé, savon noir, beurre de cacao, huile de coco.",
    url: "https://dreamteamafrica.com/cosmetique-africaine-paris",
    siteName: "Dream Team Africa",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/cosmetique-africaine-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quels sont les meilleurs produits de cosmétique africaine ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les soins naturels africains incontournables sont : le beurre de karité (hydratation visage/corps/cheveux), l’huile de chebé (croissance capillaire), le savon noir africain (gommage et nettoyage visage), l’huile de coco vierge (soin multi-usage), le beurre de cacao (peau sèche et vergetures), l’huile de baobab (anti-âge), le rhassoul marocain (masque capillaire et visage) et l’huile de ricin (cils, sourcils, cheveux).",
      },
    },
    {
      "@type": "Question",
      name: "Où acheter de la cosmétique africaine à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le quartier Château-Rouge (Goutte d’Or, 18e) concentre les boutiques afro-beauty avec les meilleurs prix. L’axe Strasbourg-Saint-Denis / Château d’Eau (10e) offre une alternative. Les pharmacies afro-antillaises proposent des formules certifiées. Pour des marques émergentes, visitez la Foire d’Afrique Paris (1-2 mai 2026) qui rassemble producteurs et créatrices afro-beauty.",
      },
    },
    {
      "@type": "Question",
      name: "Cosmétique africaine = cosmétique bio ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pas automatiquement. La cosmétique africaine traditionnelle utilise des ingrédients naturels (karité, huiles végétales, argiles), mais les produits vendus peuvent contenir des additifs. Pour du 100% naturel, privilégiez les mentions 'pur', 'non raffiné', 'bio Ecocert' ou achetez directement auprès de coopératives africaines présentes aux salons afro-beauty de Paris.",
      },
    },
    {
      "@type": "Question",
      name: "Les cosmétiques africains conviennent à tous les types de peau ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, la plupart des ingrédients africains (karité, huile de coco, savon noir, argile) conviennent aux peaux noires, métisses et caucasiennes. Les peaux grasses préféreront les huiles sèches (baobab, pépins de raisin) et le savon noir. Les peaux sèches bénéficieront du karité, du beurre de cacao et de l’huile de coco. Toujours tester une petite zone avant usage.",
      },
    },
    {
      "@type": "Question",
      name: "Où trouver un salon de coiffure afro à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Château-Rouge, Château d’Eau et Strasbourg-Saint-Denis concentrent les salons afro spécialisés : tresses, locks, coiffures protectrices, défrisage, soins capillaires. Paris compte aussi des salons afro-premium au Marais et dans le 17e. Pour un diagnostic capillaire naturel, plusieurs experts afro-beauty tiennent des ateliers à la Foire d’Afrique Paris 2026.",
      },
    },
  ],
};

const PRODUITS = [
  { titre: "Beurre de karité", desc: "Nourrit, cicatrise, anti-âge. Multi-usage visage, corps, cheveux.", href: "/beurre-de-karite-paris", emoji: "🧈" },
  { titre: "Huile de chebé", desc: "Croissance capillaire, rétention de longueur sur cheveux afro.", href: "/huile-de-chebe-paris", emoji: "🌿" },
  { titre: "Savon noir africain", desc: "Gommage doux, purifiant, pour tous les types de peau.", href: null, emoji: "🧼" },
  { titre: "Huile de coco vierge", desc: "Hydratant naturel multi-usage, démaquillant, soin capillaire.", href: null, emoji: "🥥" },
  { titre: "Beurre de cacao", desc: "Ultra-nourrissant, anti-vergetures, apaise peau sèche.", href: null, emoji: "🍫" },
  { titre: "Huile de baobab", desc: "Régénérante, anti-âge, riche en oméga 3-6-9.", href: null, emoji: "🌳" },
];

const QUARTIERS = [
  { nom: "Château-Rouge — Goutte d’Or (18e)", desc: "Le cœur afro-beauty de Paris. Marché Dejean, rue des Poissonniers, rue Myrha : prix imbattables sur tous les soins afro.", metro: "M° Château-Rouge", tag: "Cœur" },
  { nom: "Château d’Eau / Strasbourg-Saint-Denis (10e)", desc: "Concentration de salons afro et boutiques cosmétiques afro-antillaises. Conseil en boutique souvent excellent.", metro: "M° Château d’Eau", tag: "Salons" },
  { nom: "Pharmacies afro-antillaises", desc: "Paris compte plusieurs pharmacies spécialisées cosmétique afro : formules certifiées, conseil pharmacien, adaptées aux peaux noires.", metro: "Paris 18e, 10e, 13e", tag: "Certifié" },
  { nom: "Foire d’Afrique & salons afro-beauty", desc: "Rencontre directe avec marques émergentes et coopératives. Produits testables, traçabilité garantie, nouveautés 2026.", metro: "Espace MAS, Paris 13e", tag: "Producteurs" },
];

export default function CosmetiqueAfricaineParisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Leaf size={16} />
              Guide afro-beauty
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">Cosmétique africaine à Paris — Guide des soins naturels</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
              La <strong>cosmétique africaine</strong> puise dans des traditions millénaires : beurre de karité du Burkina, huile de chebé du Tchad, savon noir du Ghana, beurre de cacao de Côte d’Ivoire. Paris est l’une des capitales européennes de l’afro-beauty. Voici le panorama 2026 des produits, quartiers et marques, avec les créatrices à rencontrer à la{" "}
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">Foire d’Afrique Paris</Link>{" "}
              les 1 et 2 mai 2026.
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Les 6 incontournables de la cosmétique africaine</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUITS.map((p) => {
                const card = (
                  <div className="h-full rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
                    <span className="text-3xl">{p.emoji}</span>
                    <h3 className="mt-3 font-serif text-base font-bold text-dta-dark">{p.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{p.desc}</p>
                    {p.href && (
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-dta-accent">
                        Guide complet <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                );
                return p.href ? <Link key={p.titre} href={p.href}>{card}</Link> : <div key={p.titre}>{card}</div>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Où acheter de la cosmétique africaine à Paris ?</h2>
            <p className="mt-3 max-w-2xl text-sm text-dta-char/70">4 options selon votre budget et vos exigences de traçabilité.</p>
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
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Marques afro-beauty à la Foire d’Afrique 2026</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">Coopératives africaines, marques émergentes, ateliers pratiques : le rendez-vous cosmétique africaine de l’année. Testez, comparez, achetez directement auprès des productrices.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">Voir les billets <ArrowRight size={14} /></Link>
              <Link href="/exposants" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Liste des exposants</Link>
            </div>
          </div>
        </section>

        <section className="bg-dta-beige/40 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <ShoppingBag size={14} /> Bientôt en ligne
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Made in Africa — marketplace afro-beauty</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">Karité, chebé, savon noir, huiles végétales : sélection curée de nos exposants bientôt disponible en ligne.</p>
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
                { title: "Huile de chebé à Paris", href: "/huile-de-chebe-paris", emoji: "🌿" },
                { title: "Tissu wax à Paris", href: "/tissu-wax-paris", emoji: "🎨" },
                { title: "Épicerie africaine à Paris", href: "/epicerie-africaine-paris", emoji: "🥘" },
                { title: "Marché africain à Paris", href: "/marche-africain-paris", emoji: "🛒" },
                { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
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
