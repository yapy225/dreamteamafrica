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
} from "lucide-react";

/** Compress image client-side to max 1.5MB before upload */
async function compressImage(file: File, maxSizeMB = 1.5): Promise<File> {
  if (file.type === "video/mp4" || file.type.startsWith("video/")) return file;
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Max 1920px
      const MAX = 1920;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.8,
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

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

export default function ExhibitorProfileForm({ token }: { token: string }) {
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

    // Validate required files (logo, image1, image2, image3)
    const requiredFiles = ["logo", "image1", "image2", "image3"];
    for (const key of requiredFiles) {
      const hasExisting = key === "logo" ? data.logoUrl
        : key === "image1" ? data.image1Url
        : key === "image2" ? data.image2Url
        : data.image3Url;
      if (!files[key] && !hasExisting) {
        const labels: Record<string, string> = { logo: "Logo", image1: "Image 1", image2: "Image 2", image3: "Image 3" };
        setError(`Le champ "${labels[key]}" est obligatoire.`);
        setSubmitting(false);
        return;
      }
    }

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);

    // Add files (compressed)
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const compressed = await compressImage(file);
        formData.set(key, compressed);
      }
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
      if (!res.ok) {
        const text = await res.text();
        try {
          const result = JSON.parse(text);
          setError(result.error || "Erreur lors de l'envoi (" + res.status + ")");
        } catch {
          setError("Erreur serveur (" + res.status + "). Veuillez réessayer ou réduire la taille de vos images.");
        }
      } else {
        const result = await res.json();
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Erreur lors de l'envoi.");
        }
      }
    } catch (err) {
      setError("Erreur de connexion. Vérifiez votre connexion internet et réessayez. Si le problème persiste, réduisez la taille de vos images.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-dta-accent" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark mb-3">
            Merci !
          </h1>
          <p className="text-dta-taupe">
            Votre profil exposant a été enregistré avec succès. Notre équipe
            utilisera ces informations pour assurer votre visibilité sur nos
            réseaux sociaux et nos supports de communication.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-dta-taupe mb-2">
          Foire d&apos;Afrique Paris — 6ème Édition
        </p>
        <h1 className="font-serif text-3xl font-bold text-dta-dark mb-2">
          Profil Exposant
        </h1>
        <p className="text-dta-taupe">
          Renseignez vos informations pour bénéficier de votre visibilité sur
          nos réseaux sociaux (Facebook, Instagram, X, LinkedIn) et nos médias
          (L&apos;Afropéen, L&apos;Officiel d&apos;Afrique).
        </p>
      </div>

      {data.submittedAt && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 flex items-center gap-2">
          <Check size={16} />
          Profil déjà soumis. Vous pouvez le mettre à jour ci-dessous.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identité */}
        <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
          <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
            Votre identité
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label className="block text-sm font-medium text-dta-dark mb-1">
                Société *
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
                Secteur d&apos;activité *
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
                Prénom *
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
                Téléphone *
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
            Réseaux sociaux
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label className="block text-sm font-medium text-dta-dark mb-1">
                Facebook *
              </label>
              <input
                name="facebook"
                defaultValue={data.facebook}
                required
                placeholder="Nom de page ou lien"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dta-dark mb-1">
                Instagram *
              </label>
              <input
                name="instagram"
                defaultValue={data.instagram}
                required
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
              Cette description sera utilisée pour vous présenter sur nos
              réseaux sociaux.
            </p>
          </div>
        </fieldset>

        {/* Médias */}
        <fieldset className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
          <legend className="text-sm font-semibold uppercase tracking-wider text-dta-accent px-2">
            Vos visuels
          </legend>
          <p className="text-sm text-dta-taupe mt-2 mb-4">
            Ces visuels seront utilisés pour vos publications sur nos réseaux.
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
              label="Image 1 *"
              name="image1"
              accept="image/*"
              icon={ImageIcon}
              currentUrl={data.image1Url}
              onChange={(f) => setFiles((p) => ({ ...p, image1: f }))}
            />
            <FileUploadField
              label="Image 2 *"
              name="image2"
              accept="image/*"
              icon={Camera}
              currentUrl={data.image2Url}
              onChange={(f) => setFiles((p) => ({ ...p, image2: f }))}
            />
            <FileUploadField
              label="Image 3 *"
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
                Jours de présence *
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
                    Je participe à la masterclass
                  </span>
                  <p className="text-xs text-dta-taupe">
                    Présentez votre savoir-faire sur scène (10-15 min, 15
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
              <Upload size={18} />
              Envoyer mon profil
            </>
          )}
        </button>

        <p className="text-center text-xs text-dta-taupe">
          En soumettant ce formulaire, vous autorisez Dream Team Africa à
          utiliser vos visuels et votre description à des fins promotionnelles
          sur ses réseaux sociaux et médias partenaires.
        </p>
      </form>
    </div>
  );
}
