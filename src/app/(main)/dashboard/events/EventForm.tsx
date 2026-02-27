"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    venue: string;
    address: string;
    date: string;
    endDate: string | null;
    capacity: number;
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
    description: initialData?.description || "",
    coverImage: initialData?.coverImage || "",
    venue: initialData?.venue || "",
    address: initialData?.address || "",
    date: initialData?.date || "",
    endDate: initialData?.endDate || "",
    capacity: initialData?.capacity?.toString() || "100",
    priceEarly: initialData?.priceEarly?.toString() || "0",
    priceStd: initialData?.priceStd?.toString() || "0",
    priceVip: initialData?.priceVip?.toString() || "0",
    published: initialData?.published ?? false,
  });
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
    setError("");
    setLoading(true);

    const url = isEditing ? `/api/events/${initialData.id}` : "/api/events";
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

      router.push("/dashboard/events");
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Prix Early Bird (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.priceEarly}
            onChange={(e) => setForm({ ...form, priceEarly: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Prix Standard (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.priceStd}
            onChange={(e) => setForm({ ...form, priceStd: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Prix VIP (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.priceVip}
            onChange={(e) => setForm({ ...form, priceVip: e.target.value })}
            className={inputClass}
          />
        </div>
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
