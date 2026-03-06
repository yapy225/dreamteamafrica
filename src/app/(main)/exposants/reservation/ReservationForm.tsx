"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Check, CalendarDays } from "lucide-react";
import {
  EXHIBITOR_EVENTS,
  EXHIBITOR_PACKS,
  calculatePrice,
  formatDate,
} from "@/lib/exhibitor-events";

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const preselectedPack = searchParams.get("pack") || "ENTREPRENEUR";

  const [pack, setPack] = useState(preselectedPack);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
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

  // Pack saison = tous les événements
  useEffect(() => {
    if (pack === "SAISON") {
      setSelectedEvents(EXHIBITOR_EVENTS.map((e) => e.id));
    }
  }, [pack]);

  const toggleEvent = (eventId: string) => {
    if (pack === "SAISON") return;
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const { totalDays, totalPrice } = calculatePrice(pack, selectedEvents);
  const installmentAmount =
    totalPrice > 0 ? Math.ceil((totalPrice / installments) * 100) / 100 : 0;

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

  const selectedPack = EXHIBITOR_PACKS.find((p) => p.id === pack)!;

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
              onClick={() => {
                setPack(p.id);
                if (p.id !== "SAISON") setSelectedEvents([]);
              }}
              className={`rounded-[var(--radius-card)] border-2 p-4 text-left transition-all ${
                pack === p.id
                  ? "border-dta-accent bg-dta-accent/5"
                  : "border-dta-sand bg-white hover:border-dta-accent/40"
              }`}
            >
              <p className="text-sm font-bold text-dta-dark">{p.name}</p>
              <p className="mt-1 text-lg font-bold text-dta-accent">
                {p.pricePerDay} &euro;
                <span className="text-xs font-normal text-dta-taupe">
                  /jour
                </span>
              </p>
              <ul className="mt-2 space-y-0.5">
                {p.kit.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-xs text-dta-char/70"
                  >
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
      {pack !== "SAISON" && (
        <fieldset>
          <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
            2. Choisissez vos &eacute;v&eacute;nements
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXHIBITOR_EVENTS.map((event) => {
              const selected = selectedEvents.includes(event.id);
              const eventPrice = event.days * selectedPack.pricePerDay;
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
                      <p className="text-sm font-bold text-dta-dark">
                        {event.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-dta-char/70">
                        <CalendarDays size={12} />
                        {formatDate(event.date)}
                        {event.endDate && ` — ${formatDate(event.endDate)}`}
                      </p>
                    </div>
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        selected
                          ? "border-dta-accent bg-dta-accent"
                          : "border-dta-sand"
                      }`}
                    >
                      {selected && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-dta-dark">
                    {event.days} jour{event.days > 1 ? "s" : ""} —{" "}
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(eventPrice)}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {pack === "SAISON" && (
        <div className="rounded-[var(--radius-card)] border border-dta-accent/30 bg-dta-accent/5 p-4">
          <p className="text-sm font-medium text-dta-accent">
            Pack Saison — Les 4 &eacute;v&eacute;nements sont inclus (6 jours)
          </p>
          <ul className="mt-2 space-y-1">
            {EXHIBITOR_EVENTS.map((e) => (
              <li key={e.id} className="text-xs text-dta-char/70">
                {e.title} — {formatDate(e.date)}
                {e.endDate && ` au ${formatDate(e.endDate)}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Étape 3 : Infos exposant */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
          {pack === "SAISON" ? "2" : "3"}. Vos informations
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

      {/* Étape 4 : Paiement fractionné */}
      {totalPrice > 0 && (
        <fieldset>
          <legend className="mb-4 font-serif text-lg font-bold text-dta-dark">
            {pack === "SAISON" ? "3" : "4"}. Mode de paiement
          </legend>

          <div className="mb-4 rounded-[var(--radius-card)] border border-dta-sand bg-white p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm text-dta-char/70">Total</span>
              <span className="font-serif text-2xl font-bold text-dta-dark">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(totalPrice)}
              </span>
            </div>

            <div className="space-y-2">
              {INSTALLMENT_OPTIONS.map((n) => {
                const amount =
                  Math.ceil((totalPrice / n) * 100) / 100;
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
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(amount)}
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
                          {i === 0 ? "Aujourd'hui" : date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-medium text-dta-dark">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(installmentAmount)}
                        </span>
                      </div>
                    );
                  })}
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
            ? `Payer ${new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(installments === 1 ? totalPrice : installmentAmount)} ${
                installments > 1 ? `(1/${installments})` : ""
              }`
            : "S\u00e9lectionnez un \u00e9v\u00e9nement"}
        </button>
      </div>
    </form>
  );
}
