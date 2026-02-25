import Link from "next/link";
import { Check, Megaphone, BarChart3, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "DTA Ads — Publicité",
  description: "Boostez votre visibilité auprès de la communauté africaine de Paris avec DTA Ads.",
};

const plans = [
  {
    id: "STARTER",
    name: "Starter",
    price: 29,
    period: "/mois",
    description: "Idéal pour débuter et tester votre visibilité",
    features: [
      "1 campagne active",
      "Bannière publicitaire",
      "1 000 impressions/mois",
      "Tableau de bord basique",
      "Support par email",
    ],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 79,
    period: "/mois",
    description: "Pour les professionnels qui veulent des résultats",
    features: [
      "3 campagnes actives",
      "Bannière + Article sponsorisé",
      "5 000 impressions/mois",
      "Tableau de bord avancé",
      "Analytics détaillés",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: 149,
    period: "/mois",
    description: "Visibilité maximale avec tous les formats",
    features: [
      "Campagnes illimitées",
      "Tous les formats (bannière, article, vidéo)",
      "15 000 impressions/mois",
      "Tableau de bord complet",
      "Analytics temps réel",
      "Account manager dédié",
      "Placement prioritaire",
    ],
    cta: "Choisir Premium",
    highlight: false,
  },
];

const formats = [
  {
    icon: Megaphone,
    title: "Article sponsorisé",
    description: "Votre contenu intégré dans le flux de L'Afropéen, identifié comme sponsorisé. Format natif à forte engagement.",
  },
  {
    icon: BarChart3,
    title: "Bannière publicitaire",
    description: "Affichage visuel dans la marketplace et les pages événements. Formats desktop et mobile optimisés.",
  },
  {
    icon: Zap,
    title: "Publicité vidéo",
    description: "Format vidéo premium affiché en position stratégique. Idéal pour les lancements de marque et produits.",
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
          Boostez votre visibilité
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          Touchez la communauté africaine de Paris avec des formats publicitaires
          natifs et performants.
        </p>
      </div>

      {/* Formats */}
      <section className="mb-20">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          3 formats publicitaires
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {formats.map((format) => (
            <div
              key={format.title}
              className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 inline-flex rounded-[var(--radius-button)] bg-dta-accent/10 p-3 text-dta-accent">
                <format.icon size={24} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-dta-dark">{format.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{format.description}</p>
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
    </div>
  );
}
