"use client";

import { useState } from "react";
import { Store, CreditCard, Loader2, Check, MessageCircle } from "lucide-react";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  brand: string;
  sector: string;
  phone: string;
  email: string;
  eventName: string;
  status: string;
}

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function DevisClient({ lead }: { lead: Lead }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const alreadyPaid = lead.status === "DEPOSIT_PAID";

  const handleDeposit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/exposant-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/10">
          <Store size={28} className="text-dta-accent" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-dta-dark">
          Votre demande d&apos;exposition
        </h1>
        <p className="mt-2 text-sm text-dta-char/70">
          {lead.eventName}
        </p>
      </div>

      {/* Recap */}
      <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5 shadow-[var(--shadow-card)]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
          Récapitulatif
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-dta-char/70">Nom</span>
            <span className="font-medium text-dta-dark">
              {lead.firstName} {lead.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dta-char/70">Marque / Entreprise</span>
            <span className="font-medium text-dta-dark">{lead.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dta-char/70">Secteur d&apos;activité</span>
            <span className="font-medium text-dta-dark">{lead.sector}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dta-char/70">Téléphone</span>
            <span className="font-medium text-dta-dark">{lead.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dta-char/70">Email</span>
            <span className="font-medium text-dta-dark">{lead.email}</span>
          </div>
          <div className="border-t border-dta-sand pt-3">
            <div className="flex justify-between">
              <span className="text-dta-char/70">Événement</span>
              <span className="font-semibold text-dta-accent">{lead.eventName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {alreadyPaid ? (
        <div className="mt-6 rounded-[var(--radius-card)] border-2 border-green-200 bg-green-50 p-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Check size={20} className="text-green-600" />
          </div>
          <p className="font-serif text-lg font-bold text-dta-dark">
            Acompte reçu !
          </p>
          <p className="mt-2 text-sm text-dta-char/70">
            Votre acompte de {fmt.format(50)} a bien été enregistré.
            Votre devis personnalisé vous sera envoyé sur WhatsApp.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border-2 border-dta-accent/30 bg-gradient-to-br from-dta-accent/5 to-white p-6 shadow-[var(--shadow-card)]">
          <p className="font-serif text-lg font-bold text-dta-dark">
            Réservez votre stand
          </p>
          <p className="mt-2 text-sm text-dta-char/70">
            Bloquez votre place avec un acompte de{" "}
            <span className="font-bold text-dta-accent">{fmt.format(50)}</span>.
            Le solde sera ajusté selon votre devis final.
          </p>

          {error && (
            <div className="mt-3 rounded-[var(--radius-input)] bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-dta-accent-dark disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Redirection…
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Réserver — Acompte {fmt.format(50)}
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-dta-taupe">
            Paiement sécurisé par Stripe
          </p>
        </div>
      )}

      {/* WhatsApp contact */}
      <div className="mt-6 text-center">
        <p className="text-sm text-dta-char/70">
          Une question ?
        </p>
        <a
          href="https://wa.me/33782801852"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
        >
          <MessageCircle size={16} />
          Contactez-nous sur WhatsApp
        </a>
      </div>
    </div>
  );
}
