"use client";

import { useState } from "react";
import Link from "next/link";

export default function CastingPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    height: "",
    measurements: "",
    experience: "",
    instagram: "",
    bookUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          event: "Fashion Week Africa — Paris 2026",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
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
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Candidature envoy&eacute;e !
          </h1>
          <p className="mt-4 text-dta-char/70">
            Merci pour votre candidature. Notre comit&eacute; de
            s&eacute;lection reviendra vers vous rapidement.
          </p>
          <p className="mt-2 text-sm text-dta-char/50">
            Pour toute question : +33 7 51 44 37 74
          </p>
          <Link
            href="/saison-culturelle-africaine/fashion-week-africa"
            className="mt-8 inline-block rounded-full bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Voir la Fashion Week Africa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Casting Mannequins
        </h1>
        <p className="mt-2 text-dta-char/70">
          Fashion Week Africa &mdash; Paris 2026 &middot; 3 octobre 2026
        </p>
        <p className="mt-1 text-sm text-dta-char/50">
          Espace MAS &mdash; Paris 13e
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6 rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]"
      >
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Pr&eacute;nom *
            </label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Nom *
            </label>
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              T&eacute;l&eacute;phone *
            </label>
            <input
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Taille
            </label>
            <input
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="Ex: 175cm"
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Mensurations
            </label>
            <input
              name="measurements"
              value={form.measurements}
              onChange={handleChange}
              placeholder="Ex: 90-60-90"
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Instagram
          </label>
          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="@votre_compte"
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Lien vers votre book / portfolio
          </label>
          <input
            name="bookUrl"
            value={form.bookUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Exp&eacute;rience (d&eacute;fil&eacute;s, shootings, agence...)
          </label>
          <textarea
            name="experience"
            value={form.experience}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez votre expérience dans le mannequinat..."
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-dta-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
        </button>

        <p className="text-center text-xs text-dta-char/50">
          Comit&eacute; de s&eacute;lection : +33 7 51 44 37 74
        </p>
      </form>
    </div>
  );
}
