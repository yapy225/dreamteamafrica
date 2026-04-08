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
        className="mt-1 inline-flex items-center rounded-full bg-dta-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-dta-accent-dark"
      >
        Recharger mon billet
      </button>
    );
  }

  return (
    <div
      className="mt-2 rounded-lg bg-white/5 p-3"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="mb-2 text-[11px] font-medium text-white/60">Choisis un montant</p>
      <div className="flex flex-wrap gap-2">
        {amounts.map((amt) => (
          <button
            key={amt}
            disabled={loading}
            onClick={() => handleRecharge(amt)}
            className="rounded-full bg-dta-accent/20 px-3 py-1 text-xs font-semibold text-dta-accent hover:bg-dta-accent hover:text-white disabled:opacity-50"
          >
            {amt === remaining ? `${formatCurrency(amt)} (solde)` : formatCurrency(amt)}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
      {loading && <p className="mt-1 text-[10px] text-white/40">Redirection...</p>}
    </div>
  );
}
