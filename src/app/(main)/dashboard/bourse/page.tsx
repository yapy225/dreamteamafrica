import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LISTING_CONFIG } from "@/lib/transfer-config";
import BourseAdminTable from "./BourseAdminTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bourse officielle — Admin" };

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default async function BourseAdminPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // All marketplace entries (AT_COST mode = vente publique)
  const entries = await prisma.ticketTransfer.findMany({
    where: { mode: "AT_COST" },
    include: {
      ticket: {
        include: {
          event: { select: { title: true, slug: true, date: true } },
          payments: { where: { stripeId: { not: null } }, orderBy: { paidAt: "asc" }, take: 1 },
        },
      },
    },
    orderBy: [{ status: "asc" }, { listedAt: "desc" }, { createdAt: "desc" }],
    take: 500,
  });

  const now = new Date();
  const listed = entries.filter((e) => e.status === "LISTED");
  const sold = entries.filter((e) => e.status === "ACCEPTED");
  const cancelled = entries.filter((e) => e.status === "CANCELLED");

  const totalRevenue = sold.reduce((s, e) => s + (e.publicPrice ? Number(e.publicPrice) : 0), 0);
  const totalCommission = sold.reduce(
    (s, e) => s + (e.publicPrice ? Number(e.publicPrice) * LISTING_CONFIG.COMMISSION_RATE : 0),
    0,
  );
  const pendingValue = listed.reduce((s, e) => s + (e.publicPrice ? Number(e.publicPrice) : 0), 0);

  const rows = entries.map((e) => {
    const price = e.publicPrice ? Number(e.publicPrice) : Number(e.ticket.price);
    const paymentAge = e.ticket.payments[0]
      ? (now.getTime() - new Date(e.ticket.payments[0].paidAt).getTime()) / (24 * 3600 * 1000)
      : null;
    const needsManualRefund = paymentAge !== null && paymentAge > 150;
    return {
      id: e.id,
      status: e.status,
      price,
      sellerName: [e.fromFirstName, e.fromLastName].filter(Boolean).join(" ") || "",
      sellerEmail: e.fromEmail,
      buyerEmail: e.toEmail || "—",
      eventTitle: e.ticket.event.title,
      eventDate: e.ticket.event.date.toISOString(),
      eventSlug: e.ticket.event.slug,
      listedAt: e.listedAt ? e.listedAt.toISOString() : null,
      acceptedAt: e.acceptedAt ? e.acceptedAt.toISOString() : null,
      cancelledAt: e.cancelledAt ? e.cancelledAt.toISOString() : null,
      stripeRefundId: e.stripeRefundId,
      ticketId: e.ticketId,
      paymentAgeDays: paymentAge !== null ? Math.round(paymentAge) : null,
      needsManualRefund,
      tier: e.ticket.tier,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-dta-accent">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-dta-dark">Bourse officielle de billets DTA</h1>
        <p className="mt-1 text-sm text-dta-char/60">
          Toutes les mises en vente, reventes finalisées et annulations. Revenu cumulé = commission perçue.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-xs font-medium text-indigo-700">En vente</p>
          <p className="mt-1 font-serif text-2xl font-bold text-indigo-700">{listed.length}</p>
          <p className="mt-0.5 text-[11px] text-indigo-600">{fmt(pendingValue)} exposé</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-700">Vendus</p>
          <p className="mt-1 font-serif text-2xl font-bold text-blue-700">{sold.length}</p>
          <p className="mt-0.5 text-[11px] text-blue-600">{fmt(totalRevenue)} échangés</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-medium text-amber-700">Commission DTA</p>
          <p className="mt-1 font-serif text-2xl font-bold text-amber-700">{fmt(totalCommission)}</p>
          <p className="mt-0.5 text-[11px] text-amber-600">{Math.round(LISTING_CONFIG.COMMISSION_RATE * 100)}% × ventes</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600">Annulés / retirés</p>
          <p className="mt-1 font-serif text-2xl font-bold text-slate-700">{cancelled.length}</p>
        </div>
      </div>

      <BourseAdminTable rows={rows} />

      <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
        <span>Total entrées marketplace : {entries.length}</span>
        <Link href="/bourse" className="font-semibold text-dta-accent hover:underline">Voir la Bourse publique →</Link>
      </div>
    </div>
  );
}
