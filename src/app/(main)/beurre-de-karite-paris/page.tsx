import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShoppingBag, Leaf, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Beurre de karité à Paris — Où acheter du karité pur authentique 2026",
  description:
    "Beurre de karité pur à Paris : où l'acheter, comment le reconnaître, bienfaits. Guide 2026 des adresses Château-Rouge, Marché Dejean, 13e. Foire d'Afrique 1-2 mai.",
  keywords: [
    "beurre de karité",
    "beurre de karité paris",
    "beurre de karité pur",
    "beurre de karité authentique paris",
    "où acheter beurre de karité paris",
    "karité non raffiné paris",
    "cosmétique africaine paris",
    "château-rouge beurre karité",
    "produits africains paris",
  ],
  openGraph: {
    title: "Beurre de karité à Paris — Guide d'achat 2026",
    description:
      "Où trouver du beurre de karité pur et authentique à Paris. Adresses, conseils, bienfaits.",
    url: "https://dreamteamafrica.com/beurre-de-karite-paris",
    siteName: "Dream Team Africa",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/beurre-de-karite-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où acheter du beurre de karité pur à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les meilleures adresses pour trouver du beurre de karité pur à Paris se concentrent dans le quartier de la Goutte d'Or (18e) : Marché Dejean, rue Myrha, rue des Poissonniers autour de la station Château-Rouge. On en trouve aussi dans le quartier Strasbourg-Saint-Denis (10e) et dans le 13e arrondissement. Pour une sélection curée de producteurs, la Foire d'Afrique Paris (1-2 mai 2026) rassemble plus de 50 exposants spécialisés en cosmétiques naturels africains.",
      },
    },
    {
      "@type": "Question",
      name: "Comment reconnaître un beurre de karité authentique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un beurre de karité pur et non raffiné est de couleur ivoire à jaune pâle (jamais blanc pur), avec une odeur légèrement fumée et noisettée caractéristique. Sa texture est granuleuse à température ambiante et fond au contact de la peau. La mention '100% pur', 'non raffiné' ou 'brut' doit figurer sur l'étiquette. Un beurre trop blanc, inodore ou trop lisse a généralement été raffiné industriellement et a perdu une grande partie de ses propriétés.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les bienfaits du beurre de karité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le beurre de karité est riche en vitamines A, E et F et en acides gras insaturés. Il nourrit et assouplit la peau sèche, apaise les irritations, protège des agressions climatiques, soigne les cheveux abîmés et crépus, cicatrise les gerçures et vergetures. Utilisé depuis des siècles en Afrique de l'Ouest, c'est un soin multi-usage visage, corps et cheveux.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre beurre de karité raffiné et non raffiné ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le karité non raffiné (ou brut) est extrait à froid par pression mécanique, conservant toutes ses vitamines et propriétés. Le raffiné subit un traitement chimique (désodorisation, décoloration) qui lui fait perdre jusqu'à 75% de ses actifs. Pour un usage cosmétique optimal, privilégiez toujours le non raffiné issu d'une coopérative africaine.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on acheter du beurre de karité à la Foire d'Afrique Paris 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. La Foire d'Afrique Paris 2026 (1-2 mai, Espace MAS Paris 13e) accueille une sélection d'exposants producteurs et distributeurs de cosmétiques naturels africains, dont plusieurs spécialistes du beurre de karité issu de coopératives du Burkina Faso, Ghana, Mali et Côte d'Ivoire. Billets à partir de 5 € avec Culture pour Tous.",
      },
    },
  ],
};

const QUARTIERS = [
  {
    nom: "Goutte d'Or — Château-Rouge (18e)",
    desc: "Le cœur de la diaspora ouest-africaine à Paris. Marché Dejean, rue Myrha, rue des Poissonniers : dizaines de boutiques cosmétiques afro proposant du karité brut importé directement du Mali, Burkina, Ghana. Prix les plus compétitifs de la ville.",
    metro: "M° Château-Rouge (ligne 4)",
    tag: "Incontournable",
  },
  {
    nom: "Strasbourg-Saint-Denis — Belleville (10e/11e)",
    desc: "Axe commerçant multiculturel avec plusieurs boutiques africaines et orientales. Bonne alternative au 18e, souvent moins bondée le samedi. Sélection plus restreinte mais qualité au rendez-vous.",
    metro: "M° Strasbourg-Saint-Denis, Château d'Eau",
    tag: "Alternative",
  },
  {
    nom: "Paris 13e — Olympiades",
    desc: "Proche de l'Espace MAS où se tient la Foire d'Afrique. Quelques épiceries africaines et boutiques cosmétiques émergentes. Pratique à combiner avec la visite de la Foire le 1-2 mai 2026.",
    metro: "M° Olympiades, Tolbiac",
    tag: "Proche Foire",
  },
  {
    nom: "Marchés éphémères & salons",
    desc: "Les salons professionnels restent la meilleure occasion d'acheter directement auprès des producteurs, sans intermédiaire. Karité 100 % traçable, souvent issu de coopératives féminines africaines.",
    metro: "Foire d'Afrique, Salon Made In Africa",
    tag: "Producteurs",
  },
];

