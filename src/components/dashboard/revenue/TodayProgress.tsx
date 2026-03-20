"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { formatPrice } from "@/lib/utils";
import type { TodayStats } from "@/lib/revenue";
import { Ticket, Store, TrendingUp, Clock } from "lucide-react";

type TodayProgressProps = {
  today: TodayStats;
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `il y a ${hours}h${minutes % 60 > 0 ? String(minutes % 60).padStart(2, "0") : ""}`;
}

export function TodayProgress({ today }: TodayProgressProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-dta-dark">
          <TrendingUp size={16} className="text-green-500" />
          Aujourd&apos;hui
        </h4>
        {today.lastSale && (
          <span className="flex items-center gap-1 text-xs text-dta-taupe">
            <Clock size={12} />
            Derni&egrave;re vente : {timeAgo(today.lastSale.time)}
          </span>
        )}
      </div>

      {/* Stats du jour */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-2xl font-bold text-green-700">
            {formatPrice(today.total)}
          </p>
          <p className="text-[10px] text-green-600 font-medium mt-1">
            Revenu du jour
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Ticket size={14} className="text-amber-600" />
            <span className="text-2xl font-bold text-amber-700">
              {today.tickets.count}
            </span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">
            Billets ({formatPrice(today.tickets.revenue)})
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Store size={14} className="text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">
              {today.exposants.count}
            </span>
          </div>
          <p className="text-[10px] text-purple-600 font-medium mt-1">
            Exposants ({formatPrice(today.exposants.revenue)})
          </p>
        </div>
      </div>

      {/* Dernière vente */}
      {today.lastSale && (
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 mb-4 animate-pulse">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-800">
            {today.lastSale.type === "billet" ? "🎟️ Billet" : "🏪 Exposant"}{" "}
            &mdash; {formatPrice(today.lastSale.amount)} &mdash;{" "}
            {timeAgo(today.lastSale.time)}
          </span>
        </div>
      )}

      {today.total === 0 && !today.lastSale && (
        <div className="rounded-lg bg-gray-50 px-3 py-4 text-center mb-4">
          <p className="text-sm text-dta-taupe">Aucune vente aujourd&apos;hui</p>
        </div>
      )}

      {/* Graphique horaire */}
      {today.hourly.some((h) => h.total > 0) && (
        <>
          <p className="text-xs text-dta-taupe mb-2">
            Ventes par heure
          </p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={today.hourly}>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [formatPrice(Number(value ?? 0)), "Ventes"]}
                labelStyle={{ fontWeight: 600, fontSize: 12 }}
              />
              <Bar
                dataKey="total"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
