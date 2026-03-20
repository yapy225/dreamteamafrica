"use client";

import { RevenueChart } from "./RevenueChart";
import type { MonthlyRevenue } from "@/lib/revenue";

const SOURCES = [
  { key: "tickets" as const, title: "Billetterie événements", color: "#8B6F4E" },
  { key: "exposants" as const, title: "Stands exposants", color: "#7c3aed" },
] as const;

type RevenueBreakdownChartsProps = {
  data: MonthlyRevenue[];
};

export function RevenueBreakdownCharts({ data }: RevenueBreakdownChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {SOURCES.map((s) => (
        <RevenueChart
          key={s.key}
          data={data}
          dataKey={s.key}
          color={s.color}
          title={s.title}
        />
      ))}
    </div>
  );
}
