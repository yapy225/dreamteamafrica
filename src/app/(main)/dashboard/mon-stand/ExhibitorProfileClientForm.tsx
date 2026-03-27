"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Check,
  Loader2,
  Camera,
  AlertCircle,
  Send,
} from "lucide-react";

interface ProfileData {
  id: string;
  token: string;
  submittedAt: string | null;
  companyName: string;
  sector: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  website: string;
  description: string;
  logoUrl: string | null;
  image1Url: string | null;
  image2Url: string | null;
  image3Url: string | null;
  videoUrl: string | null;
  masterclass: boolean;
  daysPresent: string[];
  pack: string;
  events: string[];
}

function FileUploadField({
  label,
  name,
  accept,
  icon: Icon,
  currentUrl,
  onChange,
}: {
  label: string;
  name: string;
  accept: string;
  icon: typeof Camera;
  currentUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else if (file) {
      setPreview(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-dta-dark mb-1.5">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 hover:border-dta-accent transition-colors bg-gray-50 hover:bg-gray-100 p-4 text-center"
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="mx-auto max-h-32 rounded-lg object-contain"
          />
        ) : currentUrl && accept.includes("video") ? (
          <p className="text-sm text-green-600 font-medium">
            <Check size={16} className="inline mr-1" />
            Vidéo uploadée
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon size={28} />
            <span className="text-sm">Cliquez pour choisir un fichier</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

interface BookingInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  sector: string;
  pack: string;
  events: string[];
}

export default function ExhibitorProfileClientForm({
  token,
  booking,
}: {
  token: string;
  booking: BookingInfo;
}) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/exposants/profil?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Impossible de charger le formulaire."))
      .finally(() => setLoading(false));
  }, [token]);

  const buildFormData = (form: HTMLFormElement, isDraft: boolean) => {
    const formData = new FormData(form);
    formData.set("token", token);
    if (isDraft) formData.set("draft", "true");

    for (const [key, file] of Object.entries(files)) {
      if (file) formData.set(key, file);
    }

    formData.set("newsletter", newsletter ? "true" : "false");

    const checkboxes = form.querySelectorAll<HTMLInputElement>(
      'input[name="daysPresent"]'
    );
    formData.delete("daysPresent");
    checkboxes.forEach((cb) => {
      if (cb.checked) formData.append("daysPresent", cb.value);
    });

    return formData;
  };

  const handleSaveDraft = async () => {
    if (!data || !formRef.current) return;
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const formData = buildFormData(formRef.current, true);
      const res = await fetch("/api/exposants/profil", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error || "Erreur lors de la sauvegarde.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
    setSaving(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    setSubmitting(true);
    setError("");

    const formData = buildFormData(e.currentTarget, false);

    try {
      const res = await fetch("/api/exposants/profil", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const result = JSON.parse(text);
          setError(result.error || "Erreur lors de l'envoi (" + res.status + ")");
        } catch {
          setError("Erreur serveur (" + res.status + "). Réduisez la taille de vos images et réessayez.");
        }
      } else {
        const result = await res.json();
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Erreur lors de l'envoi.");
        }
      }
    } catch {
      setError("Erreur de connexion. Vérifiez votre connexion internet et réduisez la taille de vos images.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-dta-accent" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
        <p className="text-lg text-gray-600">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-dta-dark mb-3">
          Fiche envoy&eacute;e !
        </h2>
        <p className="text-dta-taupe max-w-md mx-auto">
          Votre fiche exposant a &eacute;t&eacute; envoy&eacute;e &agrave; notre &eacute;quipe.
          Nous allons la valider et cr&eacute;er vos publications sur nos r&eacute;seaux sociaux.
          Vous serez notifi&eacute;(e) une fois la fiche valid&eacute;e.
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Identité */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Votre identit&eacute;
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Soci&eacute;t&eacute; *
            </label>
            <input
              name="companyName"
              defaultValue={data.companyName}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Secteur d&apos;activit&eacute; *
            </label>
            <input
              name="sector"
              defaultValue={data.sector}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Pr&eacute;nom *
            </label>
            <input
              name="firstName"
              defaultValue={data.firstName}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Nom *
            </label>
            <input
              name="lastName"
              defaultValue={data.lastName}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              T&eacute;l&eacute;phone *
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={data.phone}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Email *
            </label>
            <input
              name="email"
              type="email"
              defaultValue={data.email}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
        </div>
      </fieldset>

      {/* Réseaux sociaux */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          R&eacute;seaux sociaux
        </legend>
        <p className="text-sm text-dta-taupe mt-2 mb-4">
          Vos comptes seront identifi&eacute;s/taggu&eacute;s dans chaque publication.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Facebook
            </label>
            <input
              name="facebook"
              defaultValue={data.facebook}
              placeholder="Nom de page ou lien"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Instagram
            </label>
            <input
              name="instagram"
              defaultValue={data.instagram}
              placeholder="@votre_compte"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              X (Twitter)
            </label>
            <input
              name="twitter"
              defaultValue={data.twitter}
              placeholder="@votre_compte"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              LinkedIn
            </label>
            <input
              name="linkedin"
              defaultValue={data.linkedin}
              placeholder="URL de votre page ou profil"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              TikTok
            </label>
            <input
              name="tiktok"
              defaultValue={data.tiktok}
              placeholder="@votre_compte"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-1">
              Site internet
            </label>
            <input
              name="website"
              defaultValue={data.website || ""}
              placeholder="https://votre-site.com"
              type="url"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
            />
          </div>
        </div>
      </fieldset>
      {/* Logo */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Votre logo
        </legend>
        <div className="mt-4 max-w-sm">
          <FileUploadField
            label="Logo de votre entreprise *"
            name="logo"
            accept="image/*"
            icon={Upload}
            currentUrl={data.logoUrl}
            onChange={(f) => setFiles((p) => ({ ...p, logo: f }))}
          />
          <p className="text-xs text-dta-taupe mt-2">
            Votre logo sera utilis&eacute; comme avatar dans l&apos;Officiel d&apos;Afrique et nos publications.
          </p>
        </div>
      </fieldset>

      {/* Description d'activité */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Description d&apos;activit&eacute;
        </legend>
        <div className="mt-4">
          <label className="block text-sm font-medium text-dta-dark mb-1">
            D&eacute;crivez votre activit&eacute; *
          </label>
          <textarea
            name="description"
            defaultValue={data.description}
            required
            rows={5}
            maxLength={600}
            placeholder="Décrivez votre activité, votre marque, les produits ou services que vous proposez sur votre stand..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-none"
          />
          <p className="text-xs text-dta-taupe mt-1">
            Cette description sera utilis&eacute;e pour vous pr&eacute;senter sur nos
            r&eacute;seaux sociaux et supports de communication.
          </p>
        </div>
      </fieldset>


      {/* Options */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Options
        </legend>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dta-dark mb-2">
              Jours de pr&eacute;sence *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="daysPresent"
                  value="1er-mai"
                  defaultChecked={data.daysPresent.includes("1er-mai")}
                  className="h-4 w-4 rounded border-gray-300 text-dta-accent focus:ring-dta-accent"
                />
                <span className="text-sm">1er mai</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="daysPresent"
                  value="2-mai"
                  defaultChecked={data.daysPresent.includes("2-mai")}
                  className="h-4 w-4 rounded border-gray-300 text-dta-accent focus:ring-dta-accent"
                />
                <span className="text-sm">2 mai</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="masterclass"
                value="true"
                defaultChecked={data.masterclass}
                className="h-4 w-4 rounded border-gray-300 text-dta-accent focus:ring-dta-accent"
              />
              <div>
                <span className="text-sm font-medium text-dta-dark">
                  Je participe &agrave; la masterclass
                </span>
                <p className="text-xs text-dta-taupe">
                  Pr&eacute;sentez votre savoir-faire sur sc&egrave;ne (10-15 min, 15
                  places max)
                </p>
              </div>
            </label>
          </div>
        </div>
      </fieldset>

      {/* Newsletter opt-in */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-dta-accent"
        />
        <span className="text-xs leading-relaxed text-dta-char/70">
          Je souhaite recevoir les actualit&eacute;s, offres et informations de Dream Team Africa par email.
        </span>
      </label>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={saving || submitting}
          className="flex-1 rounded-full border-2 border-dta-sand px-6 py-3.5 font-semibold text-dta-dark transition-all hover:border-dta-accent/40 hover:bg-dta-accent/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sauvegarde...
            </>
          ) : saved ? (
            <>
              <Check size={18} className="text-green-600" />
              Brouillon sauvegard&eacute;
            </>
          ) : (
            <>
              <Upload size={18} />
              Enregistrer le brouillon
            </>
          )}
        </button>
        <button
          type="submit"
          disabled={submitting || saving}
          className="flex-1 rounded-full bg-dta-accent px-6 py-3.5 font-semibold text-white transition-all hover:bg-dta-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={18} />
              Envoyer ma fiche
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-dta-taupe">
        En soumettant ce formulaire, vous autorisez Dream Team Africa &agrave;
        utiliser votre description &agrave; des fins promotionnelles
        sur ses r&eacute;seaux sociaux et m&eacute;dias partenaires.
      </p>
    </form>
  );
}
