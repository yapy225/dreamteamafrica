"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const categories = [
  { value: "ACTUALITE", label: "Actualite" },
  { value: "CULTURE", label: "Culture" },
  { value: "DIASPORA", label: "Diaspora" },
  { value: "BUSINESS", label: "Business" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "OPINION", label: "Opinion" },
];

const gradientSwatches = [
  { value: "", label: "Aucun", colors: ["#e5e5e5", "#d4d4d4"] },
  { value: "g1", label: "g1", colors: ["#C4B5A4", "#A69888"] },
  { value: "g2", label: "g2", colors: ["#8B7D6B", "#6E6155"] },
  { value: "g3", label: "g3", colors: ["#6B8FA0", "#4A6B7A"] },
  { value: "g4", label: "g4", colors: ["#A08060", "#846A4E"] },
  { value: "g5", label: "g5", colors: ["#8B6F4E", "#A68B6B"] },
  { value: "g6", label: "g6", colors: ["#7A8B7A", "#687968"] },
  { value: "g7", label: "g7", colors: ["#9B8574", "#897362"] },
  { value: "g8", label: "g8", colors: ["#6B7C8A", "#5A6B78"] },
  { value: "g9", label: "g9", colors: ["#B89F7E", "#A88F6E"] },
  { value: "g10", label: "g10", colors: ["#7A6B5A", "#6B5C4B"] },
  { value: "g11", label: "g11", colors: ["#5A7A6A", "#4A6A5A"] },
  { value: "g12", label: "g12", colors: ["#8A7A6A", "#7A6A5A"] },
];

const statusOptions = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PUBLISHED", label: "Publie" },
  { value: "ARCHIVED", label: "Archive" },
];

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage: string | null;
    featured: boolean;
    gradientClass: string | null;
    isSponsored: boolean;
    sponsorName: string | null;
    status: string;
  };
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "ACTUALITE",
    coverImage: initialData?.coverImage || "",
    featured: initialData?.featured || false,
    gradientClass: initialData?.gradientClass || "",
    isSponsored: initialData?.isSponsored || false,
    sponsorName: initialData?.sponsorName || "",
    status: initialData?.status || "PUBLISHED",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEditing
      ? `/api/articles/${initialData.id}`
      : "/api/articles";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gradientClass: form.gradientClass || null,
          sponsorName: form.sponsorName || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/articles");
      router.refresh();
    } catch {
      setError("Erreur reseau.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Titre
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="Le titre de votre article"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Categorie
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Statut
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Extrait{" "}
          <span className="text-dta-taupe">(affiche dans les listes)</span>
        </label>
        <textarea
          required
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className={inputClass}
          placeholder="Un resume accrocheur de votre article..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Contenu
        </label>
        <textarea
          required
          rows={15}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="Le contenu complet de votre article. Utilisez des paragraphes separes par des lignes vides."
        />
        <p className="mt-1 text-xs text-dta-taupe">
          {form.content.length} caracteres &middot; ~
          {Math.ceil(form.content.split(/\s+/).length / 200)} min de lecture
        </p>
      </div>

      <BunnyCdnInput
        value={form.coverImage}
        onChange={(url) => setForm({ ...form, coverImage: url })}
        label="Image de couverture"
      />

      {/* Gradient picker */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Gradient placeholder{" "}
          <span className="text-dta-taupe">
            (utilise si pas d&apos;image)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {gradientSwatches.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setForm({ ...form, gradientClass: g.value })}
              className={`h-8 w-8 rounded-lg border-2 transition-all ${
                form.gradientClass === g.value
                  ? "border-dta-accent scale-110"
                  : "border-transparent hover:border-dta-sand"
              }`}
              style={{
                background: `linear-gradient(145deg, ${g.colors[0]}, ${g.colors[1]})`,
              }}
              title={g.label}
            />
          ))}
        </div>
        {form.gradientClass && (
          <p className="mt-1 text-xs text-dta-taupe">
            Gradient selectionne : {form.gradientClass}
          </p>
        )}
      </div>

      {/* Toggles row */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, featured: !form.featured })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.featured ? "bg-dta-accent" : "bg-dta-sand"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                form.featured ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-dta-char">En vedette</span>
        </div>

        {/* Sponsored toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, isSponsored: !form.isSponsored })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isSponsored ? "bg-dta-accent" : "bg-dta-sand"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                form.isSponsored ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-dta-char">Article sponsorise</span>
        </div>
      </div>

      {/* Sponsor name (shown when sponsored) */}
      {form.isSponsored && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Nom du sponsor
          </label>
          <input
            value={form.sponsorName}
            onChange={(e) =>
              setForm({ ...form, sponsorName: e.target.value })
            }
            className={inputClass}
            placeholder="Ex: DreamTeam Marketplace"
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Enregistrer" : "Publier l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-[var(--radius-button)] border border-dta-sand px-6 py-3 text-sm font-medium text-dta-char hover:bg-dta-beige"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
