"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Minus, Plus } from "lucide-react";

interface FreeReservationFormProps {
  eventId: string;
  eventTitle: string;
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function FreeReservationForm({
  eventId,
  eventTitle,
}: FreeReservationFormProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, guests, ...form }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la réservation.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle size={40} className="mx-auto text-green-500" />
        <h3 className="mt-3 font-serif text-lg font-bold text-dta-dark">
          R&eacute;servation confirm&eacute;e !
        </h3>
        <p className="mt-2 text-sm text-dta-char/70">
          {guests} place{guests > 1 ? "s" : ""} r&eacute;serv&eacute;e
          {guests > 1 ? "s" : ""} pour <strong>{eventTitle}</strong>.
        </p>
        <p className="mt-1 text-sm text-dta-char/70">
          Un r&eacute;capitulatif sera envoy&eacute; &agrave;{" "}
          <strong>{form.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-serif text-lg font-bold text-dta-dark">
        R&eacute;servation gratuite
      </h3>
      <p className="mt-1 text-sm text-dta-char/70">
        Entr&eacute;e libre sur r&eacute;servation — places limit&eacute;es
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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

        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">
            Nombre de places
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-[var(--radius-button)] border border-dta-sand">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="px-3 py-2 text-dta-char/50 hover:text-dta-dark"
                disabled={guests <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-dta-dark">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                className="px-3 py-2 text-dta-char/50 hover:text-dta-dark"
                disabled={guests >= 10}
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-dta-taupe">
              place{guests > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          R&eacute;server gratuitement
        </button>
      </form>
    </div>
  );
}
