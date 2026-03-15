"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, Store, Check, CreditCard, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "33782801852";

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

interface ExposantPanelProps {
  onClose: () => void;
  eventName: string;
}

type Step = "form" | "confirmation";

export default function ExposantPanel({ onClose, eventName }: ExposantPanelProps) {
  const [step, setStep] = useState<Step>("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    brand: "",
    sector: "",
    phone: "",
    email: "",
  });
  const [interested, setInterested] = useState(true);
  const [loading, setLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [error, setError] = useState("");

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.brand.trim() &&
    form.sector.trim() &&
    form.phone.trim() &&
    form.email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/exposant-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi.");
        setLoading(false);
        return;
      }
      setLeadId(data.id);

      const lines = [
        `Bonjour, je souhaite devenir exposant.`,
        ``,
        `Prénom : ${form.firstName}`,
        `Nom : ${form.lastName}`,
        `Marque / Entreprise : ${form.brand}`,
        `Secteur d'activité : ${form.sector}`,
        `Téléphone : ${form.phone}`,
        `Email : ${form.email}`,
        ``,
        interested
          ? `Je suis intéressé(e) à exposer à : ${eventName}`
          : `Événement : ${eventName}`,
        ``,
        `Merci de m'envoyer un devis.`,
      ].join("\n");

      const text = encodeURIComponent(lines);
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        // whatsapp:// protocol opens WhatsApp Messenger directly (not Business)
        window.location.href = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;
      } else {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
      }

      setStep("confirmation");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!leadId || depositLoading) return;
    setError("");
    setDepositLoading(true);

    try {
      const res = await fetch("/api/checkout/exposant-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setDepositLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setDepositLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded-t-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-dta-sand px-5 py-4">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-fuchsia-600" />
            <h2 className="font-serif text-lg font-bold text-dta-dark">
              {step === "form" ? "Devenir exposant" : "Demande envoyée"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-dta-char/50 transition-colors hover:bg-dta-bg hover:text-dta-dark"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── STEP 1: Form ── */}
        {step === "form" && (
          <form
            onSubmit={handleSubmit}
            className="max-h-[80vh] space-y-4 overflow-y-auto px-5 py-5"
          >
            <p className="text-sm text-dta-char/70">
              Remplissez vos coordonnées et recevez votre devis directement sur
              WhatsApp.
            </p>

            {error && (
              <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-dta-char">
                  Pr&eacute;nom
                </label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dta-char">
                  Nom
                </label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Marque / Entreprise
              </label>
              <input
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className={inputClass}
                placeholder="Nom de votre marque ou entreprise"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Secteur d&apos;activit&eacute;
              </label>
              <input
                required
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className={inputClass}
                placeholder="Ex : Mode, Cosmétique, Alimentation…"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                T&eacute;l&eacute;phone
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+33 6 00 00 00 00"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="votre@email.com"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={interested}
                onChange={(e) => setInterested(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-dta-sand text-dta-accent focus:ring-dta-accent"
              />
              <span className="text-sm text-dta-char">
                Je suis intéressé(e) à exposer à{" "}
                <span className="font-semibold text-dta-dark">{eventName}</span>
              </span>
            </label>

            <div className="border-t border-dta-sand pt-4">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1da851] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Demander un devis sur WhatsApp
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-xs text-dta-taupe">
                Vous serez redirigé vers WhatsApp pour finaliser votre demande
              </p>
            </div>
          </form>
        )}

        {/* ── STEP 2: Confirmation + Deposit CTA ── */}
        {step === "confirmation" && (
          <div className="max-h-[80vh] overflow-y-auto px-5 py-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dta-dark">
                  Demande envoyée avec succès !
                </p>
                <p className="text-xs text-dta-taupe">
                  Votre devis vous sera envoyé sur WhatsApp
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] border border-dta-sand bg-dta-bg p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                Récapitulatif
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Nom</span>
                  <span className="font-medium text-dta-dark">
                    {form.firstName} {form.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Marque</span>
                  <span className="font-medium text-dta-dark">{form.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Secteur</span>
                  <span className="font-medium text-dta-dark">{form.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Téléphone</span>
                  <span className="font-medium text-dta-dark">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Email</span>
                  <span className="font-medium text-dta-dark">{form.email}</span>
                </div>
                <div className="border-t border-dta-sand pt-2">
                  <div className="flex justify-between">
                    <span className="text-dta-char/70">Événement</span>
                    <span className="font-semibold text-dta-accent">{eventName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-dta-sand" />
              <span className="text-xs font-medium text-dta-taupe">ou</span>
              <div className="h-px flex-1 bg-dta-sand" />
            </div>

            <div className="rounded-[var(--radius-card)] border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white p-5">
              <p className="font-serif text-base font-bold text-dta-dark">
                Réservez dès maintenant !
              </p>
              <p className="mt-1 text-sm text-dta-char/70">
                Bloquez votre stand avec un acompte de{" "}
                <span className="font-bold text-fuchsia-600">50,00 €</span>.
                Le solde sera ajusté selon votre devis final.
              </p>

              {error && (
                <div className="mt-3 rounded-[var(--radius-input)] bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={depositLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-fuchsia-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-fuchsia-700 disabled:opacity-50"
              >
                {depositLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirection…
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Réserver — Acompte 50,00 €
                  </>
                )}
              </button>

              <p className="mt-2 text-center text-xs text-dta-taupe">
                Paiement sécurisé par Stripe. Votre espace client sera créé automatiquement.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-2 text-center text-sm text-dta-taupe hover:text-dta-dark"
            >
              Je préfère attendre mon devis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
