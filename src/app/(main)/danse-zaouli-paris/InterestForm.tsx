"use client";

import { useState } from "react";
import { Loader2, CheckCircle, ChevronDown } from "lucide-react";

const FORMULES = [
  { id: "DECOUVERTE", label: "Cours découverte (1h30)" },
  { id: "STAGE", label: "Stage intensif (demi-journée)" },
  { id: "HEBDO", label: "Cours collectif hebdo" },
  { id: "PRIVE", label: "Cours privé / entreprise" },
  { id: "PAS_SUR", label: "Je ne sais pas encore" },
];

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-white px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function InterestForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    formule: "",
  });
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    form.firstName.trim() && form.email.trim() && form.formule;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "ZAOULI_INTERET",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          newsletter,
          message: `[Sondage cours Zaouli — lancement sept. 2026]\n[Formule souhaitée] ${FORMULES.find((f) => f.id === form.formule)?.label || form.formule}`,
        }),
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
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle size={40} className="mx-auto text-green-500" />
        <h4 className="mt-3 font-serif text-lg font-bold text-dta-dark">
          Merci pour votre intérêt !
        </h4>
        <p className="mt-2 text-sm text-dta-char/70">
          Nous vous contacterons dès l&apos;ouverture des inscriptions en septembre 2026.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className={inputClass}
          placeholder="Prénom *"
        />
        <input
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className={inputClass}
          placeholder="Nom"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
          placeholder="Email *"
        />
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
          placeholder="Téléphone (optionnel)"
        />
      </div>

      <div className="relative">
        <select
          required
          value={form.formule}
          onChange={(e) => setForm({ ...form, formule: e.target.value })}
          className={`${inputClass} appearance-none pr-10`}
        >
          <option value="">Quelle formule vous intéresse ? *</option>
          {FORMULES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dta-taupe"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-dta-sand/60 bg-white/50 p-3 transition-colors hover:border-dta-accent/40">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-dta-accent"
        />
        <span className="text-xs leading-relaxed text-dta-char/70">
          Me prévenir à l&apos;ouverture des inscriptions et recevoir les actualités Dream Team Africa. Désabonnement à tout moment.
        </span>
      </label>

      <p className="text-[11px] leading-relaxed text-dta-char/50">
        En soumettant ce formulaire, j&apos;accepte que mes données soient traitées conformément à la{" "}
        <a href="/politique-de-confidentialite" target="_blank" className="underline text-dta-accent">
          politique de confidentialité
        </a>. Conformément au RGPD, je peux exercer mes droits d&apos;accès, de rectification et de suppression à tout moment.
      </p>

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Je suis intéressé(e) !"
        )}
      </button>
    </form>
  );
}
