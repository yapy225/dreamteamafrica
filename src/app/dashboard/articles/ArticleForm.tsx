"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const categories = [
  { value: "ACTUALITE", label: "Actualité" },
  { value: "CULTURE", label: "Culture" },
  { value: "DIASPORA", label: "Diaspora" },
  { value: "BUSINESS", label: "Business" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "OPINION", label: "Opinion" },
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
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEditing ? `/api/articles/${initialData.id}` : "/api/articles";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      setError("Erreur réseau.");
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
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Titre</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="Le titre de votre article"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Catégorie</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Extrait <span className="text-dta-taupe">(affiché dans les listes)</span>
        </label>
        <textarea
          required
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className={inputClass}
          placeholder="Un résumé accrocheur de votre article..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Contenu</label>
        <textarea
          required
          rows={15}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="Le contenu complet de votre article. Utilisez des paragraphes séparés par des lignes vides."
        />
        <p className="mt-1 text-xs text-dta-taupe">
          {form.content.length} caractères &middot; ~{Math.ceil(form.content.split(/\s+/).length / 200)} min de lecture
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Image de couverture <span className="text-dta-taupe">(URL, optionnel)</span>
        </label>
        <input
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      {isEditing && (
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
          <span className="text-sm text-dta-char">Article mis en avant</span>
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
