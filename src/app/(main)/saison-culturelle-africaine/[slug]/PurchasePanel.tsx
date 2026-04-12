"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Loader2, Minus, Plus, X, Tag, Check } from "lucide-react";

interface PurchasePanelProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventSlug: string;
  tier: { id: string; name: string; price: number; isCulturePourTous?: boolean };
  eventTitle: string;
  eventDate: string;
  eventEndDate?: string;
  fixedVisitDate?: string;
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    amount,
  );

/** Return every calendar day between two ISO date strings (inclusive).
 *  Subtracts 1s from endDate to handle midnight boundaries correctly —
 *  e.g. endDate "May 3 00:00 UTC" means the event ends May 2 night, not May 3. */
function getDaysBetween(startISO: string, endISO: string): Date[] {
  const days: Date[] = [];
  const startDate = startISO.slice(0, 10); // "2026-05-01"
  const adjEnd = new Date(new Date(endISO).getTime() - 1000);
  const endDate = adjEnd.toISOString().slice(0, 10); // "2026-05-02"

  const cur = new Date(startDate + "T12:00:00Z");
  const end = new Date(endDate + "T12:00:00Z");

  while (cur <= end) {
    days.push(new Date(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

/** Format a date in short French, e.g. "Ven. 1 mai" */
function formatDateFR(date: Date): string {
  return date
    .toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function PurchasePanel({
  open,
  onClose,
  eventId,
  eventSlug,
  tier,
  eventTitle,
  eventDate,
  eventEndDate,
  fixedVisitDate,
}: PurchasePanelProps) {
  /* ── state ───────────────────────────────────────────── */
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [selectedDate, setSelectedDate] = useState<string>(fixedVisitDate || eventDate);
  const [installments, setInstallments] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState<{ id: string; name: string; amountOff?: number; percentOff?: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── multi-day dates ─────────────────────────────────── */
  const isMultiDay = !!eventEndDate && !fixedVisitDate;
  const days = isMultiDay ? getDaysBetween(eventDate, eventEndDate!) : [];

  /* ── animation: delay so the initial state is painted before transition ── */
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(timeout);
    } else {
      setVisible(false);
    }
  }, [open]);

  /* ── lock body scroll while open ─────────────────────── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── close on Escape ─────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );
  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  /* ── promo code validation ────────────────────────────── */
  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/coupons/validate-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "Code invalide");
        setPromoApplied(null);
      } else {
        setPromoApplied(data);
        setPromoError("");
      }
    } catch {
      setPromoError("Erreur réseau");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };

  /* ── derived ─────────────────────────────────────────── */
  const total = tier.price * quantity;
  const deposit = installments > 1 ? 5 * quantity : total;
  const remainingBalance = total - deposit;
  const monthlyAmount = installments > 1 ? Math.ceil((remainingBalance / (installments - 1)) * 100) / 100 : 0;

  // Promo discount
  const promoDiscount = promoApplied
    ? promoApplied.amountOff
      ? Math.min(promoApplied.amountOff / 100, total)
      : promoApplied.percentOff
        ? Math.round(total * promoApplied.percentOff) / 100
        : 0
    : 0;

  // Frais de gestion 3% (min 0.50€)
  const payableAmount = installments > 1 ? deposit : total;
  const rawFee = payableAmount * 0.03;
  const fees = tier.price > 0 ? Math.max(rawFee, 0.50) : 0;
  const roundedFees = Math.round(fees * 100) / 100;
  const totalWithFees = Math.round((payableAmount + roundedFees) * 100) / 100;

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim();

  /* ── submit ──────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError("");

    // Facebook Pixel
    if (typeof window !== "undefined") {
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "InitiateCheckout", {
          value: total,
          currency: "EUR",
          content_type: "product",
          num_items: quantity,
        });
      }
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          value: total,
          currency: "EUR",
          items: [
            { item_category: "Billet", item_name: tier.name, price: tier.price, quantity },
          ],
        },
      });
    }

    setLoading(true);

    try {
      const bfp = typeof window !== "undefined" ? localStorage.getItem("dta_bfp") || "" : "";
      const endpoint = tier.isCulturePourTous
        ? "/api/checkout/culture-pour-tous"
        : "/api/checkout/tickets";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-behavior-fp": bfp },
        body: JSON.stringify({
          eventId,
          tier: tier.id,
          quantity,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          visitDate: selectedDate,
          ...(!tier.isCulturePourTous && { installments }),
          ...(promoApplied && !tier.isCulturePourTous && { promotionCode: promoApplied.id }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }

      if (data.free && data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Aucune URL de paiement reçue.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  /* ── don't render in the DOM when fully closed ───────── */
  if (!open && !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:py-4">
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-t-xl bg-white shadow-xl sm:rounded-xl transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full sm:translate-y-0 sm:opacity-0 opacity-100"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-dta-sand px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-dta-dark">
              {tier.name}
            </h2>
            <p className="text-sm text-dta-taupe">
              {tier.price === 0 ? "Gratuit" : `${formatCurrency(tier.price)} / billet`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-dta-char/50 transition-colors hover:bg-dta-bg hover:text-dta-dark"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] space-y-5 overflow-y-auto px-5 py-5"
        >
          {/* error */}
          {error && (
            <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* multi-day date picker */}
          {isMultiDay && days.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-dta-char">
                Date de visite
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => {
                  const iso = day.toISOString();
                  const isActive = selectedDate === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDate(iso)}
                      className={`rounded-[var(--radius-button)] border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-dta-accent bg-dta-accent text-white"
                          : "border-dta-sand bg-white text-dta-char hover:border-dta-accent/50"
                      }`}
                    >
                      {formatDateFR(day)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Quantit&eacute;
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-[var(--radius-button)] border border-dta-sand">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-dta-char/50 transition-colors hover:text-dta-dark"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-dta-dark">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-3 py-2 text-dta-char/50 transition-colors hover:text-dta-dark"
                  disabled={quantity >= 10}
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm text-dta-taupe">
                billet{quantity > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* contact form */}
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

          {/* promo code */}
          {tier.price > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Code promo
              </label>
              {promoApplied ? (
                <div className="flex items-center justify-between rounded-[var(--radius-input)] border border-green-300 bg-green-50 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{promoCode.toUpperCase()}</span>
                    <span className="text-xs text-green-600">
                      &minus;{promoApplied.amountOff
                        ? formatCurrency(promoApplied.amountOff / 100)
                        : `${promoApplied.percentOff}%`}
                    </span>
                  </div>
                  <button type="button" onClick={handleRemovePromo} className="text-dta-char/40 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyPromo(); } }}
                      className={`${inputClass} pl-9`}
                      placeholder="Entrez votre code"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || promoLoading}
                    className="flex-shrink-0 rounded-[var(--radius-button)] bg-dta-dark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dta-char disabled:opacity-50"
                  >
                    {promoLoading ? <Loader2 size={14} className="animate-spin" /> : "Appliquer"}
                  </button>
                </div>
              )}
              {promoError && (
                <p className="mt-1 text-xs text-red-500">{promoError}</p>
              )}
            </div>
          )}

          {/* CPT info banner for non-CPT tiers */}
          {tier.price > 5 && !tier.isCulturePourTous && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <p className="text-xs font-medium text-emerald-800">
                ✨ Budget serré ? Essayez <strong>Culture pour Tous</strong> — réservez dès 5&nbsp;€ et payez à votre rythme jusqu&apos;à la veille de l&apos;événement.{" "}
                <a href="/culture-pour-tous" target="_blank" className="underline hover:text-emerald-900">En savoir plus</a>
              </p>
            </div>
          )}


          {/* total + submit */}
          <div className="border-t border-dta-sand pt-4">
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dta-char/70">
                  {quantity} billet{quantity > 1 ? "s" : ""}
                  {tier.price > 0 && <> &times; {formatCurrency(tier.price)}</>}
                </span>
                <span className="text-dta-dark">
                  {tier.price === 0 ? "Gratuit" : formatCurrency(installments > 1 ? deposit : total)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">Code promo</span>
                  <span className="text-green-600">&minus;{formatCurrency(promoDiscount)}</span>
                </div>
              )}
              {tier.price > 0 && roundedFees > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dta-char/50">Frais de gestion (3%)</span>
                  <span className="text-dta-char/50">{formatCurrency(roundedFees)}</span>
                </div>
              )}
              {tier.price > 0 && (
                <div className="flex items-center justify-between text-sm font-semibold border-t border-dta-sand/50 pt-1.5">
                  <span className="text-dta-dark">Total</span>
                  <span className="font-serif text-lg font-bold text-dta-dark">{formatCurrency(totalWithFees)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {tier.price === 0 ? "Réservation en cours\u2026" : "Redirection\u2026"}
                </>
              ) : tier.price === 0 ? (
                "Réserver gratuitement"
              ) : (
                installments > 1
                  ? `Payer l'acompte — ${formatCurrency(totalWithFees)}`
                  : `Passer au paiement — ${formatCurrency(totalWithFees)}`
              )}
            </button>

            <p className="mt-2 text-center text-[10px] leading-relaxed text-dta-char/50">
              En réservant, vous acceptez nos{" "}
              <a href="/conditions-generales" target="_blank" className="underline hover:text-dta-accent">CGV</a>{" "}
              et notre{" "}
              <a href="/politique-de-confidentialite" target="_blank" className="underline hover:text-dta-accent">
                politique de confidentialité
              </a>.
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
