"use client";

import { useState } from "react";

export default function TransferAcceptClient({
  transferId,
  token,
  fromLabel,
  expiresAt,
  message,
  mode,
  event,
  tier,
  prefillFirstName,
  prefillLastName,
  prefillPhone,
}: {
  transferId: string;
  token: string;
  fromLabel: string;
  expiresAt: string;
  message: string | null;
  mode: "FREE_GIFT" | "AT_COST";
  event: {
    title: string;
    venue: string;
    address: string;
    dateStr: string;
    coverImage: string | null;
  };
  tier: string;
  prefillFirstName: string | null;
  prefillLastName: string | null;
  prefillPhone: string | null;
}) {
  const [firstName, setFirstName] = useState(prefillFirstName || "");
  const [lastName, setLastName] = useState(prefillLastName || "");
  const [phone, setPhone] = useState(prefillPhone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | "accepted" | "refused">(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) {
      setError("Merci de renseigner vos nom et prénom.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/transfers/${transferId}/accept?t=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toFirstName: firstName.trim(),
          toLastName: lastName.trim(),
          toPhone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'acceptation.");
      } else {
        setDone("accepted");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!confirm("Refuser ce billet ?")) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/transfers/${transferId}/refuse?t=${encodeURIComponent(token)}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors du refus.");
      } else {
        setDone("refused");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  if (done === "accepted") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark">Billet accepté !</h1>
          <p className="mt-3 text-sm text-dta-char/70">
            Votre billet pour <strong>{event.title}</strong> vous a été envoyé par email. Conservez-le, il donnera seul accès à l&apos;événement.
          </p>
        </div>
      </div>
    );
  }

  if (done === "refused") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="font-serif text-2xl font-bold text-dta-dark">Invitation refusée</h1>
          <p className="mt-3 text-sm text-dta-char/70">
            {fromLabel} a été prévenu. Merci !
          </p>
        </div>
      </div>
    );
  }

  const expiresAtStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(expiresAt));

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        {event.coverImage ? (
          <div className="relative h-48 w-full bg-slate-900">
            <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-[11px] uppercase tracking-wider text-amber-300">{fromLabel} vous offre un billet</p>
              <h1 className="mt-1 font-serif text-xl font-bold text-white">{event.title}</h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-dta-accent to-dta-accent-dark p-8">
            <p className="text-[11px] uppercase tracking-wider text-white/70">{fromLabel} vous offre un billet</p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-white">{event.title}</h1>
          </div>
        )}

        <div className="space-y-3 border-b border-slate-100 p-5 text-sm">
          <div className="flex gap-3"><span className="w-20 text-xs uppercase tracking-wider text-slate-400">Quand</span><span className="flex-1 font-medium text-slate-900">{event.dateStr}</span></div>
          <div className="flex gap-3"><span className="w-20 text-xs uppercase tracking-wider text-slate-400">Où</span><span className="flex-1 font-medium text-slate-900">{event.venue}</span></div>
          <div className="flex gap-3"><span className="w-20 text-xs uppercase tracking-wider text-slate-400">Adresse</span><span className="flex-1 text-slate-600">{event.address}</span></div>
          <div className="flex gap-3"><span className="w-20 text-xs uppercase tracking-wider text-slate-400">Catégorie</span><span className="flex-1 font-semibold text-dta-accent">{tier}</span></div>
        </div>

        {message && (
          <div className="border-b border-slate-100 bg-amber-50/50 p-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Message de {fromLabel}</p>
            <p className="mt-2 whitespace-pre-line text-sm italic text-slate-700">&ldquo;{message}&rdquo;</p>
          </div>
        )}

        <form onSubmit={handleAccept} className="space-y-3 p-5">
          <p className="text-xs text-slate-500">
            Pour accepter le billet, renseignez vos coordonnées. Gratuit — {mode === "AT_COST" ? "paiement requis à l'étape suivante." : "aucun paiement."} Invitation valable jusqu&apos;au <strong>{expiresAtStr}</strong>.
          </p>
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? "..." : "Accepter le billet"}
            </button>
            <button
              type="button"
              onClick={handleRefuse}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
            >
              Refuser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
