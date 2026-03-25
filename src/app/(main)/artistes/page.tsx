"use client";

import { useState } from "react";
import Link from "next/link";

const DISCIPLINES = [
  "Danse traditionnelle",
  "Danse contemporaine",
  "Musique / Percussion",
  "Chant",
  "Conte / Griot",
  "Performance / Spectacle vivant",
  "DJ / Mix",
  "Comédie / Humour",
  "Autre",
];

export default function ArtistesPage() {
  const [honeypot, setHoneypot] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    discipline: "",
    groupName: "",
    country: "",
    description: "",
    videoUrl: "",
    instagram: "",
    facebook: "",
    websiteUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot, newsletter }),
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
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Candidature envoy&eacute;e !
          </h1>
          <p className="mt-4 text-dta-char/70">
            Merci pour votre candidature. Notre &eacute;quipe artistique reviendra vers vous rapidement.
          </p>
          <p className="mt-2 text-sm text-dta-char/50">
            Contact : +33 7 51 44 37 74
          </p>
          <Link
            href="/saison-culturelle-africaine"
            className="mt-8 inline-block rounded-full bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Voir la Saison Culturelle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Appel &agrave; artistes
        </h1>
        <p className="mt-2 text-dta-char/70">
          Saison Culturelle Africaine &mdash; Paris 2026
        </p>
        <p className="mt-1 text-sm text-dta-char/50">
          Danseurs, musiciens, conteurs, performeurs &mdash; rejoignez-nous !
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6 rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]"
      >
        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Pr&eacute;nom *</label>
            <input name="firstName" required value={form.firstName} onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Nom *</label>
            <input name="lastName" required value={form.lastName} onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">T&eacute;l&eacute;phone *</label>
            <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Discipline artistique *</label>
            <select name="discipline" required value={form.discipline} onChange={handleChange}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent">
              <option value="">Choisir...</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Groupe / Compagnie</label>
            <input name="groupName" value={form.groupName} onChange={handleChange} placeholder="Nom du groupe (optionnel)"
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Pays d&apos;origine</label>
          <input name="country" value={form.country} onChange={handleChange} placeholder="Ex: Côte d'Ivoire"
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Pr&eacute;sentez votre art et votre parcours
          </label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            placeholder="Décrivez votre art, votre parcours, vos spectacles..."
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Lien vid&eacute;o (YouTube, Instagram...)</label>
          <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://..."
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Instagram</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@votre_compte"
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Facebook</label>
            <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="Nom de page ou lien"
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent" />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-dta-sand bg-dta-bg p-4 transition-colors hover:border-dta-accent/40">
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-dta-accent" />
          <span className="text-xs leading-relaxed text-dta-char/70">
            Je souhaite recevoir les appels &agrave; artistes, castings et opportunit&eacute;s
            sc&eacute;niques de Dream Team Africa. Conform&eacute;ment au RGPD, je peux me
            d&eacute;sinscrire &agrave; tout moment.
          </span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-dta-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50">
          {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
        </button>

        <p className="text-center text-xs text-dta-char/50">
          Direction artistique : +33 7 51 44 37 74
        </p>
      </form>
    </div>
  );
}
