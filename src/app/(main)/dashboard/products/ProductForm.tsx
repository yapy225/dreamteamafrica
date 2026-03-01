"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const categories = ["Bijoux", "Mode", "Maroquinerie", "Décoration", "Art", "Textile", "Cosmétiques", "Alimentaire"];
const countries = [
  "Sénégal", "Ghana", "Mali", "Nigeria", "Côte d'Ivoire", "Cameroun", "Kenya",
  "Éthiopie", "Maroc", "Tunisie", "RD Congo", "Burkina Faso", "Bénin", "Togo",
];

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    country: string;
    stock: number;
    published: boolean;
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    images: initialData?.images || [],
    category: initialData?.category || categories[0],
    country: initialData?.country || countries[0],
    stock: initialData?.stock?.toString() || "1",
    published: initialData?.published ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEditing ? `/api/products/${initialData.id}` : "/api/products";
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

      router.push("/dashboard/products");
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
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Nom du produit</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Ex: Collier Akan en or plaqué"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Description</label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
          placeholder="Décrivez votre produit en détail..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Prix (€)</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className={inputClass}
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
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <BunnyCdnInput
        value={form.images[0] || ""}
        onChange={(url) => setForm({ ...form, images: url ? [url] : [] })}
        label="Image du produit"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">Pays d&apos;origine</label>
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className={inputClass}
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
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
            {form.published ? "Publié (visible dans la marketplace)" : "Masqué (brouillon)"}
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
          {isEditing ? "Enregistrer" : "Créer le produit"}
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
