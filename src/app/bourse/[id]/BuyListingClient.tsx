"use client";

import { useState } from "react";

export default function BuyListingClient({ listingId }: { listingId: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("Email, prénom et nom requis.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail: email.trim(),
          buyerFirstName: firstName.trim(),
          buyerLastName: lastName.trim(),
          buyerPhone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Réponse invalide du serveur.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-5">
      <p className="text-xs text-slate-500">
        Vos coordonnées pour émettre le billet au bon nom. Paiement sécurisé Stripe (carte bancaire).
      </p>
      <input
        type="email"
        required
        placeholder="Votre email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="Prénom *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
        />
        <input
          type="text"
          required
          placeholder="Nom *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
        />
      </div>
      <input
        type="tel"
        placeholder="Téléphone (facultatif)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-dta-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
      >
        {loading ? "Redirection vers Stripe..." : "Payer et recevoir mon billet"}
      </button>
      <p className="text-[11px] text-slate-400 text-center">
        Dès le paiement validé, l&apos;ancien QR code est invalidé et le vôtre est émis par email.
      </p>
    </form>
  );
}
