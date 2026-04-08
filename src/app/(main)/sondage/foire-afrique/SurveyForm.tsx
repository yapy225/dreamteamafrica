"use client";

import { useState } from "react";
import { Loader2, Check, PartyPopper } from "lucide-react";

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

export default function SurveyForm() {
  const [answer, setAnswer] = useState<"YES" | "NO" | null>(null);
  const [days, setDays] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const canSubmit =
    answer !== null && name.trim() && email.trim() && (answer === "NO" || days.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sondage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, days, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur, veuillez réessayer.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dta-accent/30 bg-dta-accent/5 p-8 text-center">
        <PartyPopper size={40} className="mx-auto text-dta-accent" />
        <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
          Merci pour votre r&eacute;ponse !
        </h2>
        <p className="mt-2 text-sm text-dta-char/70">
          {answer === "YES"
            ? "Nous vous recontacterons très bientôt par WhatsApp avec notre proposition."
            : "Nous avons bien noté votre réponse. À bientôt !"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Question principale */}
      <fieldset>
        <legend className="mb-3 font-serif text-lg font-bold text-dta-dark">
          Seriez-vous pr&ecirc;t(e) &agrave; participer &agrave; la 6&egrave;me &eacute;dition ?
        </legend>
        <div className="flex gap-3">
          {(["YES", "NO"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAnswer(a)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 px-6 py-4 text-sm font-semibold transition-all ${
                answer === a
                  ? a === "YES"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-400 bg-red-50 text-red-600"
                  : "border-dta-sand bg-white text-dta-char hover:border-dta-accent/40"
              }`}
            >
              {answer === a && <Check size={16} />}
              {a === "YES" ? "Oui, je suis intéressé(e)" : "Non, pas cette fois"}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Choix des jours (si oui) */}
      {answer === "YES" && (
        <fieldset>
          <legend className="mb-3 font-serif text-lg font-bold text-dta-dark">
            Quel(s) jour(s) vous int&eacute;resse(nt) ?
          </legend>
          <div className="flex gap-3">
            {[
              { day: 1, label: "Vendredi 1er mai", date: "1er mai 2026" },
              { day: 2, label: "Samedi 2 mai", date: "2 mai 2026" },
            ].map(({ day, label }) => {
              const selected = days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 px-4 py-3 text-sm font-medium transition-all ${
                    selected
                      ? "border-dta-accent bg-dta-accent/5 text-dta-accent"
                      : "border-dta-sand bg-white text-dta-char hover:border-dta-accent/40"
                  }`}
                >
                  {selected && <Check size={14} />}
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Infos contact */}
      {answer !== null && (
        <fieldset>
          <legend className="mb-3 font-serif text-lg font-bold text-dta-dark">
            Vos coordonn&eacute;es
          </legend>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                Nom complet
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">
                WhatsApp / T&eacute;l&eacute;phone{" "}
                <span className="text-xs font-normal text-dta-taupe">(recommand&eacute;)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
          </div>
        </fieldset>
      )}

      {answer !== null && (
        <p className="text-[11px] leading-relaxed text-dta-char/50">
          En soumettant ce sondage, j&apos;accepte que mes donn&eacute;es soient trait&eacute;es conform&eacute;ment &agrave; la{" "}
          <a href="/politique-de-confidentialite" target="_blank" className="underline text-dta-accent">
            politique de confidentialit&eacute;
          </a>. Conforme RGPD.
        </p>
      )}

      {/* Submit */}
      {answer !== null && (
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Envoyer ma r&eacute;ponse
        </button>
      )}
    </form>
  );
}
