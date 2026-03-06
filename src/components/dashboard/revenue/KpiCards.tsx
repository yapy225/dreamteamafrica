"use client";

import { formatPrice } from "@/lib/utils";

type KpiCardsProps = {
  totals: {
    tickets: number;
    orders: number;
    total: number;
  };
};

const SOURCES = [
  { key: "total" as const, label: "Revenu total", color: "bg-dta-accent/10 text-dta-accent" },
  { key: "tickets" as const, label: "Billetterie", color: "bg-[#8B6F4E]/10 text-[#8B6F4E]" },
  { key: "orders" as const, label: "Commandes", color: "bg-[#6B8FA0]/10 text-[#6B8FA0]" },
] as const;

export function KpiCards({ totals }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SOURCES.map((s) => (
        <div
          key={s.key}
          className={`rounded-[var(--radius-card)] p-4 ${s.color}`}
        >
          <p className="text-xs font-medium opacity-70">{s.label}</p>
          <p className="mt-1 font-serif text-xl font-bold">
            {formatPrice(totals[s.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
