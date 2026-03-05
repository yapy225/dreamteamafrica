import Link from "next/link";
import { Check, ImageIcon, Video, FileText, Search, Megaphone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "DTA Ads — Publicite",
  description: "Boostez votre visibilite aupres de la communaute africaine de Paris avec DTA Ads.",
};

const plans = [
  {
    id: "ESSENTIEL",
    name: "Essentiel",
    price: 29,
    period: "/mois",
    description: "Ideal pour debuter et tester votre visibilite",
    features: [
      "2 pages au choix",
      "Image / Banniere",
      "Placements inline et sidebar",
      "Rotation standard",
      "Tableau de bord avec impressions & clics",
    ],
    cta: "Choisir Essentiel",
    highlight: false,
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: 79,
    period: "/mois",
    description: "Visibilite sur toutes les pages + SEO",
    features: [
      "Toutes les pages (5 pages)",
      "Image, Video, Article sponsorise",
      "Banniere top + inline + sidebar",
      "1 article satellite SEO / mois",
      "Analytics detailles",
      "Support prioritaire",
    ],
    cta: "Choisir Business",
    highlight: true,
  },
  {
    id: "ELITE",
    name: "Elite",
    price: 149,
    period: "/mois",
    description: "Visibilite maximale avec positions premium",
    features: [
      "Toutes les pages + positions premium",
      "Tous les formats (image, video, article, satellite)",
      "Hero banner + interstitiel mobile",
      "3 articles satellites SEO / mois",
      "Rotation x3 (priorite absolue)",
      "Account manager dedie",
    ],
    cta: "Choisir Elite",
    highlight: false,
  },
];

const supports = [
  {
    icon: ImageIcon,
    title: "Image / Banniere",
    description: "Visuel statique cliquable affiche en banniere, inline ou sidebar. Formats : 1080x1080, 1920x1080, 1080x1920.",
  },
  {
    icon: Video,
    title: "Video",
    description: "Clip autoplay muet avec CTA. Insere entre les sections de contenu editorial. Formats : 1920x1080, 1080x1920.",
  },
  {
    icon: FileText,
    title: "Article sponsorise",
    description: "Article integre au flux editorial avec badge 'Sponsorise'. Visible comme un contenu natif a forte engagement.",
  },
  {
    icon: Search,
    title: "Article satellite (SEO)",
    description: "Article redige autour de vos mots-cles avec backlinks vers votre site. Boost de referencement organique.",
  },
];

export default function AdsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="rounded-[var(--radius-full)] bg-dta-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-dta-accent">
          DTA Ads
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Boostez votre visibilite
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          Touchez la communaute africaine de Paris avec des formats publicitaires
          natifs et performants sur 5 pages : Accueil, Journal, Officiel, Marketplace et Evenements.
        </p>
      </div>

      {/* Supports */}
      <section className="mb-20">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          4 supports publicitaires
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supports.map((s) => (
            <div
              key={s.title}
              className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 inline-flex rounded-[var(--radius-button)] bg-dta-accent/10 p-3 text-dta-accent">
                <s.icon size={24} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-dta-dark">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 formats */}
      <section className="mb-20">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          3 formats d&apos;image
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { name: "Carre", dim: "1080 x 1080", ratio: "1:1", use: "Sidebar, inline, feed mobile" },
            { name: "Paysage", dim: "1920 x 1080", ratio: "16:9", use: "Hero, banniere top, video" },
            { name: "Portrait", dim: "1080 x 1920", ratio: "9:16", use: "Sidebar grande, interstitiel mobile" },
          ].map((f) => (
            <div
              key={f.name}
              className="rounded-[var(--radius-card)] bg-white p-6 text-center shadow-[var(--shadow-card)]"
            >
              <h3 className="font-serif text-lg font-semibold text-dta-dark">{f.name}</h3>
              <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">{f.dim}</p>
              <p className="mt-1 text-xs text-dta-taupe">Ratio {f.ratio}</p>
              <p className="mt-3 text-sm text-dta-char/70">{f.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          Choisissez votre plan
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] ${
                plan.highlight ? "ring-2 ring-dta-accent" : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] bg-dta-accent px-4 py-1 text-xs font-semibold text-white">
                  Populaire
                </span>
              )}

              <h3 className="font-serif text-xl font-bold text-dta-dark">{plan.name}</h3>
              <p className="mt-1 text-sm text-dta-char/60">{plan.description}</p>

              <div className="mt-6">
                <span className="font-serif text-4xl font-bold text-dta-dark">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-sm text-dta-taupe">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-dta-char/80">
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-dta-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/dashboard/ads/new?plan=${plan.id}`}
                className={`mt-8 block w-full rounded-[var(--radius-button)] px-6 py-3 text-center text-sm font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
                    : "bg-dta-dark text-white hover:bg-dta-char"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pages coverage */}
      <section className="mt-20">
        <div className="rounded-[var(--radius-card)] bg-dta-beige/50 p-8 text-center">
          <Megaphone size={32} className="mx-auto text-dta-accent" />
          <h3 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Rotation sur 5 pages
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Vos publicites tournent automatiquement sur l&apos;Accueil, le Journal (L&apos;Afropeen),
            L&apos;Officiel d&apos;Afrique, la Marketplace et les Evenements pour maximiser votre visibilite.
          </p>
        </div>
      </section>
    </div>
  );
}
