import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShoppingBag, Palette, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Tissu wax à Paris — Où acheter du wax authentique au mètre 2026",
  description:
    "Tissu wax authentique à Paris : Château-Rouge, Marché Saint-Pierre, 10e. Prix au mètre, reconnaître un vrai wax, couturiers afro. Foire d’Afrique 1-2 mai 2026.",
  keywords: [
    "tissu wax",
    "tissu wax paris",
    "wax paris",
    "wax au mètre paris",
    "où acheter wax paris",
    "tissu africain paris",
    "vlisco paris",
    "bogolan paris",
    "mode africaine paris",
  ],
  openGraph: {
    title: "Tissu wax à Paris — Guide d’achat 2026",
    description: "Où acheter du tissu wax authentique à Paris, comment le reconnaître et le couturer.",
    url: "https://dreamteamafrica.com/tissu-wax-paris",
    siteName: "Dream Team Africa",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/tissu-wax-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où acheter du tissu wax à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les adresses historiques pour acheter du wax à Paris sont le quartier Château-Rouge (18e, notamment rue des Poissonniers et rue du Poteau), le Marché Saint-Pierre (Montmartre) pour les grandes surfaces de coupons, et l’axe Strasbourg-Saint-Denis / Château d’Eau (10e). Pour du wax haut de gamme certifié (Vlisco, Uniwax), visez les showrooms du Marais ou la Foire d’Afrique Paris 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Comment reconnaître un vrai tissu wax ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un vrai wax est imprimé des deux côtés avec la même intensité (absence de recto/verso marqué), sa couleur est profonde et saturée, il a une tenue rigide caractéristique (présence de cire). Les grandes marques Vlisco (Pays-Bas), Uniwax (Côte d’Ivoire), GTP (Ghana) et ABC Wax impriment leur nom sur la lisière. Un wax authentique coûte entre 15 et 50 € le mètre en boutique.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le prix d’un tissu wax au mètre à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comptez 8 à 15 € le mètre pour du wax d’entrée de gamme (imitation chinoise), 15 à 30 € pour du wax africain authentique (Uniwax, GTP, ABC), et 35 à 80 € pour du Vlisco premium. Le pagne wax se vend traditionnellement en 6 yards (5,5 m environ), format d’origine d’Afrique de l’Ouest.",
      },
    },
    {
      "@type": "Question",
      name: "Différence entre wax, bogolan, kente et bazin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le wax est un tissu en coton imprimé à la cire, multicolore. Le bogolan malien est un tissu teint à la boue, motifs ethniques beige/noir. Le kente ghanéen/togolais est un tissu tissé à la main en bandes colorées géométriques. Le bazin est un coton damassé teint, plus chic, porté pour les cérémonies. Paris distribue ces 4 textiles dans les boutiques spécialisées du 18e et du 10e.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on faire coudre du wax à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, plusieurs couturiers afro et ateliers de mode africaine sont installés à Château-Rouge, Saint-Denis et Bagnolet. Ils confectionnent robes, chemises, ensembles et pagnes sur mesure. Comptez 40-120 € la confection d’une pièce simple. À la Foire d’Afrique Paris 2026, rencontrez directement des créateurs et stylistes pour commander des pièces uniques.",
      },
    },
  ],
};

const QUARTIERS = [
  { nom: "Château-Rouge — Goutte d’Or (18e)", desc: "Le quartier historique du wax à Paris. Rue des Poissonniers, rue Myrha, rue du Poteau : dizaines de boutiques wax au mètre, tailleurs et stylistes. Prix les plus compétitifs.", metro: "M° Château-Rouge, Marcadet-Poissonniers", tag: "Historique" },
  { nom: "Marché Saint-Pierre — Montmartre (18e)", desc: "5 étages de tissus dont un rayon wax et tissus africains. Grandes surfaces de coupons, idéal pour la couture DIY et les grands métrages.", metro: "M° Anvers, Barbès-Rochechouart", tag: "Grand choix" },
  { nom: "Strasbourg-Saint-Denis / Château d’Eau (10e)", desc: "Axe afro de l’Est parisien. Sélection wax + bazin, ambiance moins bondée qu’au 18e. Bon rapport qualité/prix.", metro: "M° Château d’Eau, Strasbourg-Saint-Denis", tag: "Alternative" },
  { nom: "Showrooms premium & salons", desc: "Pour du Vlisco ou de l’Uniwax certifié, préférez les showrooms Marais ou les salons comme la Foire d’Afrique et la Fashion Week Africa Paris.", metro: "Marais, Espace MAS Paris 13e", tag: "Premium" },
];

