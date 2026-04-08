"use client";

import { useState } from "react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

export default function RechargeButton({
  ticketId,
  email,
  remaining,
}: {
  ticketId: string;
  email: string;
  remaining: number;
}) {
  const [loading, setLoading] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const [error, setError] = useState("");

  const amounts = [5, 10, 20, remaining].filter(
    (a, i, arr) => a > 0 && a <= remaining && arr.indexOf(a) === i
  );

  const handleRecharge = async (amount: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tickets/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, amount, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  if (!showAmounts) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowAmounts(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dta-accent bg-dta-accent/5 px-4 py-2 text-xs font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
      >
        + Recharger
      </button>
    );
  }

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="mb-2.5 text-xs font-medium text-slate-600">Choisis un montant</p>
      <div className="flex flex-wrap gap-2">
        {amounts.map((amt) => (
          <button
            key={amt}
            disabled={loading}
            onClick={() => handleRecharge(amt)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-dta-accent hover:bg-dta-accent hover:text-white disabled:opacity-50"
          >
            {amt === remaining ? `${formatCurrency(amt)} (solde)` : formatCurrency(amt)}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowAmounts(false)}
        className="mt-2 text-[10px] text-slate-400 hover:text-slate-600"
      >
        Annuler
      </button>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      {loading && <p className="mt-1 text-[10px] text-slate-400">Redirection vers le paiement...</p>}
    </div>
  );
}
