"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Check, CalendarDays, Sparkles } from "lucide-react";
import {
  EXHIBITOR_EVENTS,
  EXHIBITOR_PACKS,
  calculatePrice,
  isAllEvents,
  formatDate,
  DEPOSIT_AMOUNT,
  MAX_INSTALLMENTS,
} from "@/lib/exhibitor-events";

const INSTALLMENT_OPTIONS = Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1) as number[];

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const preselectedPack = searchParams.get("pack") || "ENTREPRENEUR";
  // Map legacy SAISON → ENTREPRENEUR with all events
  const initialPack = preselectedPack === "SAISON" ? "ENTREPRENEUR" : preselectedPack;

  const [pack, setPack] = useState(initialPack);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    preselectedPack === "SAISON" ? EXHIBITOR_EVENTS.map((e) => e.id) : []
  );
  const [stands, setStands] = useState(1);
  const [installments, setInstallments] = useState(1);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    sector: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allSelected = isAllEvents(selectedEvents);
  const selectedPack = EXHIBITOR_PACKS.find((p) => p.id === pack)!;
  const { totalDays, totalPrice: unitTotal, fullPrice: unitFull } = calculatePrice(pack, selectedEvents);
  const totalPrice = unitTotal * stands;
  const fullPrice = unitFull * stands;
  const savings = fullPrice - totalPrice;
  const deposit = Math.min(DEPOSIT_AMOUNT * stands, totalPrice);
  const remainingBalance = totalPrice - deposit;
  const installmentAmount =
    installments > 1 && remainingBalance > 0
      ? Math.ceil((remainingBalance / (installments - 1)) * 100) / 100
      : 0;

  const toggleAllEvents = () => {
    if (allSelected) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(EXHIBITOR_EVENTS.map((e) => e.id));
    }
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const canSubmit =
    totalPrice > 0 &&
    selectedEvents.length > 0 &&
    form.companyName.trim() &&
    form.contactName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.sector.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/exposants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack,
          events: selectedEvents,
          stands,
          installments,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Étape 1 : Choix du pack */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          1. Choisissez votre formule
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXHIBITOR_PACKS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPack(p.id)}
              className={`rounded-[var(--radius-card)] border-2 p-4 text-left transition-all ${
                pack === p.id
                  ? "border-dta-accent bg-dta-accent/5"
                  : "border-dta-sand bg-white hover:border-dta-accent/40"
              }`}
            >
              <p className="text-sm font-bold text-dta-dark">{p.name}</p>
              <p className="mt-1 text-lg font-bold text-dta-accent">
                {p.pricePerDay} &euro;
                <span className="text-xs font-normal text-dta-taupe">/jour</span>
              </p>
              {p.allEventsPricePerDay < p.pricePerDay && (
                <p className="mt-0.5 text-xs text-dta-accent/80">
                  {p.allEventsPricePerDay} &euro;/jour pour toute la saison
                </p>
              )}
              <ul className="mt-2 space-y-0.5">
                {p.kit.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-dta-char/70">
                    <Check size={10} className="mt-0.5 shrink-0 text-dta-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Étape 2 : Choix événement(s) */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          2. Choisissez vos &eacute;v&eacute;nements
        </legend>

        {/* Tous les événements — CTA prominent */}
        <button
          type="button"
          onClick={toggleAllEvents}
          className={`mb-4 flex w-full items-center gap-3 rounded-[var(--radius-card)] border-2 p-4 text-left transition-all ${
            allSelected
              ? "border-dta-accent bg-gradient-to-r from-dta-accent/10 to-dta-accent/5"
              : "border-dashed border-dta-accent/40 bg-dta-accent/5 hover:border-dta-accent"
          }`}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            allSelected ? "bg-dta-accent" : "bg-dta-accent/20"
          }`}>
            <Sparkles size={16} className={allSelected ? "text-white" : "text-dta-accent"} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-dta-dark">
              Toute la saison — {EXHIBITOR_EVENTS.length} &eacute;v&eacute;nements
            </p>
            <p className="text-xs text-dta-char/70">
              {EXHIBITOR_EVENTS.reduce((s, e) => s + e.days, 0)} jours d&apos;exposition
              {selectedPack.allEventsPricePerDay < selectedPack.pricePerDay && (
                <span className="ml-1 font-semibold text-dta-accent">
                  &mdash; tarif pr&eacute;f&eacute;rentiel {selectedPack.allEventsPricePerDay} &euro;/jour
                  au lieu de {selectedPack.pricePerDay} &euro;
                </span>
              )}
            </p>
          </div>
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            allSelected ? "border-dta-accent bg-dta-accent" : "border-dta-sand"
          }`}>
            {allSelected && <Check size={14} className="text-white" />}
          </div>
        </button>

        {/* Individual events */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EXHIBITOR_EVENTS.map((event) => {
            const selected = selectedEvents.includes(event.id);
            const eventDays = pack === "ENTREPRENEUR_1J" ? 1 : event.days;
            const eventPrice = eventDays * selectedPack.pricePerDay;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => toggleEvent(event.id)}
                className={`rounded-[var(--radius-card)] border-2 p-4 text-left transition-all ${
                  selected
                    ? "border-dta-accent bg-dta-accent/5"
                    : "border-dta-sand bg-white hover:border-dta-accent/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-dta-dark">{event.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-dta-char/70">
                      <CalendarDays size={12} />
                      {formatDate(event.date)}
                      {event.endDate && ` — ${formatDate(event.endDate)}`}
                    </p>
                  </div>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    selected ? "border-dta-accent bg-dta-accent" : "border-dta-sand"
                  }`}>
                    {selected && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-dta-dark">
                  {eventDays} jour{eventDays > 1 ? "s" : ""} — {fmt.format(eventPrice)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Savings banner */}
        {allSelected && savings > 0 && (
          <div className="mt-3 rounded-lg bg-green-50 px-4 py-2.5 text-center text-sm font-medium text-green-700">
            Vous &eacute;conomisez {fmt.format(savings)}{stands > 1 ? ` (${stands} stands)` : ""} avec le tarif saison compl&egrave;te
          </div>
        )}
      </fieldset>

      {/* Étape 2.5 : Nombre de stands */}
      {selectedEvents.length > 0 && (
        <fieldset>
          <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
            3. Nombre de stands
          </legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStands(n)}
                className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] border-2 text-sm font-bold transition-all ${
                  stands === n
                    ? "border-dta-accent bg-dta-accent text-white"
                    : "border-dta-sand bg-white text-dta-dark hover:border-dta-accent/40"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-dta-taupe">
            {stands} stand{stands > 1 ? "s" : ""} ({stands * 2} m&sup2;)
          </p>
        </fieldset>
      )}

      {/* Étape 4 : Infos exposant */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          4. Vos informations
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Entreprise / Marque
            </label>
            <input
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
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
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className={inputClass}
              placeholder="Pr&eacute;nom et nom"
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

      {/* Étape 5 : Paiement */}
      {totalPrice > 0 && (
        <fieldset>
          <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
            5. Mode de paiement
          </legend>

          <div className="mb-4 rounded-[var(--radius-card)] border border-dta-sand bg-white p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm text-dta-char/70">Total</span>
              <div className="text-right">
                {savings > 0 && (
                  <span className="mr-2 text-sm text-dta-taupe line-through">
                    {fmt.format(fullPrice)}
                  </span>
                )}
                <span className="font-serif text-2xl font-bold text-dta-dark">
                  {fmt.format(totalPrice)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Full payment */}
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
                    name="installments"
                    value={1}
                    checked={installments === 1}
                    onChange={() => setInstallments(1)}
                    className="accent-dta-accent"
                  />
                  <span className="text-sm font-medium text-dta-dark">Payer en 1 fois</span>
                </div>
                <span className="text-sm font-bold text-dta-dark">{fmt.format(totalPrice)}</span>
              </label>

              {/* Deposit + installments */}
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
                    name="installments"
                    value={2}
                    checked={installments > 1}
                    onChange={() => setInstallments(3)}
                    className="accent-dta-accent"
                  />
                  <span className="text-sm font-medium text-dta-dark">
                    Acompte de {fmt.format(deposit)} + mensualit&eacute;s
                  </span>
                </div>
              </label>
            </div>

            {/* Installment count selector */}
            {installments > 1 && (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                  Nombre de mensualit&eacute;s
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: MAX_INSTALLMENTS - 1 }, (_, i) => i + 2).map((n) => {
                    const monthly = Math.ceil((remainingBalance / (n - 1)) * 100) / 100;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setInstallments(n)}
                        className={`rounded-lg border-2 px-3 py-2 text-center transition-all ${
                          installments === n
                            ? "border-dta-accent bg-dta-accent/5"
                            : "border-dta-sand hover:border-dta-accent/40"
                        }`}
                      >
                        <span className="block text-xs font-bold text-dta-dark">{n - 1}x</span>
                        <span className="block text-[10px] text-dta-taupe">{fmt.format(monthly)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Schedule */}
                <div className="rounded-lg bg-dta-bg p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                    &Eacute;ch&eacute;ancier
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-dta-char/70">Aujourd&apos;hui &mdash; Acompte</span>
                      <span className="font-semibold text-dta-accent">{fmt.format(deposit)}</span>
                    </div>
                    {Array.from({ length: installments - 1 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() + i + 1);
                      return (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-dta-char/70">
                            {date.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="font-medium text-dta-dark">{fmt.format(installmentAmount)}</span>
                        </div>
                      );
                    })}
                    <div className="mt-2 flex items-center justify-between border-t border-dta-sand pt-2 text-sm">
                      <span className="font-medium text-dta-char">Total</span>
                      <span className="font-bold text-dta-dark">{fmt.format(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </fieldset>
      )}

      {/* Submit */}
      <div className="flex gap-3 border-t border-dta-sand pt-6">
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {totalPrice > 0
            ? installments === 1
              ? `Payer ${fmt.format(totalPrice)}`
              : `R\u00e9server — Acompte de ${fmt.format(deposit)}`
            : "S\u00e9lectionnez un \u00e9v\u00e9nement"}
        </button>
      </div>
    </form>
  );
}