const USAGES = [
  { titre: "Robes & ensembles", desc: "La pièce reine du wax. Comptez 3 à 5 m pour une robe longue, 6 yards pour un ensemble traditionnel." },
  { titre: "Chemises & hauts homme", desc: "1,5 à 2 m suffisent. Idéal pour cérémonies, mariages et tenues afro-chic." },
  { titre: "Accessoires & déco", desc: "Foulards, coussins, rideaux : le wax habille aussi la maison avec caractère." },
  { titre: "Pagnes & foulards", desc: "Usage traditionnel : pagne 6 yards, foulard de tête, porte-bébé. Art de vivre africain." },
];

export default function TissuWaxParisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Palette size={16} />
              Guide d’achat — Mode africaine
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">Tissu wax à Paris — Où acheter du wax authentique au mètre</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
              Le <strong>wax</strong> est l’emblème de la mode africaine contemporaine. Imprimé à la cire, aux motifs éclatants, il habille robes, chemises, pagnes et accessoires. Paris concentre des centaines de boutiques wax, du marché populaire de Château-Rouge aux showrooms Vlisco du Marais. Voici le guide complet 2026, avec les créateurs à rencontrer à la{" "}
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">Foire d’Afrique Paris</Link>{" "}
              les 1 et 2 mai 2026.
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Reconnaître un vrai tissu wax</h2>
            <p className="mt-4 text-base leading-relaxed text-dta-char/80">Les imitations chinoises inondent le marché. Voici comment distinguer un wax authentique en 4 points.</p>
            <ul className="mt-6 space-y-3">
              {[
                { t: "Impression recto/verso identique", d: "Les deux faces sont aussi colorées, sans différence d’intensité." },
                { t: "Tenue rigide et cireuse", d: "La cire donne au tissu un toucher sec, rigide, qui s’assouplit au lavage." },
                { t: "Lisière marquée", d: "Nom de la marque imprimé : Vlisco, Uniwax, GTP, ABC Wax, Woodin." },
                { t: "Prix cohérent", d: "Un vrai wax démarre à 15 €/m. En dessous de 10 €, c’est de l’imitation." },
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

        <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Où acheter du tissu wax à Paris ?</h2>
            <p className="mt-3 max-w-2xl text-sm text-dta-char/70">4 zones principales selon votre budget et vos besoins.</p>
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
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Créateurs & stylistes wax à la Foire d’Afrique 2026</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">Rencontrez les marques de mode africaine émergentes, faites confectionner une pièce sur mesure, découvrez les nouveaux motifs 2026.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">Voir les billets <ArrowRight size={14} /></Link>
              <Link href="/saison-culturelle-africaine/fashion-week-africa" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Fashion Week Africa</Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Combien de wax pour quel usage ?</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {USAGES.map((u) => (
                <div key={u.titre} className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-dta-accent" />
                    <h3 className="font-serif text-base font-bold text-dta-dark">{u.titre}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{u.desc}</p>
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
            <h2 className="mt-4 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">Made in Africa — mode & textiles africains</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">Wax, bogolan, bazin, kente et créations de stylistes africains : la marketplace arrive. Inscrivez-vous pour être prévenu·e.</p>
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
                { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
                { title: "Marché africain à Paris", href: "/marche-africain-paris", emoji: "🛒" },
                { title: "Cosmétique africaine à Paris", href: "/cosmetique-africaine-paris", emoji: "✨" },
                { title: "Fashion Week Africa 2026", href: "/saison-culturelle-africaine/fashion-week-africa", emoji: "👗" },
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
