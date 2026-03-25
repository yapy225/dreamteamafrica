import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  TrendingUp,
  Ticket,
  Store,
  Heart,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Comptabilité | Dashboard" };

export default async function ComptabilitePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

  // ── Tickets revenue ──
  const tickets = await prisma.ticket.findMany({
    select: { price: true, tier: true, purchasedAt: true },
  });
  const ticketRevenue = tickets.reduce((s, t) => s + t.price, 0);
  const ticketCount = tickets.length;

  // ── Exhibitor revenue ──
  const bookings = await prisma.exhibitorBooking.findMany({
    include: { payments: { orderBy: { paidAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  const exhibitorPaid = bookings.reduce(
    (s, b) => s + b.payments.reduce((ps, p) => ps + p.amount, 0),
    0,
  );
  const exhibitorExpected = bookings
    .filter((b) => b.status !== "CANCELLED" && b.status !== "PENDING")
    .reduce((s, b) => s + b.totalPrice, 0);
  const exhibitorOutstanding = Math.max(0, exhibitorExpected - exhibitorPaid);

  // ── Monthly breakdown ──
  const monthlyMap = new Map<string, { billets: number; exposants: number }>();

  for (const t of tickets) {
    const key = new Date(t.purchasedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    const m = monthlyMap.get(key) || { billets: 0, exposants: 0 };
    m.billets += t.price;
    monthlyMap.set(key, m);
  }

  for (const b of bookings) {
    for (const p of b.payments) {
      const key = new Date(p.paidAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
      const m = monthlyMap.get(key) || { billets: 0, exposants: 0 };
      m.exposants += p.amount;
      monthlyMap.set(key, m);
    }
  }

  const monthlyData = [...monthlyMap.entries()]
    .sort((a, b) => {
      const da = new Date(a[0]);
      const db = new Date(b[0]);
      return da.getTime() - db.getTime();
    })
    .map(([month, data]) => ({ month, ...data, total: data.billets + data.exposants }));

  // ── Unpaid installments ──
  const unpaidBookings = bookings.filter(
    (b) => b.status === "PARTIAL" && b.totalPrice > b.payments.reduce((s, p) => s + p.amount, 0),
  );

  // ── Totals ──
  const totalRevenue = ticketRevenue + exhibitorPaid;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Comptabilit&eacute;
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            Vue d&apos;ensemble des revenus et paiements
          </p>
        </div>
        <a
          href="/api/admin/export-comptabilite"
          className="flex items-center gap-2 rounded-full border border-dta-accent/30 bg-dta-accent/5 px-4 py-2 text-sm font-medium text-dta-accent hover:bg-dta-accent/10 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-dta-sand bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-dta-char/60">Revenu total encaiss&eacute;</p>
              <p className="text-xl font-bold text-dta-dark">{fmt.format(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-dta-sand bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Ticket size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-dta-char/60">Billetterie ({ticketCount} billets)</p>
              <p className="text-xl font-bold text-dta-dark">{fmt.format(ticketRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-dta-sand bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Store size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-dta-char/60">Exposants encaiss&eacute;</p>
              <p className="text-xl font-bold text-dta-dark">{fmt.format(exhibitorPaid)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-dta-sand bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-dta-char/60">Soldes en attente</p>
              <p className="text-xl font-bold text-amber-600">{fmt.format(exhibitorOutstanding)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="rounded-2xl border border-dta-sand bg-white p-6 shadow-sm mb-8">
        <h2 className="font-serif text-lg font-bold text-dta-dark mb-4">
          Revenus par mois
        </h2>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-dta-char/50">Aucune donn&eacute;e disponible.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dta-sand text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-3 py-2">Mois</th>
                  <th className="px-3 py-2 text-right">Billetterie</th>
                  <th className="px-3 py-2 text-right">Exposants</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                {monthlyData.map((m) => (
                  <tr key={m.month}>
                    <td className="px-3 py-2.5 font-medium text-dta-dark capitalize">{m.month}</td>
                    <td className="px-3 py-2.5 text-right text-dta-char/70">{fmt.format(m.billets)}</td>
                    <td className="px-3 py-2.5 text-right text-dta-char/70">{fmt.format(m.exposants)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-dta-dark">{fmt.format(m.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-dta-bg">
                  <td className="px-3 py-2.5 font-bold text-dta-dark">Total</td>
                  <td className="px-3 py-2.5 text-right font-bold text-dta-dark">{fmt.format(ticketRevenue)}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-dta-dark">{fmt.format(exhibitorPaid)}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-dta-accent">{fmt.format(totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Unpaid installments */}
      <div className="rounded-2xl border border-dta-sand bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-dta-dark mb-4">
          Mensualit&eacute;s en attente ({unpaidBookings.length})
        </h2>
        {unpaidBookings.length === 0 ? (
          <p className="text-sm text-dta-char/50">Tous les paiements sont &agrave; jour.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dta-sand text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-3 py-2">Exposant</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-right">Pay&eacute;</th>
                  <th className="px-3 py-2 text-right">Restant</th>
                  <th className="px-3 py-2 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                {unpaidBookings.map((b) => {
                  const paid = b.payments.reduce((s, p) => s + p.amount, 0);
                  const remaining = b.totalPrice - paid;
                  return (
                    <tr key={b.id}>
                      <td className="px-3 py-2.5 font-medium text-dta-dark">{b.companyName}</td>
                      <td className="px-3 py-2.5 text-dta-char/70">{b.email}</td>
                      <td className="px-3 py-2.5 text-right text-dta-char/70">{fmt.format(b.totalPrice)}</td>
                      <td className="px-3 py-2.5 text-right text-green-600">{fmt.format(paid)}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-amber-600">{fmt.format(remaining)}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          <Clock size={10} />
                          {b.paidInstallments}/{b.installments}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
