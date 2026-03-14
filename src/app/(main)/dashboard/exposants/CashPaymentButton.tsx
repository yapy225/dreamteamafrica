"use client";

import { useState } from "react";
import { Loader2, Banknote, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CashPaymentButton({
  bookingId,
  paidInstallments,
  totalInstallments,
  totalPrice,
  installmentAmount,
  deposit,
  status,
}: {
  bookingId: string;
  paidInstallments: number;
  totalInstallments: number;
  totalPrice: number;
  installmentAmount: number;
  deposit: number;
  status: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"avance" | "echeance">("avance");
  const [avanceAmount, setAvanceAmount] = useState(deposit.toFixed(2));
  const [nbToMark, setNbToMark] = useState(1);
  const router = useRouter();

  if (status === "CONFIRMED" || status === "CANCELLED") return null;

  const remainingSlots = totalInstallments - paidInstallments;
  const isDepositPaid = paidInstallments > 0;

  // Calculate expected amount for N installment slots (after deposit)
  const installmentTotal = (n: number) => Math.round(n * installmentAmount * 100) / 100;

  const handleSubmit = async () => {
    let newPaid: number;
    let amount: number;

    if (mode === "avance") {
      amount = parseFloat(avanceAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Montant invalide.");
        return;
      }
      // Avance = marque le 1er slot comme payé
      newPaid = Math.max(paidInstallments, 1);
    } else {
      newPaid = paidInstallments + nbToMark;
      amount = installmentTotal(nbToMark);
    }

    const isLast = newPaid >= totalInstallments;
    const label = isLast ? "SOLDÉE" : `${newPaid}/${totalInstallments}`;
    if (!confirm(`Enregistrer ${amount.toFixed(2)} € en espèces ? (${label})`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/exposants/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidInstallments: newPaid,
          status: isLast ? "CONFIRMED" : newPaid > 0 ? "PARTIAL" : "PENDING",
        }),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      router.refresh();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const newPaid = mode === "avance"
    ? Math.max(paidInstallments, 1)
    : paidInstallments + nbToMark;
  const isLast = newPaid >= totalInstallments;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-[var(--radius-button)] border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
      >
        <Banknote size={12} />
        Espèces
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Paiement espèces
              </h3>
              <button onClick={() => setOpen(false)} className="text-dta-taupe hover:text-dta-dark">
                <X size={18} />
              </button>
            </div>

            {/* Récap */}
            <div className="mb-4 rounded-lg bg-dta-bg p-3 text-xs text-dta-char/70 space-y-1">
              <div className="flex justify-between">
                <span>Total réservation</span>
                <span className="font-bold text-dta-dark">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Payé</span>
                <span className="font-medium">{paidInstallments}/{totalInstallments}</span>
              </div>
              <div className="flex justify-between">
                <span>Restant</span>
                <span className="font-medium text-red-600">{remainingSlots} échéance{remainingSlots > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Type de paiement */}
            <label className="mb-2 block text-sm font-medium text-dta-char">
              Type de paiement
            </label>
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("avance")}
                className={`flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  mode === "avance"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-dta-sand text-dta-char hover:border-blue-300"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1.5" />
                Avance
              </button>
              <button
                type="button"
                onClick={() => setMode("echeance")}
                className={`flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  mode === "echeance"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-dta-sand text-dta-char hover:border-amber-300"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1.5" />
                Mensualité
              </button>
            </div>

            {/* Avance */}
            {mode === "avance" && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-dta-char">
                  Montant de l&apos;avance
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={avanceAmount}
                    onChange={(e) => setAvanceAmount(e.target.value)}
                    className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 pr-8 text-sm font-medium"
                    autoFocus
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dta-taupe">€</span>
                </div>
                {isDepositPaid && (
                  <p className="mt-1 text-xs text-amber-600">
                    L&apos;avance est déjà marquée comme payée. Ceci mettra à jour le montant.
                  </p>
                )}
              </div>
            )}

            {/* Mensualité */}
            {mode === "echeance" && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-dta-char">
                  Nombre d&apos;échéances à enregistrer
                </label>
                <select
                  value={nbToMark}
                  onChange={(e) => setNbToMark(Number(e.target.value))}
                  className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm"
                >
                  {Array.from({ length: remainingSlots }, (_, i) => {
                    const n = i + 1;
                    const amt = installmentTotal(n);
                    const label = n === remainingSlots
                      ? `${n} — Tout solder (${amt.toFixed(2)} €)`
                      : `${n} échéance${n > 1 ? "s" : ""} — ${amt.toFixed(2)} €`;
                    return <option key={n} value={n}>{label}</option>;
                  })}
                </select>
                <p className="mt-1 text-xs text-dta-taupe">
                  {installmentAmount.toFixed(2)} € par échéance
                </p>
              </div>
            )}

            {/* Résultat */}
            <div className="mb-4 rounded-lg border border-dta-sand p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-dta-taupe">Montant enregistré</span>
                <span className="font-bold text-dta-dark">
                  {mode === "avance"
                    ? `${parseFloat(avanceAmount || "0").toFixed(2)} €`
                    : `${installmentTotal(nbToMark).toFixed(2)} €`}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-dta-taupe">Après enregistrement</span>
                <span className={`font-bold ${isLast ? "text-green-600" : "text-amber-600"}`}>
                  {isLast ? "Soldé ✓" : `${newPaid}/${totalInstallments} payé${newPaid > 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (mode === "avance" && (!avanceAmount || parseFloat(avanceAmount) <= 0))}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <Banknote size={14} />
              Enregistrer le paiement
            </button>
          </div>
        </div>
      )}
    </>
  );
}
