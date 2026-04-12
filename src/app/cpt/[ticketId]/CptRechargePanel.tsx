"use client";

import { useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default function CptRechargePanel({
  ticketId,
  token,
  remaining,
}: {
  ticketId: string;
  token: string;
  remaining: number;
}) {
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");

  const presets = Array.from(new Set([2, 5, 10, remaining]))
    .filter((a) => a > 0 && a <= remaining)
    .sort((a, b) => a - b);

  const submit = async (amount: number) => {
    if (amount < 1 || amount > remaining) {
      setError(`Montant entre 1€ et ${fmt(remaining)}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tickets/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, amount, token }),
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

  const submitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount.replace(",", "."));
    if (!parsed || parsed < 1) {
      setError("Montant minimum : 1€");
      return;
    }
    submit(Math.min(parsed, remaining));
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 p-5">
      <p className="mb-3 text-sm font-medium text-slate-700">Choisissez un montant</p>
      <div className="flex flex-wrap gap-2">
        {presets.map((amt) => (
          <button
            key={amt}
            disabled={loading}
            onClick={() => submit(amt)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
          >
            {amt === remaining ? `${fmt(amt)} (solde total)` : fmt(amt)}
          </button>
        ))}
      </div>

      <form onSubmit={submitCustom} className="mt-3 flex gap-2">
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
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
        </div>
        <button
          type="submit"
          disabled={loading || !customAmount}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "..." : "Payer"}
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-400">
        Frais de gestion 3% (offerts sous 5€) • Paiement sécurisé Stripe
      </p>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {loading && <p className="mt-2 text-xs text-slate-400">Redirection vers le paiement…</p>}
    </div>
  );
}
