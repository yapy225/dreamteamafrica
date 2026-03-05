"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BunnyCdnInput from "@/components/BunnyCdnInput";

const supportTypes = [
  { value: "IMAGE", label: "Image / Banniere" },
  { value: "VIDEO", label: "Video" },
  { value: "ARTICLE", label: "Article sponsorise" },
  { value: "SATELLITE", label: "Article satellite (SEO)" },
];

const mediaFormats = [
  { value: "SQUARE_1080", label: "Carre — 1080x1080" },
  { value: "LANDSCAPE_1920", label: "Paysage — 1920x1080" },
  { value: "PORTRAIT_1080", label: "Portrait — 1080x1920" },
];

const plans = [
  { value: "ESSENTIEL", label: "Essentiel — 29 \u20ac/mois", desc: "2 pages, rotation basse" },
  { value: "BUSINESS", label: "Business — 79 \u20ac/mois", desc: "Toutes pages + 1 article satellite/mois" },
  { value: "ELITE", label: "Elite — 149 \u20ac/mois", desc: "Toutes pages, positions premium, 3 articles satellites/mois" },
];

const allPages = [
  { value: "ACCUEIL", label: "Accueil" },
  { value: "JOURNAL", label: "Journal (L'Afropeen)" },
  { value: "OFFICIEL", label: "L'Officiel d'Afrique" },
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "EVENEMENTS", label: "Evenements" },
];

const allPlacements = [
  { value: "HERO", label: "Hero Banner (Elite)" },
  { value: "BANNER_TOP", label: "Banniere Top" },
  { value: "INLINE", label: "Inline (entre sections)" },
  { value: "SIDEBAR", label: "Sidebar" },
  { value: "VIDEO_SLOT", label: "Video" },
  { value: "IN_GRID", label: "In-grid (Marketplace)" },
  { value: "INTERSTITIAL", label: "Interstitiel mobile (Elite)" },
];

interface CampaignFormProps {
  initialData?: {
    id: string;
    title: string;
    supportType: string;
    mediaFormat: string;
    plan: string;
    placements: string[];
    pages: string[];
    content: string;
    imageUrl: string | null;
    videoUrl: string | null;
    targetUrl: string;
    ctaText: string | null;
    advertiserName: string | null;
    satelliteKeywords: string[];
    satelliteTargetUrl: string | null;
    active: boolean;
  };
  defaultPlan?: string;
}

export default function CampaignForm({ initialData, defaultPlan }: CampaignFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    supportType: initialData?.supportType || "IMAGE",
    mediaFormat: initialData?.mediaFormat || "LANDSCAPE_1920",
    plan: initialData?.plan || defaultPlan || "ESSENTIEL",
    placements: initialData?.placements || ["INLINE"],
    pages: initialData?.pages || ["ACCUEIL", "JOURNAL"],
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || "",
    videoUrl: initialData?.videoUrl || "",
    targetUrl: initialData?.targetUrl || "",
    ctaText: initialData?.ctaText || "",
    advertiserName: initialData?.advertiserName || "",
    satelliteKeywords: initialData?.satelliteKeywords?.join(", ") || "",
    satelliteTargetUrl: initialData?.satelliteTargetUrl || "",
    active: initialData?.active ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      imageUrl: form.imageUrl || null,
      videoUrl: form.videoUrl || null,
      ctaText: form.ctaText || null,
      advertiserName: form.advertiserName || null,
      satelliteKeywords: form.satelliteKeywords
        ? form.satelliteKeywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
      satelliteTargetUrl: form.satelliteTargetUrl || null,
    };

    try {
      if (isEditing) {
        const res = await fetch(`/api/ads/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
        const createRes = await fetch("/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!createRes.ok) {
          const data = await createRes.json();
          setError(data.error || "Une erreur est survenue.");
          setLoading(false);
          return;
        }
        const campaign = await createRes.json();
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

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Titre de la campagne
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          placeholder="ex : Lancement collection ete 2026"
        />
      </div>

      {/* Advertiser name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Nom de l&apos;annonceur
        </label>
        <input
          value={form.advertiserName}
          onChange={(e) => setForm({ ...form, advertiserName: e.target.value })}
          className={inputClass}
          placeholder="ex : Ma Marque"
        />
      </div>

      {/* Support type + Media format + Plan */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Support</label>
          <select
            value={form.supportType}
            onChange={(e) => setForm({ ...form, supportType: e.target.value })}
            className={inputClass}
          >
            {supportTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">Format media</label>
          <select
            value={form.mediaFormat}
            onChange={(e) => setForm({ ...form, mediaFormat: e.target.value })}
            className={inputClass}
          >
            {mediaFormats.map((f) => (
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
            <p className="mt-1 text-xs text-dta-taupe">
              {plans.find((p) => p.value === form.plan)?.desc}
            </p>
          </div>
        )}
      </div>

      {/* Pages */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Pages ciblees
        </label>
        <div className="flex flex-wrap gap-2">
          {allPages.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setForm({ ...form, pages: toggleArray(form.pages, p.value) })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                form.pages.includes(p.value)
                  ? "bg-dta-accent text-white"
                  : "bg-dta-sand text-dta-char"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Placements */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Emplacements
        </label>
        <div className="flex flex-wrap gap-2">
          {allPlacements.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setForm({ ...form, placements: toggleArray(form.placements, p.value) })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                form.placements.includes(p.value)
                  ? "bg-dta-dark text-white"
                  : "bg-dta-sand text-dta-char"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          Contenu publicitaire
        </label>
        <textarea
          required
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={inputClass}
          placeholder="Le texte de votre publicite..."
        />
      </div>

      {/* Target URL + CTA */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            URL cible
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
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dta-char">
            Texte du bouton <span className="text-dta-taupe">(optionnel)</span>
          </label>
          <input
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            className={inputClass}
            placeholder="ex : Decouvrir"
          />
        </div>
      </div>

      {/* Image + Video */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BunnyCdnInput
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          label="Image"
        />
        {form.supportType === "VIDEO" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Video URL
            </label>
            <input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className={inputClass}
              placeholder="https://cdn.example.com/video.mp4"
            />
          </div>
        )}
      </div>

      {/* Satellite fields */}
      {form.supportType === "SATELLITE" && (
        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-dta-beige/50 p-4 space-y-4">
          <h4 className="text-sm font-semibold text-dta-dark">Options article satellite (SEO)</h4>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              Mots-cles cibles <span className="text-dta-taupe">(separes par des virgules)</span>
            </label>
            <input
              value={form.satelliteKeywords}
              onChange={(e) => setForm({ ...form, satelliteKeywords: e.target.value })}
              className={inputClass}
              placeholder="ex : mode africaine, wax, fashion paris"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dta-char">
              URL cible pour backlinks
            </label>
            <input
              type="url"
              value={form.satelliteTargetUrl}
              onChange={(e) => setForm({ ...form, satelliteTargetUrl: e.target.value })}
              className={inputClass}
              placeholder="https://votre-site.com/page-cible"
            />
          </div>
        </div>
      )}

      {/* Active toggle */}
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

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Enregistrer" : "Creer et payer"}
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
