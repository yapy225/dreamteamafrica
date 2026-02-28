"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const placements = [
  { value: "BANNER", label: "Bannière" },
  { value: "INLINE", label: "En ligne" },
  { value: "VIDEO", label: "Vidéo" },
  { value: "SIDEBAR", label: "Barre latérale" },
];

const gradientOptions = [
  { value: "", label: "Aucun" },
  { value: "j-g1", label: "G1" },
  { value: "j-g2", label: "G2" },
  { value: "j-g3", label: "G3" },
  { value: "j-g4", label: "G4" },
  { value: "j-g5", label: "G5" },
  { value: "j-g6", label: "G6" },
  { value: "j-g7", label: "G7" },
  { value: "j-g8", label: "G8" },
  { value: "j-g9", label: "G9" },
  { value: "j-g10", label: "G10" },
  { value: "j-g11", label: "G11" },
  { value: "j-g12", label: "G12" },
];

interface JournalAdFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    placement: string;
    ctaText: string | null;
    ctaUrl: string;
    imageUrl: string | null;
    gradientClass: string | null;
    iconSvg: string | null;
    price: string | null;
    advertiserName: string | null;
    campaignWeeks: number;
    active: boolean;
  };
}

export default function JournalAdForm({ initialData }: JournalAdFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    placement: initialData?.placement || "BANNER",
    ctaText: initialData?.ctaText || "",
    ctaUrl: initialData?.ctaUrl || "",
    imageUrl: initialData?.imageUrl || "",
    gradientClass: initialData?.gradientClass || "",
    iconSvg: initialData?.iconSvg || "",
    price: initialData?.price || "",
    advertiserName: initialData?.advertiserName || "",
    campaignWeeks: initialData?.campaignWeeks ?? 4,
    active: initialData?.active ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEditing
      ? `/api/journal-ads/${initialData.id}`
      : "/api/journal-ads";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ctaText: form.ctaText || null,
          imageUrl: form.imageUrl || null,
          gradientClass: form.gradientClass || null,
          iconSvg: form.iconSvg || null,
          price: form.price || null,
          advertiserName: form.advertiserName || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/journal-ads");
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
          placeholder="Titre de la publicité"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Description
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
          placeholder="Texte descriptif de la publicité..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Emplacement
        </label>
        <select
          value={form.placement}
          onChange={(e) => setForm({ ...form, placement: e.target.value })}
          className={inputClass}
        >
          {placements.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Texte du CTA{" "}
            <span className="text-dta-taupe">(optionnel)</span>
          </label>
          <input
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            className={inputClass}
            placeholder="En savoir plus"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            URL du CTA
          </label>
          <input
            required
            type="url"
            value={form.ctaUrl}
            onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Image URL <span className="text-dta-taupe">(optionnel)</span>
        </label>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Dégradé <span className="text-dta-taupe">(optionnel)</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {gradientOptions.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setForm({ ...form, gradientClass: g.value })}
              className={`flex h-10 items-center gap-2 rounded-[var(--radius-button)] border px-3 text-xs font-medium transition-colors ${
                form.gradientClass === g.value
                  ? "border-dta-accent ring-1 ring-dta-accent"
                  : "border-dta-sand hover:border-dta-taupe"
              }`}
            >
              {g.value ? (
                <span
                  className={`${g.value} inline-block h-5 w-5 rounded-full`}
                />
              ) : null}
              <span className="text-dta-char">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Nom de l&apos;annonceur{" "}
            <span className="text-dta-taupe">(optionnel)</span>
          </label>
          <input
            value={form.advertiserName}
            onChange={(e) => setForm({ ...form, advertiserName: e.target.value })}
            className={inputClass}
            placeholder="Nom de la marque"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Prix affiché{" "}
            <span className="text-dta-taupe">(optionnel)</span>
          </label>
          <input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
            placeholder="12.90 EUR"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Icône SVG{" "}
          <span className="text-dta-taupe">(optionnel — markup SVG)</span>
        </label>
        <textarea
          rows={3}
          value={form.iconSvg}
          onChange={(e) => setForm({ ...form, iconSvg: e.target.value })}
          className={inputClass}
          placeholder='<svg viewBox="0 0 24 24">...</svg>'
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Durée de campagne{" "}
          <span className="text-dta-taupe">(semaines)</span>
        </label>
        <input
          required
          type="number"
          min={1}
          value={form.campaignWeeks}
          onChange={(e) =>
            setForm({ ...form, campaignWeeks: parseInt(e.target.value) || 1 })
          }
          className={inputClass}
          placeholder="4"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, active: !form.active })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.active ? "bg-dta-accent" : "bg-dta-sand"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              form.active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm text-dta-char">Publicité active</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Enregistrer" : "Créer la publicité"}
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
