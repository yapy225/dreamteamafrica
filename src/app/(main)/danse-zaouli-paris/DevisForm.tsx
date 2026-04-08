"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, ChevronDown } from "lucide-react";

const PRESTATIONS = [
  { id: "SPECTACLE_THEATRE", label: "Spectacle Zaouli en theatre" },
  { id: "SPECTACLE_FESTIVAL", label: "Spectacle pour festival / evenement" },
  { id: "COMITE_ENTREPRISE", label: "Comite d'entreprise / team building" },
  { id: "MARIAGE_PRIVE", label: "Mariage / evenement prive" },
  { id: "COLLECTIVITE", label: "Collectivite / mairie / association" },
  { id: "SCOLAIRE", label: "Etablissement scolaire / MJC" },
  { id: "AUTRE", label: "Autre demande" },
];

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function DevisForm() {
  const [prestation, setPrestation] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    date: "",
    lieu: "",
    guests: "",
    message: "",
  });
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    prestation &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.message.trim();

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
          category: "ZAOULI_DEVIS",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          company: form.company,
          newsletter,
          message: [
            `[Prestation] ${PRESTATIONS.find((p) => p.id === prestation)?.label || prestation}`,
            form.date ? `[Date souhaitee] ${form.date}` : "",
            form.lieu ? `[Lieu] ${form.lieu}` : "",
            form.guests ? `[Nombre d'invites] ${form.guests}` : "",
            "",
            form.message,
          ]
            .filter(Boolean)
            .join("\n"),
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
      setError("Erreur reseau. Veuillez reessayer.");
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <h3 className="mt-4 font-serif text-xl font-bold text-dta-dark">
          Demande envoyee !
        </h3>
        <p className="mt-2 text-sm text-dta-char/70">
          Merci pour votre demande de devis. Notre equipe vous recontactera sous 48h
          avec une proposition personnalisee.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <h3 className="font-serif text-xl font-bold text-dta-dark">
        Demander un devis
      </h3>
      <p className="mt-1 text-sm text-dta-char/70">
        Decrivez votre projet et recevez une proposition sur mesure sous 48h.
      </p>

      {error && (
        <div className="mt-4 rounded-[var(--radius-input)] bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-4">
        {/* Type de prestation */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Type de prestation *
          </label>
          <div className="relative">
            <select
              required
              value={prestation}
              onChange={(e) => setPrestation(e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Selectionnez une prestation</option>
              {PRESTATIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dta-taupe"
            />
          </div>
        </div>

        {/* Identite */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Prenom *
            </label>
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={inputClass}
              placeholder="Votre prenom"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Nom *
            </label>
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputClass}
              placeholder="Votre nom"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Email *
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
              Telephone *
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
        </div>

        {/* Entreprise */}
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">
            Entreprise / Organisation
          </label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
            placeholder="Nom de votre structure (optionnel)"
          />
        </div>

        {/* Details evenement */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Date souhaitee
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Lieu
            </label>
            <input
              value={form.lieu}
              onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              className={inputClass}
              placeholder="Ville ou adresse"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">
              Nombre d&apos;invites
            </label>
            <input
              type="number"
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className={inputClass}
              placeholder="Ex: 150"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">
            Decrivez votre projet *
          </label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputClass}
            placeholder="Contexte, nombre de danseurs souhaites, duree de la prestation, budget indicatif..."
          />
        </div>

        {/* Newsletter */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-dta-sand bg-dta-bg p-4 transition-colors hover:border-dta-accent/40">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-dta-accent"
          />
          <span className="text-xs leading-relaxed text-dta-char/70">
            Je souhaite recevoir les actualites et evenements de Dream Team Africa
            par email. Conformement au RGPD, je peux me desinscrire a tout moment.
          </span>
        </label>

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
          Envoyer ma demande de devis
        </button>
      </div>
    </form>
  );
}
