import { prisma } from "@/lib/db";

const MONTH_LABELS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

export type MonthlyRevenue = {
  month: string;
  tickets: number;
  ticketsStripe: number;
  ticketsHorsStripe: number;
  ticketsCPT: number;
  exposants: number;
  total: number;
};

export type TodayStats = {
  tickets: { count: number; revenue: number; stripe: number; horsStripe: number; cpt: number; cptCount: number };
  exposants: { count: number; revenue: number };
  total: number;
  hourly: Array<{ hour: string; total: number }>;
  lastSale: { time: string; amount: number; type: "billet" | "exposant" } | null;
};

export type NtbcStats = {
  ntbcEnCirculation: number;
  ntbcBonus: number;
  commissionTotale: number;
  fraisBilletterie: number;
  fraisCulturePourTous: number;
  fraisExposantsEchelonne: number;
  fraisTotal: number;
  transactionsCount: number;
  volumeTotal: number;
  parrainages: number;
};

export type RevenueSummary = {
  monthly: MonthlyRevenue[];
  totals: {
    tickets: number;
    ticketsStripe: number;
    ticketsHorsStripe: number;
    ticketsCPT: number;
    exposants: number;
    total: number;
  };
  today: TodayStats;
  ntbc: NtbcStats;
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

  const [tickets, exhibitorPayments, leadDeposits] = await Promise.all([
    // Revenus billetterie
    prisma.ticket.findMany({
      where: { purchasedAt: { gte: startDate } },
      select: { price: true, purchasedAt: true, stripeSessionId: true, installments: true, totalPaid: true },
    }),
    // Revenus exposants (paiements enregistrés)
    prisma.exhibitorPayment.findMany({
      where: { paidAt: { gte: startDate } },
      select: { amount: true, paidAt: true },
    }),
    // Acomptes leads exposants (50 € non rattachés à un booking)
    prisma.exposantLead.findMany({
      where: {
        status: "DEPOSIT_PAID",
        depositPaidAt: { gte: startDate },
        bookingId: null, // pas encore converti en booking
      },
      select: { depositPaidAt: true },
    }),
  ]);

  // Fusionner les paiements exposants + acomptes leads
  const LEAD_DEPOSIT = 50;
  const allExposantPayments = [
    ...exhibitorPayments,
    ...leadDeposits.map((l) => ({ amount: LEAD_DEPOSIT, paidAt: l.depositPaidAt! })),
  ];

  // Helper: un billet est "Stripe" s'il a un stripeSessionId qui commence par "cs_"
  const isStripeTicket = (t: { stripeSessionId: string | null }) =>
    t.stripeSessionId != null && t.stripeSessionId.startsWith("cs_");

  // Helper: un billet est "Culture pour Tous" s'il a installments > 1
  const isCPT = (t: { installments: number }) => t.installments > 1;

  const monthly: MonthlyRevenue[] = buckets.map((bucket) => {
    const bucketTickets = tickets.filter(
      (t) => t.purchasedAt >= bucket.start && t.purchasedAt < bucket.end,
    );
    const ticketRev = bucketTickets.reduce((sum, t) => sum + t.price, 0);
    const ticketStripe = bucketTickets
      .filter(isStripeTicket)
      .reduce((sum, t) => sum + t.price, 0);
    const ticketHorsStripe = ticketRev - ticketStripe;
    const ticketCPT = bucketTickets
      .filter(isCPT)
      .reduce((sum, t) => sum + t.totalPaid, 0);

    const exposantRev = allExposantPayments
      .filter((p) => p.paidAt >= bucket.start && p.paidAt < bucket.end)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month: bucket.label,
      tickets: Math.round(ticketRev * 100) / 100,
      ticketsStripe: Math.round(ticketStripe * 100) / 100,
      ticketsHorsStripe: Math.round(ticketHorsStripe * 100) / 100,
      ticketsCPT: Math.round(ticketCPT * 100) / 100,
      exposants: Math.round(exposantRev * 100) / 100,
      total: Math.round((ticketRev + exposantRev) * 100) / 100,
    };
  });

  const totals = monthly.reduce(
    (acc, m) => ({
      tickets: acc.tickets + m.tickets,
      ticketsStripe: acc.ticketsStripe + m.ticketsStripe,
      ticketsHorsStripe: acc.ticketsHorsStripe + m.ticketsHorsStripe,
      ticketsCPT: acc.ticketsCPT + m.ticketsCPT,
      exposants: acc.exposants + m.exposants,
      total: acc.total + m.total,
    }),
    { tickets: 0, ticketsStripe: 0, ticketsHorsStripe: 0, ticketsCPT: 0, exposants: 0, total: 0 },
  );

  // Stats du jour
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayTickets = tickets.filter((t) => t.purchasedAt >= todayStart);
  const todayExhibitor = allExposantPayments.filter((p) => p.paidAt >= todayStart);

  const todayTicketRev = todayTickets.reduce((s, t) => s + t.price, 0);
  const todayTicketStripe = todayTickets.filter(isStripeTicket).reduce((s, t) => s + t.price, 0);
  const todayTicketHorsStripe = todayTicketRev - todayTicketStripe;
  const todayCPT = todayTickets.filter(isCPT);
  const todayCPTRev = todayCPT.reduce((s, t) => s + t.totalPaid, 0);
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
    tickets: {
      count: todayTickets.length,
      revenue: Math.round(todayTicketRev * 100) / 100,
      stripe: Math.round(todayTicketStripe * 100) / 100,
      horsStripe: Math.round(todayTicketHorsStripe * 100) / 100,
      cpt: Math.round(todayCPTRev * 100) / 100,
      cptCount: todayCPT.length,
    },
    exposants: { count: todayExhibitor.length, revenue: Math.round(todayExposantRev * 100) / 100 },
    total: Math.round((todayTicketRev + todayExposantRev) * 100) / 100,
    hourly,
    lastSale: lastSale
      ? { time: lastSale.at.toISOString(), amount: lastSale.amount, type: lastSale.type }
      : null,
  };

  // ── Stats NTBC ──
  const [ntbcCirculation, ntbcTransactions, ntbcParrainages, allTicketPayments, exhibitorPaymentsAll] = await Promise.all([
    prisma.user.aggregate({
      _sum: { soldeNtbc: true, soldeBonus: true },
    }),
    prisma.ntbcTransaction.aggregate({
      _sum: { montantNtbc: true, commissionNtbc: true },
      _count: true,
    }),
    prisma.ntbcParrainage.count(),
    // Tous les paiements billets pour calculer les frais
    prisma.ticketPayment.findMany({
      select: { amount: true, type: true, ticket: { select: { installments: true } } },
    }),
    // Tous les paiements exposants échelonnés
    prisma.exhibitorPayment.findMany({
      select: { amount: true },
    }),
  ]);

  // Frais billetterie classique (paiement unique, 3% min 0.50€)
  const billetsUniques = allTicketPayments.filter(p => p.type === "full_payment" || (p.type === "deposit" && p.ticket.installments === 1));
  const montantBilletsUniques = billetsUniques.reduce((s, p) => s + Number(p.amount), 0);
  const fraisBilletterie = Math.round(Math.max(montantBilletsUniques * 0.03, billetsUniques.length * 0.50) * 100) / 100;

  // Frais Culture pour Tous (acomptes + recharges, 3% min 0.50€ par paiement)
  const billetsCPT = allTicketPayments.filter(p => p.ticket.installments > 1);
  const fraisCPT = billetsCPT.reduce((s, p) => {
    const fee = Math.max(Number(p.amount) * 0.03, 0.50);
    return s + fee;
  }, 0);

  // Frais exposants échelonnés (3% par paiement)
  const fraisExposants = exhibitorPaymentsAll.reduce((s, p) => {
    return s + Number(p.amount) * 0.03;
  }, 0);

  const fraisTotal = Math.round((fraisBilletterie + fraisCPT + fraisExposants) * 100) / 100;

  const ntbc: NtbcStats = {
    ntbcEnCirculation: (ntbcCirculation._sum.soldeNtbc || 0) + (ntbcCirculation._sum.soldeBonus || 0),
    ntbcBonus: ntbcCirculation._sum.soldeBonus || 0,
    commissionTotale: ntbcTransactions._sum.commissionNtbc || 0,
    fraisBilletterie: Math.round(fraisBilletterie * 100) / 100,
    fraisCulturePourTous: Math.round(fraisCPT * 100) / 100,
    fraisExposantsEchelonne: Math.round(fraisExposants * 100) / 100,
    fraisTotal,
    transactionsCount: ntbcTransactions._count,
    volumeTotal: ntbcTransactions._sum.montantNtbc || 0,
    parrainages: ntbcParrainages,
  };

  return { monthly, totals, today, ntbc };
}
