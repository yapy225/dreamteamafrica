"use client";

import type { RevenueSummary } from "@/lib/revenue";
import { KpiCards } from "./KpiCards";
import { TotalRevenueChart } from "./TotalRevenueChart";
import { RevenueBreakdownCharts } from "./RevenueBreakdownCharts";

type RevenueSectionProps = {
  data: RevenueSummary;
};

export function RevenueSection({ data }: RevenueSectionProps) {
  return (
    <section className="mb-10 space-y-6">
      <h2 className="font-serif text-xl font-bold text-dta-dark">
        Revenus
      </h2>
      <KpiCards totals={data.totals} />
      <TotalRevenueChart data={data.monthly} />
      <RevenueBreakdownCharts data={data.monthly} />
    </section>
  );
}
