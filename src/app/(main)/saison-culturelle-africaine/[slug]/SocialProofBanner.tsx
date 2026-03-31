"use client";

import { useEffect, useState } from "react";
import { Flame, Users } from "lucide-react";

interface Purchase {
  name: string;
  qty: number;
  total: number;
}

const NAMES = [
  "Stéphanie M.", "Mamadou D.", "Christelle V.", "Fatou S.", "Abdoulaye K.",
  "Assa C.", "Jean-Pierre L.", "Aminata T.", "Honorine G.", "Patrick N.",
  "Marie-Claire B.", "Ousmane F.", "Sandrine A.", "Ibrahim H.", "Cécile R.",
  "Abdulrahman B.", "Nadia O.", "David M.", "Aïssatou D.", "Franck T.",
];

function generatePurchases(price: number): Purchase[] {
  return NAMES.map((name) => {
    const qty = Math.random() < 0.6 ? 1 : 2;
    return { name, qty, total: qty * price };
  });
}

interface SocialProofBannerProps {
  sold: number;
  quota: number;
  tierName?: string;
  tierPrice?: number;
}

export default function SocialProofBanner({ sold, quota, tierName = "Early Bird", tierPrice = 10 }: SocialProofBannerProps) {
  const [purchases] = useState(() => generatePurchases(tierPrice));
  const [currentIdx, setCurrentIdx] = useState(0);
  const remaining = quota - sold;
  const percent = Math.round((sold / quota) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % purchases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (remaining <= 0) return null;

  const current = purchases[currentIdx];

  return (
    <div className="mx-auto mt-6 max-w-3xl">
      {/* Urgency bar */}
      <div className="rounded-[var(--radius-card)] border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-800">
              {tierName} — Plus que {remaining} place{remaining > 1 ? "s" : ""} !
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600">
            <Users size={14} />
            {sold}/{quota}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-orange-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-[11px] font-medium text-orange-600/80">
          {percent}% des billets {tierName} vendus
        </p>
      </div>

      {/* Scrolling purchases ticker */}
      <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] bg-white/80 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <div
            key={currentIdx}
            className="animate-[fadeSlide_0.5s_ease-out] text-sm text-dta-char"
          >
            <span className="font-semibold text-dta-dark">{current.name}</span>
            {" "}a réservé{" "}
            <span className="font-semibold text-dta-accent">
              {current.qty} billet{current.qty > 1 ? "s" : ""}
            </span>
            {" "}—{" "}
            <span className="font-semibold text-dta-dark">{current.total} €</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
