"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import type { MonthlyRevenue } from "@/lib/revenue";

const SOURCES = [
  { key: "tickets", label: "Billetterie", color: "#8B6F4E" },
  { key: "orders", label: "Commandes", color: "#6B8FA0" },
  { key: "ads", label: "DTA Ads", color: "#A08060" },
  { key: "journal", label: "Pubs Journal", color: "#7A8B7A" },
] as const;

type TotalRevenueChartProps = {
  data: MonthlyRevenue[];
};

export function TotalRevenueChart({ data }: TotalRevenueChartProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h4 className="mb-4 text-sm font-semibold text-dta-dark">
        Revenus totaux par mois
      </h4>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => v.split(" ")[0]}
          />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}€`} />
          <Tooltip
            formatter={(value, name) => [formatPrice(Number(value ?? 0)), name]}
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend />
          {SOURCES.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="revenue"
              fill={s.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
