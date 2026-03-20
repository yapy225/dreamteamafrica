"use client";

import { useState } from "react";
import { Loader2, Check, CalendarDays, MapPin, Clock } from "lucide-react";
import {
  EXHIBITOR_PACKS,
  type ExhibitorEvent,
  type ExhibitorPackInfo,
  formatDate,
  DEPOSIT_AMOUNT,
  MAX_INSTALLMENTS,
} from "@/lib/exhibitor-events";

const INSTALLMENT_OPTIONS = Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1) as number[];

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function ResaForm({ event }: { event: ExhibitorEvent }) {
  // Pour les événements 1 jour : uniquement pack 1 jour + restauration
  const availablePacks = event.days === 1
    ? EXHIBITOR_PACKS.filter((p) => p.id === "ENTREPRENEUR_1J" || p.id === "RESTAURATION")
    : EXHIBITOR_PACKS;

  const [pack, setPack] = useState<ExhibitorPackInfo>(availablePacks[0]);
  const [stands, setStands] = useState(1);
  const [installments, setInstallments] = useState(1);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    sector: "",
  });
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveDays = pack.id === "ENTREPRENEUR_1J" ? 1 : event.days;
  const unitPrice = effectiveDays * pack.pricePerDay;
  const totalPrice = unitPrice * stands;
  const deposit = Math.min(DEPOSIT_AMOUNT * stands, totalPrice);
  const remainingBalance = totalPrice - deposit;
  const installmentAmount = installments > 1 && remainingBalance > 0
    ? Math.ceil((remainingBalance / (installments - 1)) * 100) / 100
    : 0;

  const canSubmit =
    form.companyName.trim() &&
    form.contactName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.sector.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");

    // Facebook Pixel + GTM tracking
    if (typeof window !== "undefined") {
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "InitiateCheckout", {
          value: totalPrice,
          currency: "EUR",
          content_name: `Stand Exposant — ${pack.name}`,
          content_type: "product",
        });
      }
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          value: totalPrice,
          currency: "EUR",
          items: [{ item_name: pack.name, item_category: "Stand Exposant", price: totalPrice, quantity: 1 }],
        },
      });
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/exposants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: pack.id,
          events: [event.id],
          installments,
          stands,
          newsletter,
          ...form,
        }),
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

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* En-tête événement */}
      <div className="rounded-[var(--radius-card)] border border-dta-accent/30 bg-dta-accent/5 p-6">
        <h1 className="font-serif text-2xl font-bold text-dta-dark">
          {event.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-dta-char/70">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-dta-accent" />
            {formatDate(event.date)}
            {event.endDate && ` — ${formatDate(event.endDate)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-dta-accent" />
            {event.hours}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-dta-accent" />
            {event.venue} — {event.address}
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-dta-dark">
          {event.days} jour{event.days > 1 ? "s" : ""} d&apos;exposition
        </p>
      </div>

      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Choix du pack */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          1. Choisissez votre formule
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {availablePacks.map((p) => {
            const days = p.id === "ENTREPRENEUR_1J" ? 1 : event.days;
            const price = days * p.pricePerDay;
            const selected = pack.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPack(p)}
                className={`rounded-[var(--radius-card)] border-2 p-5 text-left transition-all ${
                  selected
                    ? "border-dta-accent bg-dta-accent/5"
                    : "border-dta-sand bg-white hover:border-dta-accent/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-dta-dark">{p.name}</p>
                    <p className="mt-1 text-xs text-dta-char/70">
                      {p.description}
                    </p>
                  </div>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selected
                        ? "border-dta-accent bg-dta-accent"
                        : "border-dta-sand"
                    }`}
                  >
                    {selected && <Check size={12} className="text-white" />}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-dta-dark">
                    {formatter.format(price)}
                  </span>
                  <span className="text-xs text-dta-taupe">
                    ({p.pricePerDay} &euro;/jour &times; {days}j)
                  </span>
                </div>

                <ul className="mt-3 space-y-1">
                  {p.kit.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-xs text-dta-char/70"
                    >
                      <Check
                        size={10}
                        className="mt-0.5 shrink-0 text-dta-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Nombre de stands */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          2. Nombre de stands
        </legend>
        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5">
          <p className="mb-3 text-sm text-dta-char/70">
            Vous pouvez r&eacute;server plusieurs stands (2&nbsp;m&sup2; chacun) pour un espace plus grand.
          </p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStands(n)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all ${
                  stands === n
                    ? "border-dta-accent bg-dta-accent text-white"
                    : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {stands > 1 && (
            <div className="mt-3 rounded-lg bg-dta-accent/5 px-4 py-2.5 text-sm">
              <span className="font-medium text-dta-dark">
                {stands} stands &times; {formatter.format(unitPrice)} ={" "}
              </span>
              <span className="font-bold text-dta-accent">
                {formatter.format(totalPrice)}
              </span>
              <span className="ml-2 text-dta-char/70">
                ({stands * 2}&nbsp;m&sup2; au total)
              </span>
            </div>
          )}
        </div>
      </fieldset>

      {/* Infos exposant */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          3. Vos informations
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Entreprise / Marque
            </label>
            <input
              required
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              className={inputClass}
              placeholder="Nom de votre entreprise"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Nom du contact
            </label>
            <input
              required
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
              className={inputClass}
              placeholder="Prénom et nom"
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
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Secteur d&apos;activit&eacute;
            </label>
            <input
              required
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
              className={inputClass}
              placeholder="Ex: Cosmétiques naturels, Restauration, Mode, Artisanat..."
            />
          </div>
        </div>
      </fieldset>

      {/* Mode de paiement */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          4. Mode de paiement
        </legend>

        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-dta-char/70">Total</span>
            <span className="font-serif text-2xl font-bold text-dta-dark">
              {formatter.format(totalPrice)}
            </span>
          </div>

          {/* Choix : paiement intégral ou acompte */}
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
                installments === 1
                  ? "border-dta-accent bg-dta-accent/5"
                  : "border-dta-sand hover:border-dta-accent/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMode"
                  checked={installments === 1}
                  onChange={() => setInstallments(1)}
                  className="accent-dta-accent"
                />
                <span className="text-sm font-medium text-dta-dark">
                  Payer en 1 fois
                </span>
              </div>
              <span className="text-sm font-bold text-dta-dark">
                {formatter.format(totalPrice)}
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
                installments > 1
                  ? "border-dta-accent bg-dta-accent/5"
                  : "border-dta-sand hover:border-dta-accent/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMode"
                  checked={installments > 1}
                  onChange={() => setInstallments(2)}
                  className="accent-dta-accent"
                />
                <div>
                  <span className="text-sm font-medium text-dta-dark">
                    R&eacute;server avec un acompte de {formatter.format(deposit)}
                  </span>
                  <p className="text-xs text-dta-char/60 mt-0.5">
                    Puis mensualit&eacute;s &agrave; partir du mois suivant
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-dta-accent">
                {formatter.format(deposit)}
                <span className="font-normal text-dta-taupe"> aujourd&apos;hui</span>
              </span>
            </label>
          </div>

          {/* Choix du nombre de mensualités (visible uniquement si acompte) */}
          {installments > 1 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-dta-dark">
                Solde restant : {formatter.format(remainingBalance)} &mdash; en combien de mensualit&eacute;s ?
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: MAX_INSTALLMENTS - 1 }, (_, i) => {
                  const n = i + 2; // 2 to MAX_INSTALLMENTS (total payments = deposit + n-1 installments)
                  const nbMonths = n - 1;
                  const monthly = Math.ceil((remainingBalance / nbMonths) * 100) / 100;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setInstallments(n)}
                      className={`rounded-lg border-2 px-3 py-2 text-center transition-all ${
                        installments === n
                          ? "border-dta-accent bg-dta-accent text-white"
                          : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
                      }`}
                    >
                      <span className="block text-sm font-bold">{nbMonths}x</span>
                      <span className={`block text-xs ${installments === n ? "text-white/80" : "text-dta-taupe"}`}>
                        {formatter.format(monthly)}/mois
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Échéancier détaillé */}
              <div className="rounded-lg bg-dta-bg p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                  &Eacute;ch&eacute;ancier
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dta-char/70 font-medium">
                      Aujourd&apos;hui &mdash; Acompte de r&eacute;servation
                    </span>
                    <span className="font-semibold text-dta-accent">
                      {formatter.format(deposit)}
                    </span>
                  </div>
                  {Array.from({ length: installments - 1 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + i + 1);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-dta-char/70">
                          {date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-medium text-dta-dark">
                          {formatter.format(installmentAmount)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="mt-2 border-t border-dta-sand pt-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-dta-char">Total</span>
                    <span className="font-bold text-dta-dark">{formatter.format(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      {/* Modalités */}
      <div className="rounded-lg bg-dta-bg p-4 text-xs text-dta-char/70">
        <p className="font-semibold text-dta-char">Modalit&eacute;s</p>
        <ul className="mt-1.5 list-inside list-disc space-y-0.5">
          <li>
            R&eacute;servation confirm&eacute;e apr&egrave;s paiement ou
            acompte
          </li>
          <li>Facture officielle transmise</li>
          <li>
            Aucun statut sp&eacute;cifique exig&eacute; si vous &ecirc;tes
            d&eacute;clar&eacute;(e) dans votre pays ou en France
          </li>
        </ul>
      </div>

      {/* Newsletter opt-in */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-dta-accent"
        />
        <span className="text-xs leading-relaxed text-dta-char/70">
          Je souhaite recevoir les actualit&eacute;s, offres et informations de Dream Team Africa par email. Vous pouvez vous d&eacute;sabonner &agrave; tout moment.
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {installments === 1
          ? `Payer ${formatter.format(totalPrice)}`
          : `Réserver mon stand — Acompte de ${formatter.format(deposit)}`}
      </button>
    </form>
  );
}
