"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const categories = [
  { value: "ACTUALITE", label: "Actualité" },
  { value: "CULTURE", label: "Culture" },
  { value: "CINEMA", label: "Cinéma" },
  { value: "MUSIQUE", label: "Musique" },
  { value: "SPORT", label: "Sport" },
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

const articleTypes = [
  { value: "humain", label: "Article redaction" },
  { value: "ia", label: "Article IA" },
  { value: "sponsorise", label: "Article sponsorise" },
  { value: "invite", label: "Article invite" },
];

import { getAllKeywordsFlat } from "../seo/seo-keywords-data";

const SEO_KEYWORDS_SUGGESTIONS = getAllKeywordsFlat();

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
    authorType: string;
    seoKeywords?: string[];
    metaTitle?: string | null;
    metaDescription?: string | null;
    altText?: string | null;
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
    authorType: initialData?.authorType || "humain",
    seoKeywords: initialData?.seoKeywords || [] as string[],
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    altText: initialData?.altText || "",
  });
  const [kwSearch, setKwSearch] = useState("");
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
          seoKeywords: form.seoKeywords,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          altText: form.altText || null,
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
          Type d&apos;article
        </label>
        <select
          value={form.authorType}
          onChange={(e) => {
            const val = e.target.value;
            setForm({
              ...form,
              authorType: val,
              isSponsored: val === "sponsorise",
            });
          }}
          className={inputClass}
        >
          {articleTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
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

      {/* SEO Keywords */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Mots-cl&eacute;s SEO cibl&eacute;s
        </label>
        {form.seoKeywords.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {form.seoKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-full bg-dta-accent/10 px-2.5 py-1 text-xs font-medium text-dta-accent"
              >
                {kw}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      seoKeywords: form.seoKeywords.filter((k) => k !== kw),
                    })
                  }
                  className="ml-0.5 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={kwSearch}
          onChange={(e) => setKwSearch(e.target.value)}
          placeholder="Rechercher ou taper un mot-cl&eacute;..."
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key === "Enter" && kwSearch.trim()) {
              e.preventDefault();
              const kw = kwSearch.trim().toLowerCase();
              if (!form.seoKeywords.includes(kw)) {
                setForm({ ...form, seoKeywords: [...form.seoKeywords, kw] });
              }
              setKwSearch("");
            }
          }}
        />
        {kwSearch.length >= 2 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {SEO_KEYWORDS_SUGGESTIONS.filter(
              (s) =>
                s.includes(kwSearch.toLowerCase()) &&
                !form.seoKeywords.includes(s)
            )
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, seoKeywords: [...form.seoKeywords, s] });
                    setKwSearch("");
                  }}
                  className="rounded-full border border-dta-sand px-2.5 py-1 text-xs text-dta-char hover:bg-dta-beige"
                >
                  + {s}
                </button>
              ))}
          </div>
        )}
        <p className="mt-1 text-xs text-dta-taupe">
          Tapez Entr&eacute;e pour ajouter un mot-cl&eacute; libre, ou cliquez sur les suggestions.
        </p>
      </div>

      {/* SEO Meta Fields */}
      <div className="rounded-[var(--radius-input)] border border-dta-sand/50 bg-dta-bg/50 p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-dta-taupe">
          SEO avanc&eacute; <span className="font-normal">(optionnel)</span>
        </p>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Meta Title
          </label>
          <input
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className={inputClass}
            placeholder="Titre personnalisé pour Google (laissez vide = titre article)"
            maxLength={70}
          />
          <p className="mt-1 text-xs text-dta-taupe">
            {form.metaTitle.length}/70 caract&egrave;res
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Meta Description
          </label>
          <textarea
            rows={2}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            className={inputClass}
            placeholder="Description personnalisée pour Google (laissez vide = extrait)"
            maxLength={160}
          />
          <p className="mt-1 text-xs text-dta-taupe">
            {form.metaDescription.length}/160 caract&egrave;res
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Texte alternatif image
          </label>
          <input
            value={form.altText}
            onChange={(e) => setForm({ ...form, altText: e.target.value })}
            className={inputClass}
            placeholder="Description de l'image pour l'accessibilité et le SEO"
          />
        </div>
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
