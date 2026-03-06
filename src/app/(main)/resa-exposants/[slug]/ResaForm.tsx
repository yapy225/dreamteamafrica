"use client";

import { useState } from "react";
import { Loader2, Check, CalendarDays, MapPin, Clock } from "lucide-react";
import {
  EXHIBITOR_PACKS,
  type ExhibitorEvent,
  type ExhibitorPackInfo,
  formatDate,
} from "@/lib/exhibitor-events";

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

// Packs disponibles pour un seul événement (pas le pack saison)
const SINGLE_PACKS = EXHIBITOR_PACKS.filter((p) => p.id !== "SAISON");

export default function ResaForm({ event }: { event: ExhibitorEvent }) {
  const [pack, setPack] = useState<ExhibitorPackInfo>(SINGLE_PACKS[0]);
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

  const totalPrice = event.days * pack.pricePerDay;
  const installmentAmount = Math.ceil((totalPrice / installments) * 100) / 100;

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
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/exposants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: pack.id,
          events: [event.id],
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
          {SINGLE_PACKS.map((p) => {
            const price = event.days * p.pricePerDay;
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
                    ({p.pricePerDay} &euro;/jour &times; {event.days}j)
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

      {/* Infos exposant */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          2. Vos informations
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

      {/* Paiement fractionné */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          3. Mode de paiement
        </legend>

        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-dta-char/70">Total</span>
            <span className="font-serif text-2xl font-bold text-dta-dark">
              {formatter.format(totalPrice)}
            </span>
          </div>

          <div className="space-y-2">
            {INSTALLMENT_OPTIONS.map((n) => {
              const amount = Math.ceil((totalPrice / n) * 100) / 100;
              return (
                <label
                  key={n}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
                    installments === n
                      ? "border-dta-accent bg-dta-accent/5"
                      : "border-dta-sand hover:border-dta-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="installments"
                      value={n}
                      checked={installments === n}
                      onChange={() => setInstallments(n)}
                      className="accent-dta-accent"
                    />
                    <span className="text-sm font-medium text-dta-dark">
                      {n === 1
                        ? "Payer en 1 fois"
                        : `Payer en ${n} fois sans frais`}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-dta-dark">
                    {formatter.format(amount)}
                    {n > 1 && (
                      <span className="font-normal text-dta-taupe">
                        {" "}
                        /mois
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          {installments > 1 && (
            <div className="mt-4 rounded-lg bg-dta-bg p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dta-taupe">
                &Eacute;ch&eacute;ancier
              </p>
              <div className="space-y-1">
                {Array.from({ length: installments }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() + i);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-dta-char/70">
                        {i === 0
                          ? "Aujourd'hui"
                          : date.toLocaleDateString("fr-FR", {
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

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {installments === 1
          ? `Payer ${formatter.format(totalPrice)}`
          : `Payer ${formatter.format(installmentAmount)} (1/${installments})`}
      </button>
    </form>
  );
}
