"use client";

import { useEffect, useState, useRef } from "react";
import { formatPrice } from "@/lib/utils";

type KpiCardsProps = {
  totals: {
    tickets: number;
    ticketsStripe: number;
    ticketsHorsStripe: number;
    ticketsCPT: number;
    exposants: number;
    total: number;
  };
};

const SOURCES = [
  { key: "total" as const, label: "Revenu total", color: "bg-dta-accent/10 text-dta-accent", ring: "ring-dta-accent" },
  { key: "tickets" as const, label: "Billetterie (total)", color: "bg-[#8B6F4E]/10 text-[#8B6F4E]", ring: "ring-[#8B6F4E]" },
  { key: "ticketsStripe" as const, label: "Billetterie Stripe", color: "bg-[#635BFF]/10 text-[#635BFF]", ring: "ring-[#635BFF]" },
  { key: "ticketsCPT" as const, label: "Culture pour Tous", color: "bg-[#16a34a]/10 text-[#16a34a]", ring: "ring-[#16a34a]" },
  { key: "ticketsHorsStripe" as const, label: "Billetterie hors Stripe", color: "bg-[#f59e0b]/10 text-[#f59e0b]", ring: "ring-[#f59e0b]" },
  { key: "exposants" as const, label: "Stands exposants", color: "bg-[#7c3aed]/10 text-[#7c3aed]", ring: "ring-[#7c3aed]" },
] as const;

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    if (prev === value) {
      setDisplayed(value);
      return;
    }

    const duration = 1200;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(prev + (value - prev) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <>{formatPrice(displayed)}</>;
}

export function KpiCards({ totals }: KpiCardsProps) {
  const [flash, setFlash] = useState<string | null>(null);
  const prevTotalsRef = useRef(totals);

  useEffect(() => {
    const prev = prevTotalsRef.current;
    prevTotalsRef.current = totals;

    // Detect which KPI changed
    for (const s of SOURCES) {
      if (totals[s.key] > prev[s.key]) {
        setFlash(s.key);
        setTimeout(() => setFlash(null), 2000);
        break;
      }
    }
  }, [totals]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {SOURCES.map((s) => (
        <div
          key={s.key}
          className={`rounded-[var(--radius-card)] p-4 transition-all duration-500 ${s.color} ${
            flash === s.key ? `ring-2 ${s.ring} scale-105 shadow-lg` : ""
          }`}
        >
          <p className="text-xs font-medium opacity-70">{s.label}</p>
          <p className="mt-1 font-serif text-xl font-bold">
            <AnimatedNumber value={totals[s.key]} />
          </p>
          {flash === s.key && (
            <p className="mt-1 text-xs font-semibold animate-pulse">
              Nouvelle vente !
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
