"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, RefreshCw, Plus, Trash2 } from "lucide-react";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface ProgramItem {
  date: string;
  time: string;
  venue: string;
  address: string;
  type: string;
  title: string;
  director: string;
  synopsis: string;
  price: string;
  pricing: string;
  note: string;
}

const emptyProgramItem: ProgramItem = {
  date: "",
  time: "",
  venue: "",
  address: "",
  type: "Projection du film",
  title: "",
  director: "",
  synopsis: "",
  price: "0",
  pricing: "",
  note: "",
};

interface TierItem {
  id: "EARLY_BIRD" | "STANDARD" | "VIP";
  name: string;
  price: string;
  description: string;
  features: string;
  highlight: boolean;
}

const defaultTiers: TierItem[] = [
  { id: "EARLY_BIRD", name: "Early Bird", price: "0", description: "Accès général — Tarif réduit pour les premiers acheteurs", features: "Accès à l'événement\nBillet nominatif\nProgramme officiel", highlight: false },
  { id: "STANDARD", name: "Standard", price: "0", description: "Billetterie en ligne — Accès complet à l'événement", features: "Accès à l'événement\nBillet nominatif\nProgramme officiel", highlight: true },
  { id: "VIP", name: "Billetterie sur place", price: "0", description: "", features: "Accès à l'événement\nBillet nominatif\nProgramme officiel", highlight: false },
];

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    venue: string;
    address: string;
    date: string;
    endDate: string | null;
    capacity: number;
    showCapacity: boolean;
    program: ProgramItem[] | null;
    tiers: Array<{ id: string; name: string; price: number; description: string; features: string[]; highlight: boolean }> | null;
    priceEarly: number;
    priceStd: number;
    priceVip: number;
    published: boolean;
  };
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    coverImage: initialData?.coverImage || "",
    venue: initialData?.venue || "",
    address: initialData?.address || "",
    date: initialData?.date || "",
    endDate: initialData?.endDate || "",
    capacity: initialData?.capacity?.toString() || "100",
    showCapacity: initialData?.showCapacity ?? true,
    priceEarly: initialData?.priceEarly?.toString() || "0",
    priceStd: initialData?.priceStd?.toString() || "0",
    priceVip: initialData?.priceVip?.toString() || "0",
    published: initialData?.published ?? false,
  });
  const [program, setProgram] = useState<ProgramItem[]>(
    initialData?.program ?? [],
  );
  const [tiers, setTiers] = useState<TierItem[]>(
    initialData?.tiers
      ? initialData.tiers.map((t) => ({
          id: t.id as TierItem["id"],
          name: t.name,
          price: String(t.price),
          description: t.description,
          features: t.features.join("\n"),
          highlight: t.highlight,
        }))
      : defaultTiers.map((t) => ({
          ...t,
          price: t.id === "EARLY_BIRD" ? (initialData?.priceEarly?.toString() || "0")
            : t.id === "STANDARD" ? (initialData?.priceStd?.toString() || "0")
            : (initialData?.priceVip?.toString() || "0"),
        })),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch {
      setError("Erreur lors de l'upload de l'image.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.slug && !SLUG_REGEX.test(form.slug)) {
      setError("Le slug ne doit contenir que des minuscules, chiffres et tirets.");
      return;
    }
    setError("");
    setLoading(true);

    const url = isEditing ? `/api/events/${initialData.id}` : "/api/events";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          program: program.length > 0 ? program : null,
          tiers: tiers.map((t) => ({
            id: t.id,
            name: t.name,
            price: Number(t.price) || 0,
            description: t.description,
            features: t.features.split("\n").map((f) => f.trim()).filter(Boolean),
            highlight: t.highlight,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/events");
      router.refresh();
    } catch (err) {
      console.error("EventForm submit error:", err);
      setError("Erreur réseau.");
    } finally {
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
          Titre de l&apos;événement
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="Ex: Festival International du Cinéma Africain"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Slug (URL)
        </label>
        <div className="flex gap-2">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
              setForm({ ...form, slug: val });
            }}
            className={`${inputClass} font-mono text-xs`}
            placeholder="mon-evenement-2026"
          />
          <button
            type="button"
            onClick={() => setForm({ ...form, slug: toSlug(form.title) })}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-dta-sand px-3 py-2.5 text-xs font-medium text-dta-char hover:bg-dta-beige"
            title="Régénérer depuis le titre"
          >
            <RefreshCw size={14} />
            Régénérer
          </button>
        </div>
        {form.slug && !SLUG_REGEX.test(form.slug) && (
          <p className="mt-1 text-xs text-red-500">
            Le slug ne doit contenir que des minuscules, chiffres et tirets.
          </p>
        )}
        {form.slug && SLUG_REGEX.test(form.slug) && (
          <p className="mt-1 text-xs text-dta-taupe">
            Aperçu : <span className="font-mono text-dta-accent">/evenements/{form.slug}</span>
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Description
        </label>
        <textarea
          required
          rows={10}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
          placeholder="Décrivez l'événement en détail..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Date de début
          </label>
          <input
            required
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Date de fin (optionnel)
          </label>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Lieu
          </label>
          <input
            required
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className={inputClass}
            placeholder="Ex: Palais des Congrès"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Adresse
          </label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={inputClass}
            placeholder="2 place de la Porte Maillot, 75017 Paris"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Capacité
        </label>
        <input
          required
          type="number"
          min="1"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          className={inputClass}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, showCapacity: !form.showCapacity })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.showCapacity ? "bg-dta-accent" : "bg-dta-sand"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                form.showCapacity ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-dta-char">
            {form.showCapacity
              ? "Capacité affichée sur la page publique"
              : "Capacité masquée sur la page publique"}
          </span>
        </div>
      </div>

      {/* Billetterie — 3 tiers */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-dta-char">
          Billetterie — Types de billets
        </label>
        {tiers.map((tier, idx) => (
          <div
            key={tier.id}
            className={`rounded-[var(--radius-card)] border p-4 space-y-3 ${
              tier.highlight ? "border-dta-accent bg-dta-accent/5" : "border-dta-sand bg-dta-bg"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-dta-accent">
                {tier.id === "EARLY_BIRD" ? "Tier 1" : tier.id === "STANDARD" ? "Tier 2" : "Tier 3"}
              </span>
              <label className="flex items-center gap-2 text-xs text-dta-taupe cursor-pointer">
                <input
                  type="radio"
                  name="highlightTier"
                  checked={tier.highlight}
                  onChange={() => {
                    setTiers(tiers.map((t, i) => ({ ...t, highlight: i === idx })));
                  }}
                  className="accent-dta-accent"
                />
                Populaire
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">Nom du billet</label>
                <input
                  value={tier.name}
                  onChange={(e) => {
                    const updated = [...tiers];
                    updated[idx] = { ...tier, name: e.target.value };
                    setTiers(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Early Bird"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">Prix (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tier.price}
                  onChange={(e) => {
                    const updated = [...tiers];
                    updated[idx] = { ...tier, price: e.target.value };
                    setTiers(updated);
                  }}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-dta-taupe">Description</label>
              <input
                value={tier.description}
                onChange={(e) => {
                  const updated = [...tiers];
                  updated[idx] = { ...tier, description: e.target.value };
                  setTiers(updated);
                }}
                className={inputClass}
                placeholder="Ex: Accès général — Tarif réduit"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-dta-taupe">
                Avantages (1 par ligne)
              </label>
              <textarea
                rows={3}
                value={tier.features}
                onChange={(e) => {
                  const updated = [...tiers];
                  updated[idx] = { ...tier, features: e.target.value };
                  setTiers(updated);
                }}
                className={inputClass}
                placeholder={"Accès à l'événement\nBillet nominatif\nProgramme officiel"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Image upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Image de couverture
        </label>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-button)] border border-dta-sand px-4 py-2.5 text-sm font-medium text-dta-char hover:bg-dta-beige">
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {uploading ? "Upload..." : "Choisir un fichier"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
          {form.coverImage && (
            <span className="truncate text-xs text-dta-taupe">
              {form.coverImage}
            </span>
          )}
        </div>
      </div>

      {/* Programme */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-dta-char">
            Programmation
          </label>
          <button
            type="button"
            onClick={() => setProgram([...program, { ...emptyProgramItem }])}
            className="flex items-center gap-1.5 rounded-[var(--radius-button)] border border-dta-sand px-3 py-2 text-xs font-medium text-dta-char hover:bg-dta-beige"
          >
            <Plus size={14} />
            Ajouter une séance
          </button>
        </div>
        {program.length === 0 && (
          <p className="text-xs text-dta-taupe">
            Aucune séance programmée. Cliquez sur &quot;Ajouter une
            séance&quot; pour créer le programme.
          </p>
        )}
        {program.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-[var(--radius-card)] border border-dta-sand bg-dta-bg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-dta-accent">
                Séance {idx + 1}
              </span>
              <button
                type="button"
                onClick={() =>
                  setProgram(program.filter((_, i) => i !== idx))
                }
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Date
                </label>
                <input
                  type="date"
                  value={item.date}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, date: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Heure
                </label>
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, time: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Type
                </label>
                <select
                  value={item.type}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, type: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                >
                  <option>Projection du film</option>
                  <option>Projection du documentaire</option>
                  <option>Concert</option>
                  <option>Conférence</option>
                  <option>Atelier</option>
                  <option>Table ronde</option>
                  <option>Exposition</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Titre de l&apos;oeuvre / séance
                </label>
                <input
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, title: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Dahomey"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Réalisateur / Intervenant
                </label>
                <input
                  value={item.director}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, director: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Mati Diop"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Lieu
                </label>
                <input
                  value={item.venue}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, venue: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Cinéma Kosmos"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Adresse
                </label>
                <input
                  value={item.address}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, address: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="243 ter Av. de la République, 94120 Fontenay-sous-Bois"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-dta-taupe">
                Synopsis
              </label>
              <textarea
                rows={3}
                value={item.synopsis}
                onChange={(e) => {
                  const updated = [...program];
                  updated[idx] = { ...item, synopsis: e.target.value };
                  setProgram(updated);
                }}
                className={inputClass}
                placeholder="Synopsis de l'oeuvre..."
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Prix (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, price: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Label tarif (affiché)
                </label>
                <input
                  value={item.pricing}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, pricing: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Billetterie sur place : 7 €"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-dta-taupe">
                  Note (débat, partenaire...)
                </label>
                <input
                  value={item.note}
                  onChange={(e) => {
                    const updated = [...program];
                    updated[idx] = { ...item, note: e.target.value };
                    setProgram(updated);
                  }}
                  className={inputClass}
                  placeholder="Ex: Projection suivie d'un débat animé par..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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
          {isEditing ? "Enregistrer" : "Créer l'événement"}
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
