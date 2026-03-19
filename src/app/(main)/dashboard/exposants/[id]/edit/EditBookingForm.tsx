"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { EXHIBITOR_PACKS, EXHIBITOR_EVENTS } from "@/lib/exhibitor-events";

const STATUSES = ["PENDING", "PARTIAL", "CONFIRMED", "CANCELLED"] as const;
const INSTALLMENT_OPTIONS = [1, 2, 3] as const;

interface BookingData {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  sector: string;
  pack: string;
  events: string[];
  totalDays: number;
  stands: number;
  totalPrice: number;
  installments: number;
  installmentAmount: number;
  paidInstallments: number;
  status: string;
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function EditBookingForm({ booking }: { booking: BookingData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: booking.companyName,
    contactName: booking.contactName,
    email: booking.email,
    phone: booking.phone,
    sector: booking.sector,
    pack: booking.pack,
    totalDays: booking.totalDays,
    stands: booking.stands,
    totalPrice: booking.totalPrice.toString(),
    installments: booking.installments,
    paidInstallments: booking.paidInstallments,
    status: booking.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = parseFloat(form.totalPrice) || 0;
  const installmentAmount =
    form.installments > 0
      ? Math.ceil((totalPrice / form.installments) * 100) / 100
      : totalPrice;

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/exposants/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalPrice,
          installmentAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la mise à jour.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/exposants");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Entreprise</label>
          <input
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Contact</label>
          <input
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">T&eacute;l&eacute;phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-dta-char">Secteur</label>
          <input
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Pack */}
      <div>
        <label className="mb-1 block text-sm font-medium text-dta-char">Formule</label>
        <select
          value={form.pack}
          onChange={(e) => setForm({ ...form, pack: e.target.value })}
          className={inputClass}
        >
          {EXHIBITOR_PACKS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.pricePerDay} &euro;/jour)
            </option>
          ))}
        </select>
      </div>

      {/* Jours & Stands */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Nombre de jours</label>
          <select
            value={form.totalDays}
            onChange={(e) => setForm({ ...form, totalDays: Number(e.target.value) })}
            className={inputClass}
          >
            <option value={1}>1 jour</option>
            <option value={2}>2 jours</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Nombre de stands</label>
          <input
            type="number"
            min="1"
            max="10"
            value={form.stands}
            onChange={(e) => setForm({ ...form, stands: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Prix total */}
      <div>
        <label className="mb-1 block text-sm font-medium text-dta-char">
          Prix total (&euro;)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.totalPrice}
          onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Mode de paiement */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">
            Nombre d&apos;&eacute;ch&eacute;ances
          </label>
          <select
            value={form.installments}
            onChange={(e) => setForm({ ...form, installments: Number(e.target.value) })}
            className={inputClass}
          >
            {INSTALLMENT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "Paiement unique" : `${n} fois sans frais`}
              </option>
            ))}
          </select>
          {form.installments > 1 && (
            <p className="mt-1 text-xs text-dta-taupe">
              Mensualit&eacute; : {formatter.format(installmentAmount)}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">
            Versements re&ccedil;us
          </label>
          <input
            type="number"
            min="0"
            max={form.installments}
            value={form.paidInstallments}
            onChange={(e) => setForm({ ...form, paidInstallments: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Statut */}
      <div>
        <label className="mb-1 block text-sm font-medium text-dta-char">Statut</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className={inputClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "PENDING"
                ? "En attente"
                : s === "PARTIAL"
                  ? "Paiement en cours"
                  : s === "CONFIRMED"
                    ? "Confirmé"
                    : "Annulé"}
            </option>
          ))}
        </select>
      </div>

      {/* Événements (read-only) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-dta-char">&Eacute;v&eacute;nements</label>
        <div className="flex flex-wrap gap-2">
          {booking.events.map((eid) => {
            const ev = EXHIBITOR_EVENTS.find((e) => e.id === eid);
            return (
              <span
                key={eid}
                className="rounded-full bg-dta-accent/10 px-3 py-1 text-xs font-medium text-dta-accent"
              >
                {ev?.title ?? eid}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-[var(--radius-button)] border border-dta-sand px-6 py-3 text-sm font-medium text-dta-char hover:bg-dta-beige"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
