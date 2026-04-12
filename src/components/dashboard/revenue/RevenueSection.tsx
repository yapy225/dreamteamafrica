"use client";

import { useState, useEffect, useCallback } from "react";
import type { RevenueSummary } from "@/lib/revenue";
import { KpiCards } from "./KpiCards";
import { TodayProgress } from "./TodayProgress";
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

      {/* NTBC Stats */}
      {data.ntbc && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-amber-800">NTBC — Cashless</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-amber-600">{data.ntbc.ntbcEnCirculation}</p>
              <p className="text-[10px] text-slate-500">NTBC en circulation</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-700">{data.ntbc.volumeTotal}</p>
              <p className="text-[10px] text-slate-500">Volume total NTBC</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-700">{data.ntbc.transactionsCount}</p>
              <p className="text-[10px] text-slate-500">Transactions</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-green-500">{data.ntbc.ntbcBonus}</p>
              <p className="text-[10px] text-slate-500">Bonus offerts</p>
            </div>
          </div>

          {/* Frais de gestion — détail */}
          <h3 className="mb-2 mt-4 text-sm font-semibold text-amber-800">Frais de gestion</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-green-600">{data.ntbc.commissionTotale} NTBC</p>
              <p className="text-[10px] text-slate-500">Commission 4%</p>
              <p className="text-[9px] text-slate-400">Paiements exposants</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-blue-600">{data.ntbc.fraisBilletterie} €</p>
              <p className="text-[10px] text-slate-500">Frais 3% billets</p>
              <p className="text-[9px] text-slate-400">Paiement unique</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-purple-600">{data.ntbc.fraisCulturePourTous} €</p>
              <p className="text-[10px] text-slate-500">Frais Culture pour Tous</p>
              <p className="text-[9px] text-slate-400">Acomptes + recharges</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-teal-600">{data.ntbc.fraisExposantsEchelonne} €</p>
              <p className="text-[10px] text-slate-500">Frais exposants</p>
              <p className="text-[9px] text-slate-400">Paiement echelonne</p>
            </div>
          </div>

          {/* Total frais */}
          <div className="mt-3 rounded-lg bg-[#0D2B1E] p-3 text-center">
            <p className="text-xs text-white/60">Total frais de gestion perçus</p>
            <p className="text-2xl font-bold text-[#C9A84C]">{data.ntbc.fraisTotal} €</p>
            <p className="text-[10px] text-white/40">+ {data.ntbc.commissionTotale} NTBC de commission</p>
          </div>

          {/* Parrainage */}
          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-lg bg-white p-2 text-center shadow-sm">
              <p className="text-sm font-bold text-pink-600">{data.ntbc.parrainages}</p>
              <p className="text-[10px] text-slate-500">Parrainages (coût 0 €)</p>
            </div>
          </div>
        </div>
      )}

      <TodayProgress today={data.today} />
      <TotalRevenueChart data={data.monthly} />
      <RevenueBreakdownCharts data={data.monthly} />
    </section>
  );
}
