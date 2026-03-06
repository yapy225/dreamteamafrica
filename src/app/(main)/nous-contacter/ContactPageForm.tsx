"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  label: string;
  desc: string;
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function ContactPageForm({
  categories,
}: {
  categories: Category[];
}) {
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    category && form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim() && form.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, ...form }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'envoi.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <h3 className="mt-4 font-serif text-xl font-bold text-dta-dark">
          Message envoy&eacute; !
        </h3>
        <p className="mt-2 text-sm text-dta-char/70">
          Merci pour votre message. Notre &eacute;quipe vous recontactera
          dans les meilleurs d&eacute;lais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      {error && (
        <div className="mb-5 rounded-[var(--radius-input)] bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Cat&eacute;gorie */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Vous &ecirc;tes *
        </label>
        <div className="relative">
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} appearance-none pr-10`}
          >
            <option value="">Sélectionnez votre profil</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} — {c.desc}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dta-taupe"
          />
        </div>
      </div>

      {/* Champs visibles apr&egrave;s s&eacute;lection de la cat&eacute;gorie */}
      {category && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Pr&eacute;nom *
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
                Nom *
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={inputClass}
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                T&eacute;l&eacute;phone *
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className={inputClass}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Entreprise / Organisation
            </label>
            <input
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
              className={inputClass}
              placeholder="Nom de votre structure (optionnel)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Message *
            </label>
            <textarea required
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className={inputClass}
              placeholder="Décrivez votre demande..."
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Envoyer ma demande
          </button>
        </div>
      )}
    </form>
  );
}
