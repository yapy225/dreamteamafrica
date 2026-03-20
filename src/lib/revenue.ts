import { prisma } from "@/lib/db";

const MONTH_LABELS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

export type MonthlyRevenue = {
  month: string;
  tickets: number;
  exposants: number;
  total: number;
};

export type RevenueSummary = {
  monthly: MonthlyRevenue[];
  totals: {
    tickets: number;
    exposants: number;
    total: number;
  };
};

export async function getRevenueData(): Promise<RevenueSummary> {
  // Démarrer à janvier 2026
  const startDate = new Date(2026, 0, 1); // 1er janvier 2026
  const now = new Date();

  // Construire les buckets mois par mois depuis janvier 2026
  const buckets: { label: string; start: Date; end: Date }[] = [];
  const d = new Date(startDate);
  while (d <= now) {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
    buckets.push({ label, start, end });
    d.setMonth(d.getMonth() + 1);
  }

  const [tickets, exhibitorPayments] = await Promise.all([
    // Revenus billetterie
    prisma.ticket.findMany({
      where: { purchasedAt: { gte: startDate } },
      select: { price: true, purchasedAt: true },
    }),
    // Revenus exposants (paiements enregistrés)
    prisma.exhibitorPayment.findMany({
      where: { paidAt: { gte: startDate } },
      select: { amount: true, paidAt: true },
    }),
  ]);

  const monthly: MonthlyRevenue[] = buckets.map((bucket) => {
    const ticketRev = tickets
      .filter((t) => t.purchasedAt >= bucket.start && t.purchasedAt < bucket.end)
      .reduce((sum, t) => sum + t.price, 0);

    const exposantRev = exhibitorPayments
      .filter((p) => p.paidAt >= bucket.start && p.paidAt < bucket.end)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month: bucket.label,
      tickets: Math.round(ticketRev * 100) / 100,
      exposants: Math.round(exposantRev * 100) / 100,
      total: Math.round((ticketRev + exposantRev) * 100) / 100,
    };
  });

  const totals = monthly.reduce(
    (acc, m) => ({
      tickets: acc.tickets + m.tickets,
      exposants: acc.exposants + m.exposants,
      total: acc.total + m.total,
    }),
    { tickets: 0, exposants: 0, total: 0 },
  );

  return { monthly, totals };
}
