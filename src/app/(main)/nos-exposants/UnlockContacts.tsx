"use client";

import { useState } from "react";
import { Lock, Unlock, Ticket, Phone } from "lucide-react";

interface Exposant {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export default function UnlockContacts({
  exposants,
  children,
}: {
  exposants: Exposant[];
  children: (unlocked: boolean, data: Map<string, { phone: string; email: string }>) => React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const contactMap = new Map(
    exposants.map((e) => [e.id, { phone: e.phone, email: e.email }])
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-ticket-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();

      if (data.ok) {
        setUnlocked(true);
        setFirstName(data.firstName || "");
        setShowModal(false);
      } else {
        setError("no_ticket");
      }
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!unlocked && (
        <div className="mb-8 flex items-center justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark transition-colors"
          >
            <Lock size={16} />
            Débloquer les contacts des exposants
          </button>
        </div>
      )}

      {unlocked && firstName && (
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-medium text-green-700">
            <Unlock size={16} />
            Bienvenue {firstName} — contacts débloqués ✅
          </div>
        </div>
      )}

      {children(unlocked, contactMap)}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/10">
                <Ticket size={28} className="text-dta-accent" />
              </div>
              <h2 className="font-serif text-xl font-bold text-dta-dark">
                Accéder aux contacts
              </h2>
              <p className="mt-2 text-sm text-dta-char/70">
                Entrez le numéro de téléphone utilisé lors de votre achat de billet.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  className="w-full rounded-lg border border-dta-sand py-3 pl-10 pr-4 text-sm focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                  autoFocus
                />
              </div>

              {error === "no_ticket" && (
                <div className="mt-4 rounded-lg bg-amber-50 p-4 text-center">
                  <p className="text-sm font-medium text-amber-800">
                    Aucun billet trouvé pour ce numéro.
                  </p>
                  <p className="mt-1 text-xs text-amber-600">
                    Achetez votre billet pour accéder aux contacts de nos exposants.
                  </p>
                  <a
                    href="/foire-paris-2026"
                    className="mt-3 inline-block rounded-[var(--radius-button)] bg-dta-accent px-5 py-2 text-xs font-semibold text-white hover:bg-dta-accent-dark"
                  >
                    Acheter mon billet — à partir de 5 €
                  </a>
                </div>
              )}

              {error === "network" && (
                <p className="mt-3 text-center text-sm text-red-500">
                  Erreur réseau. Veuillez réessayer.
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="mt-4 w-full rounded-[var(--radius-button)] bg-dta-accent py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Vérification..." : "Vérifier mon billet"}
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-dta-taupe hover:text-dta-char"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
