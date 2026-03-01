"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const TYPES = [
  { value: "article", label: "Article" },
  { value: "interview", label: "Interview" },
  { value: "portrait", label: "Portrait" },
  { value: "guide", label: "Guide" },
];

const CATEGORIES = [
  "Entrepreneuriat",
  "Culture & Art",
  "Mode & Beauté",
  "Gastronomie",
  "Technologie",
  "Diaspora",
  "Sport",
  "Éducation",
];

interface OfficielFormProps {
  initialData?: {
    id: string;
    title: string;
    type: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string;
    published: boolean;
  };
}

export default function OfficielForm({ initialData }: OfficielFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    type: initialData?.type || TYPES[0].value,
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || CATEGORIES[0],
    published: initialData?.published ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEditing
      ? `/api/officiel-afrique/${initialData.id}`
      : "/api/officiel-afrique";
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

      router.push("/dashboard/officiel-afrique");
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
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Titre
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="Ex: Les entrepreneurs africains qui changent le monde"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Catégorie
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Extrait (résumé court)
        </label>
        <textarea
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className={inputClass}
          placeholder="Résumé affiché dans les listes..."
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
          className={`${inputClass} font-mono`}
          placeholder="Rédigez le contenu ici..."
        />
        <p className="mt-1 text-xs text-dta-taupe">
          {form.content.length} caractères
        </p>
      </div>

      <BunnyCdnInput
        value={form.coverImage}
        onChange={(url) => setForm({ ...form, coverImage: url })}
        label="Image de couverture"
      />

      {isEditing && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, published: !form.published })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.published ? "bg-dta-accent" : "bg-dta-sand"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                form.published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-dta-char">
            {form.published ? "Publié (visible sur le site)" : "Brouillon"}
          </span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Enregistrer" : "Créer le contenu"}
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
