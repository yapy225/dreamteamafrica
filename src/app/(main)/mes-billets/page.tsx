"use client";

import { useState } from "react";
import Link from "next/link";

interface TicketInfo {
  id: string;
  eventTitle: string;
  venue: string;
  address: string;
  date: string;
  visitDate: string | null;
  tier: string;
  price: number;
  firstName: string | null;
  lastName: string | null;
  qrCode: string | null;
}

export default function MesBilletsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketInfo[] | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTickets(null);

    try {
      // Try lookup first (shows QR codes directly)
      const res = await fetch("/api/tickets/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      } else {
        const data = await res.json();
        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
        } else {
          setError("Aucun billet trouvé pour cette adresse email.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    }

    setLoading(false);
  };

  const tierLabels: Record<string, string> = {
    EARLY_BIRD: "Early Bird",
    LAST_CHANCE: "Last Chance",
    STANDARD: "Standard",
    VIP: "VIP",
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Retrouver mes billets
          </h1>
          <p className="mt-2 text-sm text-dta-char/70">
            Entrez l&apos;adresse email utilisée lors de votre achat pour
            afficher vos billets.
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
          {tickets ? (
            <div>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="font-medium text-dta-dark">
                  {tickets.length} billet{tickets.length > 1 ? "s" : ""} trouvé{tickets.length > 1 ? "s" : ""}
                </p>
                <p className="mt-1 text-sm text-dta-char/70">
                  Enregistrez les QR codes sur votre téléphone
                </p>
              </div>

              <div className="space-y-6">
                {tickets.map((ticket, i) => (
                  <div key={ticket.id} className="rounded-xl border border-dta-sand bg-dta-bg p-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-dta-accent">
                      {tierLabels[ticket.tier] || ticket.tier}
                    </p>
                    <p className="mt-1 font-serif text-lg font-bold text-dta-dark">
                      {ticket.eventTitle}
                    </p>
                    <p className="mt-1 text-xs text-dta-char/70">
                      {ticket.firstName} {ticket.lastName}
                    </p>
                    {ticket.qrCode && (
                      <div className="mt-4">
                        <img
                          src={ticket.qrCode}
                          alt={`QR Code Billet ${i + 1}`}
                          className="mx-auto h-48 w-48 rounded-lg border border-dta-sand"
                        />
                        <a
                          href={ticket.qrCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-xs font-medium text-dta-accent hover:text-dta-accent-dark"
                        >
                          Ouvrir en grand / Télécharger
                        </a>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-dta-char/70">
                      <span>{ticket.venue}</span>
                      <span>•</span>
                      <span>{ticket.price?.toFixed(2)} €</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setTickets(null); setEmail(""); }}
                className="mt-6 w-full text-center text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
              >
                Chercher avec une autre adresse
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dta-char">
                  Email utilisé lors de l&apos;achat
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                  placeholder="vous@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[var(--radius-button)] bg-dta-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
              >
                {loading ? "Recherche..." : "Retrouver mes billets"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-dta-char/70">
          <Link href="/saison-culturelle-africaine" className="font-medium text-dta-accent hover:text-dta-accent-dark">
            Retour aux événements
          </Link>
        </p>
      </div>
    </div>
  );
}
