"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  status: string;
  price: number;
  sellerName: string;
  sellerEmail: string;
  buyerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventSlug: string;
  listedAt: string | null;
  acceptedAt: string | null;
  cancelledAt: string | null;
  stripeRefundId: string | null;
  ticketId: string;
  paymentAgeDays: number | null;
  needsManualRefund: boolean;
  tier: string;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const shortDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });

const statusBadge: Record<string, string> = {
  LISTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ACCEPTED: "bg-blue-100 text-blue-800 border-blue-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
  EXPIRED: "bg-amber-100 text-amber-800 border-amber-200",
};

const statusLabel: Record<string, string> = {
  LISTED: "En vente",
  ACCEPTED: "Vendu",
  CANCELLED: "Retiré",
  EXPIRED: "Expiré",
};

export default function BourseAdminTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<"ALL" | "LISTED" | "ACCEPTED" | "CANCELLED">("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let out = rows;
    if (filter !== "ALL") out = out.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.sellerEmail.toLowerCase().includes(q) ||
          r.buyerEmail.toLowerCase().includes(q) ||
          r.eventTitle.toLowerCase().includes(q) ||
          r.sellerName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return out;
  }, [rows, filter, search]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["ALL", "LISTED", "ACCEPTED", "CANCELLED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === f
                ? "border-dta-accent bg-dta-accent text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-dta-accent hover:text-dta-accent"
            }`}
          >
            {f === "ALL" ? "Tous" : statusLabel[f]}
          </button>
        ))}
        <input
          type="text"
          placeholder="Rechercher (email, event, id)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent sm:w-64"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Statut</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Event</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Tier</th>
                <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-600">Prix</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Vendeur</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Acheteur</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Mis en vente</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Âge paiement</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusBadge[r.status] || "bg-slate-100 text-slate-600"}`}>
                      {statusLabel[r.status] || r.status}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2 text-slate-900">
                    <a href={`/saison-culturelle-africaine/${r.eventSlug}`} target="_blank" rel="noreferrer" className="hover:text-dta-accent">
                      {r.eventTitle}
                    </a>
                    <div className="text-[10px] text-slate-400">{shortDate(r.eventDate)}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-dta-accent">{r.tier}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-bold text-slate-900">{fmt(r.price)}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-900">{r.sellerName || "—"}</div>
                    <div className="text-[10px] text-slate-500">{r.sellerEmail}</div>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    <div className="text-[10px]">{r.buyerEmail}</div>
                    {r.acceptedAt && <div className="text-[10px] text-slate-400">{shortDate(r.acceptedAt)}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                    {r.listedAt ? shortDate(r.listedAt) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.paymentAgeDays !== null ? (
                      <span className={r.needsManualRefund ? "font-semibold text-red-600" : "text-slate-500"}>
                        {r.paymentAgeDays}j
                        {r.needsManualRefund && " ⚠"}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.stripeRefundId ? (
                      <a href={`https://dashboard.stripe.com/refunds/${r.stripeRefundId}`} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-indigo-700 hover:underline">
                        {r.stripeRefundId.slice(0, 12)}...
                      </a>
                    ) : r.status === "ACCEPTED" ? (
                      <span className="text-[10px] font-semibold text-red-600">Échec refund</span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-slate-400">Aucun résultat</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        ⚠ Âge paiement &gt; 150j : le refund Stripe automatique est désactivé. À traiter manuellement si besoin (virement bancaire + refund via Stripe dashboard).
      </p>
    </div>
  );
}
