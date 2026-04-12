import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyTicketToken } from "@/lib/cpt-token";
import CptRechargePanel from "./CptRechargePanel";

export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default async function CptTicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<{ t?: string; success?: string }>;
}) {
  const { ticketId } = await params;
  const { t: token, success } = await searchParams;

  if (!token || !verifyTicketToken(ticketId, token)) {
    notFound();
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: { select: { title: true, date: true, venue: true, address: true, slug: true } },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
  if (!ticket) notFound();

  const price = Number(ticket.price);
  const paid = Number(ticket.totalPaid);
  const remaining = Math.max(0, Math.round((price - paid) * 100) / 100);
  const pct = Math.min(100, Math.round((paid / price) * 100));
  const isFullyPaid = remaining <= 0;
  const deadline = new Date(ticket.event.date);
  deadline.setDate(deadline.getDate() - 1);
  const deadlineStr = deadline.toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const waMsg = `Bonjour, concernant mon billet Culture pour Tous pour ${ticket.event.title} (ID ${ticketId.slice(0, 8)})`;
  const waLink = `https://wa.me/33782801852?text=${encodeURIComponent(waMsg)}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Paiement reçu ✓ Votre solde est mis à jour.
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-amber-600">
          Culture pour Tous
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{ticket.event.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {ticket.event.venue} — {new Date(ticket.event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Billet #{ticketId.slice(0, 8)} • {ticket.firstName} {ticket.lastName}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-600">Payé</span>
            <span className="font-semibold text-slate-900">{fmt(paid)} / {fmt(price)}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          {isFullyPaid ? (
            <div className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800">
              ✓ Billet entièrement soldé. Votre QR sera envoyé par email sous peu.
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-600">
              Solde restant : <strong>{fmt(remaining)}</strong> • deadline {deadlineStr}
            </div>
          )}
        </div>

        {!isFullyPaid && (
          <CptRechargePanel
            ticketId={ticketId}
            token={token}
            remaining={remaining}
          />
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>
            Vous pouvez payer à votre rythme jusqu'à la veille de l'événement.
            Si vous ne soldez pas, le complément sera à régler sur place.
          </p>
          <p className="mt-2">
            Une question ?{" "}
            <a href={waLink} className="font-medium text-emerald-600 hover:underline">
              Écrivez-nous sur WhatsApp
            </a>
          </p>
        </div>

        {ticket.payments.length > 0 && (
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer font-medium text-slate-700">
              Historique des paiements ({ticket.payments.length})
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {ticket.payments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{new Date(p.paidAt).toLocaleString("fr-FR")} — {p.label}</span>
                  <span className="font-medium">+{fmt(Number(p.amount))}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </main>
  );
}
