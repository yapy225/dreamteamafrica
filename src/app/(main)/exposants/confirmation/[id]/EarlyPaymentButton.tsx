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
  const [nbToPay, setNbToPay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const amountToPay =
    nbToPay === remainingInstallments
      ? remainingBalance
      : nbToPay * monthlyAmount;

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/exposants/early-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, nbInstallments: nbToPay }),
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
        Vous pouvez payer une ou plusieurs mensualit&eacute;s en avance pour solder votre r&eacute;servation plus rapidement.
      </p>

      {/* Sélecteur de mensualités à anticiper */}
      <div>
        <label className="mb-2 block text-sm text-dta-char/70">
          Nombre de mensualit&eacute;s &agrave; anticiper
        </label>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: remainingInstallments }, (_, i) => {
            const n = i + 1;
            const isAll = n === remainingInstallments;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setNbToPay(n)}
                className={`rounded-lg border-2 px-3 py-2 text-center transition-all ${
                  nbToPay === n
                    ? "border-dta-accent bg-dta-accent text-white"
                    : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
                }`}
              >
                <span className="block text-sm font-bold">
                  {isAll ? "Tout" : `${n}x`}
                </span>
                <span
                  className={`block text-xs ${
                    nbToPay === n ? "text-white/80" : "text-dta-taupe"
                  }`}
                >
                  {formatter.format(
                    isAll ? remainingBalance : n * monthlyAmount
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Récap */}
      <div className="rounded-lg bg-dta-accent/5 px-4 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dta-char/70">
            {nbToPay === remainingInstallments
              ? "Solde int\u00e9gral restant"
              : `${nbToPay} mensualit\u00e9${nbToPay > 1 ? "s" : ""} anticip\u00e9e${nbToPay > 1 ? "s" : ""}`}
          </span>
          <span className="font-bold text-dta-accent">
            {formatter.format(amountToPay)}
          </span>
        </div>
        {nbToPay === remainingInstallments && (
          <p className="mt-1 text-xs text-green-600 font-medium">
            Votre r&eacute;servation sera enti&egrave;rement sold&eacute;e et confirm&eacute;e.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {nbToPay === remainingInstallments
          ? `Solder ma réservation — ${formatter.format(amountToPay)}`
          : `Payer ${formatter.format(amountToPay)} maintenant`}
      </button>
    </div>
  );
}
