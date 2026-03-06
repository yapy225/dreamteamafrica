import { prisma } from "@/lib/db";

const MONTH_LABELS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export type MonthlyRevenue = {
  month: string;
  tickets: number;
  orders: number;
  total: number;
};

export type RevenueSummary = {
  monthly: MonthlyRevenue[];
  totals: {
    tickets: number;
    orders: number;
    total: number;
  };
};

function buildMonthBuckets(months: number): { label: string; start: Date; end: Date }[] {
  const buckets: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
    buckets.push({ label, start, end });
  }

  return buckets;
}

export async function getRevenueData(months = 12): Promise<RevenueSummary> {
  const buckets = buildMonthBuckets(months);
  const since = buckets[0].start;

  const [tickets, orders] = await Promise.all([
    prisma.ticket.findMany({
      where: { purchasedAt: { gte: since } },
      select: { price: true, purchasedAt: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: since },
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
      select: { total: true, createdAt: true },
    }),
  ]);

  const monthly: MonthlyRevenue[] = buckets.map((bucket) => {
    const ticketRev = tickets
      .filter((t) => t.purchasedAt >= bucket.start && t.purchasedAt < bucket.end)
      .reduce((sum, t) => sum + t.price, 0);

    const orderRev = orders
      .filter((o) => o.createdAt >= bucket.start && o.createdAt < bucket.end)
      .reduce((sum, o) => sum + o.total, 0);

    return {
      month: bucket.label,
      tickets: Math.round(ticketRev * 100) / 100,
      orders: Math.round(orderRev * 100) / 100,
      total: Math.round((ticketRev + orderRev) * 100) / 100,
    };
  });

  const totals = monthly.reduce(
    (acc, m) => ({
      tickets: acc.tickets + m.tickets,
      orders: acc.orders + m.orders,
      total: acc.total + m.total,
    }),
    { tickets: 0, orders: 0, total: 0 },
  );

  return { monthly, totals };
}
