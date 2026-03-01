"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const formats = [
  { value: "SPONSORED_ARTICLE", label: "Article sponsorisé" },
  { value: "BANNER", label: "Bannière publicitaire" },
  { value: "VIDEO", label: "Publicité vidéo" },
];

const plans = [
  { value: "STARTER", label: "Starter — 29 €/mois" },
  { value: "PRO", label: "Pro — 79 €/mois" },
  { value: "PREMIUM", label: "Premium — 149 €/mois" },
];

interface CampaignFormProps {
  initialData?: {
    id: string;
    title: string;
    format: string;
    plan: string;
    content: string;
    imageUrl: string | null;
    videoUrl: string | null;
    targetUrl: string;
    active: boolean;
  };
  defaultPlan?: string;
}

export default function CampaignForm({ initialData, defaultPlan }: CampaignFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    format: initialData?.format || "BANNER",
    plan: initialData?.plan || defaultPlan || "STARTER",
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || "",
    videoUrl: initialData?.videoUrl || "",
    targetUrl: initialData?.targetUrl || "",
    active: initialData?.active ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        // Update existing campaign
        const res = await fetch(`/api/ads/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Une erreur est survenue.");
          setLoading(false);
          return;
        }

        router.push("/dashboard/ads");
        router.refresh();
      } else {
        // Create campaign then redirect to checkout
        const createRes = await fetch("/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!createRes.ok) {
          const data = await createRes.json();
          setError(data.error || "Une erreur est survenue.");
          setLoading(false);
          return;
        }

        const campaign = await createRes.json();

        // Redirect to Stripe checkout
        const checkoutRes = await fetch("/api/checkout/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: form.plan, campaignId: campaign.id }),
        });

        if (!checkoutRes.ok) {
          const data = await checkoutRes.json();
          setError(data.error || "Erreur lors du paiement.");
          setLoading(false);
          return;
        }

        const { url } = await checkoutRes.json();
        window.location.href = url;
      }
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
          Titre de la campagne
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="ex : Lancement collection été 2026"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Format</label>
          <select
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
            className={inputClass}
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {!isEditing && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">Plan</label>
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              className={inputClass}
            >
              {plans.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Contenu publicitaire
        </label>
        <textarea
          required
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={inputClass}
          placeholder="Le texte de votre publicité..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          URL cible <span className="text-dta-taupe">(lien vers votre site)</span>
        </label>
        <input
          required
          type="url"
          value={form.targetUrl}
          onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
          className={inputClass}
          placeholder="https://votre-site.com"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BunnyCdnInput
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          label="Image"
        />

        {form.format === "VIDEO" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Vidéo <span className="text-dta-taupe">(URL, optionnel)</span>
            </label>
            <input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className={inputClass}
              placeholder="https://youtube.com/..."
            />
          </div>
        )}
      </div>

      {isEditing && (
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
          <span className="text-sm text-dta-char">Campagne active</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Enregistrer" : "Créer et payer"}
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
