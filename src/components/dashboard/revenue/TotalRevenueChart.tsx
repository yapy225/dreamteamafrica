"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  { key: "exposants", label: "Stands exposants", color: "#7c3aed" },
  { key: "total", label: "Total", color: "#16a34a" },
] as const;

type TotalRevenueChartProps = {
  data: MonthlyRevenue[];
};

export function TotalRevenueChart({ data }: TotalRevenueChartProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h4 className="mb-4 text-sm font-semibold text-dta-dark">
        Revenus par mois (depuis janvier 2026)
      </h4>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
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
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={s.key === "total" ? 3 : 2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 8, strokeWidth: 0, fill: s.color }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
