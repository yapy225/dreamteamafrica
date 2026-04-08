"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

const presets = [5, 30, 50];

export default function DonationForm() {
  const [selected, setSelected] = useState<number | null>(30);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = selected ?? (Number(custom) || 0);
  const canSubmit = amount >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors du paiement.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-card)] border border-white/10 bg-white/10 p-6 backdrop-blur-md sm:p-8"
    >
      <h2 className="font-serif text-xl font-bold text-white">
        Faire un don
      </h2>
      <p className="mt-1 text-sm text-dta-sand/70">
        Choisissez un montant ou saisissez le v&ocirc;tre
      </p>

      {error && (
        <div className="mt-4 rounded-[var(--radius-input)] bg-red-500/20 px-4 py-2.5 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Montants prédéfinis */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {presets.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => {
              setSelected(val);
              setCustom("");
            }}
            className={`rounded-[var(--radius-button)] border-2 py-3 text-center font-serif text-lg font-bold transition-all ${
              selected === val
                ? "border-red-500 bg-red-600 text-white"
                : "border-white/20 bg-white/5 text-white hover:border-white/40"
            }`}
          >
            {val}&nbsp;&euro;
          </button>
        ))}
      </div>

      {/* Montant libre */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-dta-sand/80">
          Autre montant
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            step="1"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setSelected(null);
            }}
            onFocus={() => setSelected(null)}
            className="w-full rounded-[var(--radius-input)] border border-white/20 bg-white/10 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-dta-sand/40 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Montant libre"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-dta-sand/50">
            &euro;
          </span>
        </div>
      </div>

      {/* Récap */}
      {canSubmit && (
        <p className="mt-4 text-center text-sm text-dta-sand/70">
          Votre don : <span className="font-bold text-white">{amount}&nbsp;&euro;</span>
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Heart size={16} />
        )}
        {loading ? "Redirection..." : `Donner ${canSubmit ? amount + " €" : ""}`}
      </button>

      <p className="mt-3 text-center text-xs text-dta-sand/50">
        Paiement s&eacute;curis&eacute; par Stripe
      </p>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-dta-sand/40">
        En effectuant ce don, j&apos;accepte que mes donn&eacute;es soient trait&eacute;es conform&eacute;ment &agrave; la{" "}
        <a href="/politique-de-confidentialite" target="_blank" className="underline hover:text-dta-sand/60">
          politique de confidentialit&eacute;
        </a>.
      </p>
    </form>
  );
}
