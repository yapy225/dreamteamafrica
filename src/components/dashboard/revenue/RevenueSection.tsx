"use client";

import { useState, useEffect, useCallback } from "react";
import type { RevenueSummary } from "@/lib/revenue";
import { KpiCards } from "./KpiCards";
import { TotalRevenueChart } from "./TotalRevenueChart";
import { RevenueBreakdownCharts } from "./RevenueBreakdownCharts";

type RevenueSectionProps = {
  data: RevenueSummary;
};

export function RevenueSection({ data: initialData }: RevenueSectionProps) {
  const [data, setData] = useState(initialData);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/revenue");
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
        setLastUpdate(new Date());
      }
    } catch {
      // silently ignore
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <section className="mb-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-dta-dark">
          Revenus
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-dta-taupe">
            Mis &agrave; jour {lastUpdate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
      <KpiCards totals={data.totals} />
      <TotalRevenueChart data={data.monthly} />
      <RevenueBreakdownCharts data={data.monthly} />
    </section>
  );
}