const BIENFAITS = [
  { titre: "Peau sèche & eczéma", desc: "Nourrit intensément, apaise les démangeaisons, restaure la barrière cutanée." },
  { titre: "Cheveux crépus & secs", desc: "Hydrate la fibre, réduit la casse, scelle l'hydratation en méthode LOC/LCO." },
  { titre: "Gerçures & vergetures", desc: "Cicatrise et prévient l'apparition grâce aux vitamines A, E et acides gras." },
  { titre: "Anti-âge naturel", desc: "Antioxydants puissants qui préviennent le vieillissement cutané." },
];

export default function BeurreDeKariteParisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Leaf size={16} />
              Guide d&apos;achat — Cosmétiques naturels
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
              Beurre de karité à Paris — Où acheter du karité pur authentique
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
              Le <strong>beurre de karité</strong> est le soin ancestral d&apos;Afrique de l&apos;Ouest par excellence. Nourrissant, cicatrisant, anti-âge : il s&apos;utilise sur le visage, le corps et les cheveux. Encore faut-il trouver du karité <em>pur, non raffiné</em> et traçable. Voici où l&apos;acheter à Paris en 2026, et les exposants à rencontrer lors de la{" "}
              <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
                Foire d&apos;Afrique Paris
              </Link>{" "}
              les 1 et 2 mai 2026.
            </p>
          </div>
        </section>

        {/* Reconnaître un karité pur */}
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Comment reconnaître un beurre de karité pur ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-dta-char/80">
              La majorité du karité vendu en grande distribution est <strong>raffiné industriellement</strong> : désodorisé, décoloré, parfois additionné de conservateurs. Il perd jusqu&apos;à 75 % de ses vitamines. Le karité authentique se reconnaît à 4 signes.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { t: "Couleur ivoire à jaune pâle", d: "Jamais blanc pur (signe de raffinage chimique)." },
                { t: "Odeur légèrement fumée et noisettée", d: "Caractéristique du karité brut africain. Un karité inodore est raffiné." },
                { t: "Texture granuleuse à température ambiante", d: "Fond instantanément au contact de la peau (35 °C)." },
                { t: "Mention « 100 % pur », « non raffiné » ou « brut »", d: "Idéalement avec le pays d’origine : Burkina Faso, Mali, Ghana, Côte d’Ivoire." },
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

        {/* Où acheter */}
        <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Où acheter du beurre de karité à Paris ?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-dta-char/70">
              4 zones principales pour trouver du karité pur à Paris. Comparez les prix et privilégiez les vendeurs qui affichent l&apos;origine.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {QUARTIERS.map((q) => (
                <div
                  key={q.nom}
                  className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10">
                      <MapPin size={20} className="text-dta-accent" />
                    </div>
                    <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">
                      {q.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-dta-dark">{q.nom}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{q.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-dta-taupe">{q.metro}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Foire */}
        <section className="bg-dta-dark px-4 py-14 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Ticket size={14} />
              1-2 mai 2026 — Espace MAS Paris 13e
            </div>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              Rencontrez les producteurs à la Foire d&apos;Afrique Paris 2026
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
              50+ exposants dont des coopératives africaines spécialisées en karité, huiles végétales et cosmétiques naturels. Achetez directement au prix producteur, posez vos questions, découvrez de nouvelles marques.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/saison-culturelle-africaine/foire-dafrique-paris"
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
              >
                Voir les billets <ArrowRight size={14} />
              </Link>
              <Link
                href="/exposants"
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Liste des exposants
              </Link>
            </div>
          </div>
        </section>

        {/* Bienfaits */}
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Les bienfaits du beurre de karité
            </h2>
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

        {/* Teaser marketplace */}
        <section className="bg-dta-beige/40 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <ShoppingBag size={14} />
              Bientôt en ligne
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Made in Africa — la marketplace arrive
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">
              Beurre de karité, huile de chebé, savon noir, cosmétiques naturels : achetez directement les produits de nos exposants en ligne. Inscrivez-vous pour être prévenu·e du lancement.
            </p>
            <div className="mt-6">
              <Link
                href="/made-in-africa"
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
              >
                Découvrir Made in Africa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Maillage interne */}
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">À découvrir aussi</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Marché africain à Paris", href: "/marche-africain-paris", emoji: "🛒" },
                { title: "Boutiques africaines à Paris", href: "/boutique-africaine-paris", emoji: "🛍️" },
                { title: "Foire d'Afrique Paris 2026", href: "/saison-culturelle-africaine/foire-dafrique-paris", emoji: "🌍" },
                { title: "Salon Made In Africa 2026", href: "/saison-culturelle-africaine/salon-made-in-africa-2026", emoji: "🎁" },
                { title: "Calendrier foires & salons 2026", href: "/foire-paris-2026", emoji: "📅" },
                { title: "Marketplace Made in Africa", href: "/made-in-africa", emoji: "✨" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 transition-all hover:bg-dta-accent/5 hover:shadow-sm"
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
      </div>
    </>
  );
}
