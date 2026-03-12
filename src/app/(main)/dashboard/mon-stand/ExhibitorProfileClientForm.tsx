"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Check,
  Loader2,
  Camera,
  Video,
  Image as ImageIcon,
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);

    // Add files
    for (const [key, file] of Object.entries(files)) {
      if (file) formData.set(key, file);
    }

    // Ensure daysPresent is sent
    const checkboxes = e.currentTarget.querySelectorAll<HTMLInputElement>(
      'input[name="daysPresent"]'
    );
    formData.delete("daysPresent");
    checkboxes.forEach((cb) => {
      if (cb.checked) formData.append("daysPresent", cb.value);
    });

    try {
      const res = await fetch("/api/exposants/profil", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Erreur lors de l'envoi.");
      }
    } catch {
      setError("Erreur de connexion.");
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
    <form onSubmit={handleSubmit} className="space-y-8">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
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
        </div>
      </fieldset>

      {/* Description */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Votre description
        </legend>
        <div className="mt-4">
          <label className="block text-sm font-medium text-dta-dark mb-1">
            Description en 4 lignes (important !) *
          </label>
          <textarea
            name="description"
            defaultValue={data.description}
            required
            rows={4}
            maxLength={600}
            placeholder="Décrivez votre activité, votre marque, ce que vous proposez..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-none"
          />
          <p className="text-xs text-dta-taupe mt-1">
            Cette description sera utilis&eacute;e pour vous pr&eacute;senter sur nos
            r&eacute;seaux sociaux.
          </p>
        </div>
      </fieldset>

      {/* Médias */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
          Vos visuels
        </legend>
        <p className="text-sm text-dta-taupe mt-2 mb-4">
          Ces visuels seront utilis&eacute;s pour vos publications sur nos r&eacute;seaux.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FileUploadField
            label="Votre logo *"
            name="logo"
            accept="image/*"
            icon={Upload}
            currentUrl={data.logoUrl}
            onChange={(f) => setFiles((p) => ({ ...p, logo: f }))}
          />
          <FileUploadField
            label="Image produit 1 *"
            name="image1"
            accept="image/*"
            icon={ImageIcon}
            currentUrl={data.image1Url}
            onChange={(f) => setFiles((p) => ({ ...p, image1: f }))}
          />
          <FileUploadField
            label="Image produit 2"
            name="image2"
            accept="image/*"
            icon={Camera}
            currentUrl={data.image2Url}
            onChange={(f) => setFiles((p) => ({ ...p, image2: f }))}
          />
          <FileUploadField
            label="Image produit 3"
            name="image3"
            accept="image/*"
            icon={Camera}
            currentUrl={data.image3Url}
            onChange={(f) => setFiles((p) => ({ ...p, image3: f }))}
          />
        </div>
        <div className="mt-4">
          <FileUploadField
            label="Vidéo promo (optionnel)"
            name="video"
            accept="video/*"
            icon={Video}
            currentUrl={data.videoUrl}
            onChange={(f) => setFiles((p) => ({ ...p, video: f }))}
          />
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

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-dta-accent px-6 py-3.5 font-semibold text-white transition-all hover:bg-dta-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} />
            Envoyer ma fiche pour validation
          </>
        )}
      </button>

      <p className="text-center text-xs text-dta-taupe">
        En soumettant ce formulaire, vous autorisez Dream Team Africa &agrave;
        utiliser vos visuels et votre description &agrave; des fins promotionnelles
        sur ses r&eacute;seaux sociaux et m&eacute;dias partenaires.
      </p>
    </form>
  );
}
