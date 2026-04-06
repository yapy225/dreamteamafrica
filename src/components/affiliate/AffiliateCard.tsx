"use client";

import { ExternalLink, Hotel, Car, UtensilsCrossed, MapPin, Train, Sparkles } from "lucide-react";

const TYPE_CONFIG = {
  hotel: {
    icon: Hotel,
    label: "Hébergement",
    gradient: "from-amber-700/10 to-amber-900/5",
    iconColor: "text-amber-700",
    badgeColor: "bg-amber-700/15 text-amber-800",
  },
  spa: {
    icon: Sparkles,
    label: "Bien-être",
    gradient: "from-emerald-700/10 to-emerald-900/5",
    iconColor: "text-emerald-700",
    badgeColor: "bg-emerald-700/15 text-emerald-800",
  },
  car: {
    icon: Car,
    label: "Transport",
    gradient: "from-sky-700/10 to-sky-900/5",
    iconColor: "text-sky-700",
    badgeColor: "bg-sky-700/15 text-sky-800",
  },
  restaurant: {
    icon: UtensilsCrossed,
    label: "Restaurant",
    gradient: "from-rose-700/10 to-rose-900/5",
    iconColor: "text-rose-700",
    badgeColor: "bg-rose-700/15 text-rose-800",
  },
  activity: {
    icon: MapPin,
    label: "Activité",
    gradient: "from-violet-700/10 to-violet-900/5",
    iconColor: "text-violet-700",
    badgeColor: "bg-violet-700/15 text-violet-800",
  },
  transport: {
    icon: Train,
    label: "Transport",
    gradient: "from-indigo-700/10 to-indigo-900/5",
    iconColor: "text-indigo-700",
    badgeColor: "bg-indigo-700/15 text-indigo-800",
  },
} as const;

export type AffiliateType = keyof typeof TYPE_CONFIG;

interface AffiliateCardProps {
  type: AffiliateType;
  name: string;
  description: string;
  price?: string;
  affiliateUrl: string;
  badge?: string;
  cta?: string;
}

export default function AffiliateCard({
  type,
  name,
  description,
  price,
  affiliateUrl,
  badge,
  cta,
}: AffiliateCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={`group relative block overflow-hidden rounded-[var(--radius-card)] border border-dta-sand/40 bg-gradient-to-br ${config.gradient} p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 sm:p-6`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm ${config.iconColor}`}>
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold text-dta-dark sm:text-lg">
              {name}
            </h3>
            {badge && (
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.badgeColor}`}>
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-relaxed text-dta-char/70">
            {description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            {price && (
              <span className="text-sm font-semibold text-dta-accent-dark">
                {price}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-dta-accent-dark">
              {cta || "Réserver"}
              <ExternalLink size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Affiliate disclosure tooltip */}
      <span className="absolute right-2 top-2 cursor-help text-[10px] text-dta-taupe/60 transition-colors hover:text-dta-taupe" title="Lien affilié — Dream Team Africa perçoit une commission sans frais supplémentaires pour vous.">
        Partenaire
      </span>
    </a>
  );
}
