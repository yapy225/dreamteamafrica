"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import type { MonthlyRevenue } from "@/lib/revenue";

type RevenueChartProps = {
  data: MonthlyRevenue[];
  dataKey: keyof Omit<MonthlyRevenue, "month">;
  color: string;
  title: string;
};

export function RevenueChart({ data, dataKey, color, title }: RevenueChartProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h4 className="mb-4 text-sm font-semibold text-dta-dark">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => v.split(" ")[0]}
          />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}€`} />
          <Tooltip
            formatter={(value) => [formatPrice(Number(value ?? 0)), title]}
            labelStyle={{ fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
