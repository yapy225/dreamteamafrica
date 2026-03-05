"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const CATEGORIES = [
  "ACTUALITE",
  "CULTURE",
  "DIASPORA",
  "BUSINESS",
  "LIFESTYLE",
  "OPINION",
];

export default function AddFeedForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      url: form.get("url"),
      website: form.get("website") || undefined,
      category: form.get("category"),
      region: form.get("region") || undefined,
    };

    const res = await fetch("/api/rss-feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de l'ajout");
      setLoading(false);
      return;
    }

    (e.target as HTMLFormElement).reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-dta-char">
            Nom du media *
          </label>
          <input
            name="name"
            required
            placeholder="Jeune Afrique"
            className="w-full rounded-[var(--radius-button)] border border-dta-taupe/20 px-3 py-2 text-sm focus:border-dta-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-dta-char">
            URL du flux RSS *
          </label>
          <input
            name="url"
            type="url"
            required
            placeholder="https://www.jeuneafrique.com/feed/"
            className="w-full rounded-[var(--radius-button)] border border-dta-taupe/20 px-3 py-2 text-sm focus:border-dta-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-dta-char">
            Site web
          </label>
          <input
            name="website"
            type="url"
            placeholder="https://www.jeuneafrique.com"
            className="w-full rounded-[var(--radius-button)] border border-dta-taupe/20 px-3 py-2 text-sm focus:border-dta-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-dta-char">
            Categorie
          </label>
          <select
            name="category"
            defaultValue="ACTUALITE"
            className="w-full rounded-[var(--radius-button)] border border-dta-taupe/20 px-3 py-2 text-sm focus:border-dta-accent focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-dta-char">
            Region
          </label>
          <input
            name="region"
            placeholder="Afrique de l'Ouest"
            className="w-full rounded-[var(--radius-button)] border border-dta-taupe/20 px-3 py-2 text-sm focus:border-dta-accent focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Ajout en cours..." : "Ajouter le flux"}
      </button>
    </form>
  );
}
