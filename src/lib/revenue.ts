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

export type TodayStats = {
  tickets: { count: number; revenue: number };
  exposants: { count: number; revenue: number };
  total: number;
  hourly: Array<{ hour: string; total: number }>;
  lastSale: { time: string; amount: number; type: "billet" | "exposant" } | null;
};

export type RevenueSummary = {
  monthly: MonthlyRevenue[];
  totals: {
    tickets: number;
    exposants: number;
    total: number;
  };
  today: TodayStats;
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

  // Stats du jour
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayTickets = tickets.filter((t) => t.purchasedAt >= todayStart);
  const todayExhibitor = exhibitorPayments.filter((p) => p.paidAt >= todayStart);

  const todayTicketRev = todayTickets.reduce((s, t) => s + t.price, 0);
  const todayExposantRev = todayExhibitor.reduce((s, p) => s + p.amount, 0);

  // Progression heure par heure aujourd'hui
  const hourly: Array<{ hour: string; total: number }> = [];
  for (let h = 0; h <= now.getHours(); h++) {
    const hStart = new Date(todayStart);
    hStart.setHours(h);
    const hEnd = new Date(todayStart);
    hEnd.setHours(h + 1);

    const hTickets = todayTickets
      .filter((t) => t.purchasedAt >= hStart && t.purchasedAt < hEnd)
      .reduce((s, t) => s + t.price, 0);
    const hExpo = todayExhibitor
      .filter((p) => p.paidAt >= hStart && p.paidAt < hEnd)
      .reduce((s, p) => s + p.amount, 0);

    hourly.push({
      hour: `${h}h`,
      total: Math.round((hTickets + hExpo) * 100) / 100,
    });
  }

  // Dernière vente
  const allSales = [
    ...todayTickets.map((t) => ({ at: t.purchasedAt, amount: t.price, type: "billet" as const })),
    ...todayExhibitor.map((p) => ({ at: p.paidAt, amount: p.amount, type: "exposant" as const })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const lastSale = allSales[0] || null;

  const today = {
    tickets: { count: todayTickets.length, revenue: Math.round(todayTicketRev * 100) / 100 },
    exposants: { count: todayExhibitor.length, revenue: Math.round(todayExposantRev * 100) / 100 },
    total: Math.round((todayTicketRev + todayExposantRev) * 100) / 100,
    hourly,
    lastSale: lastSale
      ? { time: lastSale.at.toISOString(), amount: lastSale.amount, type: lastSale.type }
      : null,
  };

  return { monthly, totals, today };
}
