"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface EarlyPaymentButtonProps {
  bookingId: string;
  remainingInstallments: number;
  monthlyAmount: number;
  remainingBalance: number;
}

export default function EarlyPaymentButton({
  bookingId,
  remainingInstallments,
  monthlyAmount,
  remainingBalance,
}: EarlyPaymentButtonProps) {
  const [customAmount, setCustomAmount] = useState(
    Math.min(monthlyAmount, remainingBalance).toString(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const amount = Math.min(
    Math.max(parseFloat(customAmount) || 0, 1),
    remainingBalance,
  );
  const isFullPayment = amount >= remainingBalance;

  // Calculate how many installments this covers
  const nbInstallments =
    isFullPayment
      ? remainingInstallments
      : Math.max(1, Math.round(amount / monthlyAmount));

  const handlePay = async () => {
    if (amount < 1) {
      setError("Montant minimum : 1 €");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/exposants/early-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, nbInstallments, customAmount: amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-dta-dark">
        <Zap size={16} className="text-dta-accent" />
        Anticiper mes paiements
      </div>

      <p className="text-xs text-dta-char/60">
        Choisissez le montant que vous souhaitez r&eacute;gler. Vous pouvez
        payer tout ou partie du solde restant.
      </p>

      {/* Quick amount buttons */}
      <div className="flex flex-wrap gap-2">
        {monthlyAmount < remainingBalance && (
          <button
            type="button"
            onClick={() => setCustomAmount(monthlyAmount.toString())}
            className={`rounded-lg border-2 px-3 py-2 text-center transition-all text-sm ${
              amount === monthlyAmount
                ? "border-dta-accent bg-dta-accent text-white"
                : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
            }`}
          >
            1 mensualit&eacute; — {formatter.format(monthlyAmount)}
          </button>
        )}
        <button
          type="button"
          onClick={() => setCustomAmount(remainingBalance.toString())}
          className={`rounded-lg border-2 px-3 py-2 text-center transition-all text-sm ${
            isFullPayment
              ? "border-dta-accent bg-dta-accent text-white"
              : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
          }`}
        >
          Tout solder — {formatter.format(remainingBalance)}
        </button>
      </div>

      {/* Custom amount input */}
      <div>
        <label className="mb-1.5 block text-sm text-dta-char/70">
          Ou saisissez un montant libre
        </label>
        <div className="relative">
          <input
            type="number"
            min={1}
            max={remainingBalance}
            step="0.01"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dta-taupe">
            &euro;
          </span>
        </div>
        <p className="mt-1 text-xs text-dta-taupe">
          Maximum : {formatter.format(remainingBalance)}
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-dta-accent/5 px-4 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dta-char/70">
            {isFullPayment ? "Solde int\u00e9gral restant" : "Montant \u00e0 r\u00e9gler"}
          </span>
          <span className="font-bold text-dta-accent">
            {formatter.format(amount)}
          </span>
        </div>
        {isFullPayment && (
          <p className="mt-1 text-xs text-green-600 font-medium">
            Votre r&eacute;servation sera enti&egrave;rement sold&eacute;e et
            confirm&eacute;e.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handlePay}
        disabled={loading || amount < 1}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {isFullPayment
          ? `Solder ma réservation — ${formatter.format(amount)}`
          : `Payer ${formatter.format(amount)} maintenant`}
      </button>
    </div>
  );
}
