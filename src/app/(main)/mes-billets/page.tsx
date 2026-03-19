"use client";

import { useState } from "react";
import Link from "next/link";

export default function MesBilletsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tickets/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Retrouver mes billets
          </h1>
          <p className="mt-2 text-sm text-dta-char/70">
            Entrez l&apos;adresse email utilisée lors de votre achat pour
            recevoir vos billets par email.
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <p className="font-medium text-dta-dark">
                Billets envoyés !
              </p>
              <p className="mt-2 text-sm text-dta-char/70">
                Si des billets sont associés à l&apos;adresse{" "}
                <strong>{email}</strong>, vous les recevrez par email dans
                quelques instants. Pensez à vérifier vos spams.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="mt-6 inline-block text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
              >
                Renvoyer pour une autre adresse
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
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-dta-char"
                >
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
                {loading ? "Envoi en cours..." : "Recevoir mes billets par email"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-dta-char/70">
          <Link
            href="/saison-culturelle-africaine"
            className="font-medium text-dta-accent hover:text-dta-accent-dark"
          >
            Retour aux événements
          </Link>
        </p>
      </div>
    </div>
  );
}
