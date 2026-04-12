import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CptAdminTable from "./CptAdminTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Culture pour Tous — Admin" };

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default async function CptAdminPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const tickets = await prisma.ticket.findMany({
    where: {
      payments: { some: { type: { in: ["cpt_deposit", "recharge"] } } },
    },
    include: {
      event: { select: { title: true, date: true, slug: true } },
      payments: { orderBy: { paidAt: "desc" } },
    },
    orderBy: { purchasedAt: "desc" },
  });

  const cptTickets = tickets.filter((t) =>
    t.payments.some((p) => p.type === "cpt_deposit"),
  );

  const now = new Date();
  const totalCount = cptTickets.length;
  const soldeCount = cptTickets.filter((t) => Number(t.totalPaid) >= Number(t.price)).length;
  const unpaidCount = totalCount - soldeCount;
  const lateCount = cptTickets.filter(
    (t) =>
      Number(t.totalPaid) < Number(t.price) &&
      new Date(t.event.date) < now,
  ).length;
  const totalEncaisse = cptTickets.reduce((s, t) => s + Number(t.totalPaid), 0);
  const totalAttendu = cptTickets.reduce((s, t) => s + Number(t.price), 0);
  const totalManquant = Math.max(0, totalAttendu - totalEncaisse);
  const completion = totalAttendu > 0 ? Math.round((totalEncaisse / totalAttendu) * 100) : 0;

  // Recent payments timeline (all CPT-related payments)
  const cptTicketIds = new Set(cptTickets.map((t) => t.id));
  const recentPayments = await prisma.ticketPayment.findMany({
    where: { ticketId: { in: Array.from(cptTicketIds) } },
    orderBy: { paidAt: "desc" },
    take: 20,
    include: {
      ticket: {
        select: {
          id: true, firstName: true, lastName: true, email: true,
          event: { select: { title: true } },
          price: true, totalPaid: true,
        },
      },
    },
  });

  const rows = cptTickets.map((t) => ({
    id: t.id,
    firstName: t.firstName || "",
    lastName: t.lastName || "",
    email: t.email || "",
    phone: t.phone || "",
    eventTitle: t.event.title,
    eventDate: t.event.date.toISOString(),
    price: Number(t.price),
    totalPaid: Number(t.totalPaid),
    remaining: Math.max(0, Number(t.price) - Number(t.totalPaid)),
    lastPaymentAt: t.payments[0]?.paidAt?.toISOString() || null,
    paymentsCount: t.payments.length,
    purchasedAt: t.purchasedAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Culture pour Tous — Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tickets avec acompte 5€ en attente de solde
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total billets" value={totalCount} />
        <Stat label="Soldés" value={soldeCount} accent="emerald" />
        <Stat label="En attente" value={unpaidCount} accent="amber" />
        <Stat label="En retard" value={lateCount} accent="red" />
        <Stat label="Complétion" value={`${completion}%`} />
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Encaissé</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600">{fmt(totalEncaisse)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Attendu</div>
            <div className="mt-1 text-2xl font-bold text-slate-700">{fmt(totalAttendu)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Manquant</div>
            <div className="mt-1 text-2xl font-bold text-amber-600">{fmt(totalManquant)}</div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Derniers versements CPT</h2>
        {recentPayments.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun versement pour l'instant.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentPayments.map((p) => {
              const typeLabel =
                p.type === "cpt_deposit" ? "Acompte" :
                p.type === "recharge" ? "Recharge" :
                p.type === "cash" ? "Cash" : p.type;
              const typeBadge =
                p.type === "cpt_deposit" ? "bg-amber-100 text-amber-700" :
                p.type === "cash" ? "bg-blue-100 text-blue-700" :
                "bg-emerald-100 text-emerald-700";
              const fullyPaid = Number(p.ticket.totalPaid) >= Number(p.ticket.price);
              return (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeBadge}`}>{typeLabel}</span>
                      <span className="font-medium text-slate-900 truncate">{p.ticket.firstName} {p.ticket.lastName}</span>
                      {fullyPaid && <span className="text-xs text-emerald-600">✓ Soldé</span>}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 truncate">
                      {p.ticket.event.title} • {p.ticket.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">+{fmt(Number(p.amount))}</div>
                    <div className="text-xs text-slate-400">{new Date(p.paidAt).toLocaleString("fr-FR")}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <CptAdminTable rows={rows} />
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: "emerald" | "amber" | "red" }) {
  const color =
    accent === "emerald" ? "text-emerald-600" :
    accent === "amber" ? "text-amber-600" :
    accent === "red" ? "text-red-600" :
    "text-slate-800";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
