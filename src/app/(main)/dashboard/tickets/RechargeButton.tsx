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
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");

  const presets = [5, 10, 20, remaining].filter(
    (a, i, arr) => a > 0 && a <= remaining && arr.indexOf(a) === i
  );

  const handleRecharge = async (amount: number) => {
    if (amount < 1 || amount > remaining) {
      setError(`Montant entre 1€ et ${formatCurrency(remaining)}`);
      return;
    }
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount.replace(",", "."));
    if (!parsed || parsed < 1) {
      setError("Montant minimum : 1€");
      return;
    }
    handleRecharge(Math.min(parsed, remaining));
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
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:w-auto sm:min-w-[280px]"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="mb-3 text-xs font-medium text-slate-600">
        Choisis un montant <span className="text-slate-400">(reste {formatCurrency(remaining)})</span>
      </p>

      {/* Preset amounts */}
      <div className="flex flex-wrap gap-2">
        {presets.map((amt) => (
          <button
            key={amt}
            disabled={loading}
            onClick={() => handleRecharge(amt)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-dta-accent hover:bg-dta-accent hover:text-white disabled:opacity-50"
          >
            {amt === remaining ? `${formatCurrency(amt)} (solde)` : formatCurrency(amt)}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Autre montant"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value.replace(/[^0-9.,]/g, ""));
              setError("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 placeholder:text-slate-400 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
        </div>
        <button
          type="submit"
          disabled={loading || !customAmount}
          className="rounded-xl bg-dta-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading ? "..." : "Payer"}
        </button>
      </form>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => { setShowAmounts(false); setCustomAmount(""); setError(""); }}
          className="text-[10px] text-slate-400 hover:text-slate-600"
        >
          Annuler
        </button>
        <span className="text-[10px] text-slate-400">Min. 1€</span>
      </div>

      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      {loading && <p className="mt-1 text-[10px] text-slate-400">Redirection vers le paiement...</p>}
    </div>
  );
}
