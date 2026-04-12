"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventTitle: string;
  eventDate: string;
  price: number;
  totalPaid: number;
  remaining: number;
  lastPaymentAt: string | null;
  paymentsCount: number;
  purchasedAt: string;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default function CptAdminTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "unpaid" | "paid" | "late">("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const events = useMemo(
    () => Array.from(new Set(rows.map((r) => r.eventTitle))).sort(),
    [rows],
  );

  const filtered = rows.filter((r) => {
    if (eventFilter !== "all" && r.eventTitle !== eventFilter) return false;
    const isPaid = r.totalPaid >= r.price;
    const isLate = !isPaid && new Date(r.eventDate) < new Date();
    if (status === "paid" && !isPaid) return false;
    if (status === "unpaid" && isPaid) return false;
    if (status === "late" && !isLate) return false;
    if (q) {
      const needle = q.toLowerCase();
      return (
        r.firstName.toLowerCase().includes(needle) ||
        r.lastName.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle) ||
        r.id.toLowerCase().includes(needle)
      );
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ["id", "prénom", "nom", "email", "téléphone", "événement", "date", "prix", "payé", "reste", "paiements", "dernier_paiement", "achat"];
    const lines = filtered.map((r) => [
      r.id, r.firstName, r.lastName, r.email, r.phone, r.eventTitle, r.eventDate,
      r.price, r.totalPaid, r.remaining, r.paymentsCount,
      r.lastPaymentAt || "", r.purchasedAt,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cpt-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendRelance = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/cpt/relance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id }),
      });
      const data = await res.json();
      alert(data.ok ? "Email envoyé ✓" : data.error || "Erreur");
    } catch {
      alert("Erreur réseau");
    }
    setBusyId(null);
  };

  const markCash = async (id: string) => {
    const amount = prompt("Montant encaissé en cash (€) :");
    if (!amount) return;
    const parsed = parseFloat(amount.replace(",", "."));
    if (!parsed || parsed <= 0) return alert("Montant invalide");
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/cpt/mark-cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, amount: parsed }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Paiement cash enregistré ✓ Rechargez la page.");
        window.location.reload();
      } else {
        alert(data.error || "Erreur");
      }
    } catch {
      alert("Erreur réseau");
    }
    setBusyId(null);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          placeholder="Rechercher nom, email, ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | "unpaid" | "paid" | "late")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">Tous</option>
          <option value="unpaid">Non soldés</option>
          <option value="paid">Soldés</option>
          <option value="late">En retard</option>
        </select>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">Tous événements</option>
          {events.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <button
          onClick={exportCsv}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Export CSV ({filtered.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Événement</th>
              <th className="px-4 py-3">Progrès</th>
              <th className="px-4 py-3">Reste</th>
              <th className="px-4 py-3">Dernier paiement</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const pct = Math.min(100, Math.round((r.totalPaid / r.price) * 100));
              const isPaid = r.remaining <= 0;
              const isLate = !isPaid && new Date(r.eventDate) < new Date();
              return (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{r.firstName} {r.lastName}</div>
                    <div className="text-xs text-slate-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div>{r.eventTitle}</div>
                    <div className="text-xs text-slate-500">{new Date(r.eventDate).toLocaleDateString("fr-FR")}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="mb-1 text-xs text-slate-600">{fmt(r.totalPaid)} / {fmt(r.price)} ({r.paymentsCount}x)</div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full ${isLate ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {isPaid ? (
                      <span className="text-emerald-600">Soldé ✓</span>
                    ) : (
                      <span className={isLate ? "text-red-600" : "text-amber-600"}>{fmt(r.remaining)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {r.lastPaymentAt ? new Date(r.lastPaymentAt).toLocaleString("fr-FR") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!isPaid && (
                        <>
                          <button
                            onClick={() => sendRelance(r.id)}
                            disabled={busyId === r.id}
                            className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            Relancer
                          </button>
                          <button
                            onClick={() => markCash(r.id)}
                            disabled={busyId === r.id}
                            className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                          >
                            + Cash
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">Aucun billet CPT.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
