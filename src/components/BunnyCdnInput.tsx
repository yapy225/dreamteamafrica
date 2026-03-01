"use client";

import { useState } from "react";
import Image from "next/image";

interface BunnyCdnInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const BUNNY_CDN_BASE = "https://dreamteamafricamedia.b-cdn.net";

export default function BunnyCdnInput({
  value,
  onChange,
  label = "Image de couverture",
  placeholder = "https://dreamteamafricamedia.b-cdn.net/...",
  required = false,
  className = "",
}: BunnyCdnInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isValidBunnyUrl = (url: string) =>
    url.startsWith(BUNNY_CDN_BASE) && url.length > BUNNY_CDN_BASE.length + 1;

  const handleChange = (url: string) => {
    setError(null);
    setImageLoaded(false);

    if (url && !url.startsWith(BUNNY_CDN_BASE)) {
      setError("L'URL doit commencer par " + BUNNY_CDN_BASE);
    }

    onChange(url);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dta-char">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-3 items-start">
        {/* Aperçu */}
        <div className="flex-shrink-0 w-20 h-20 rounded-[var(--radius-input)] border border-dta-sand overflow-hidden bg-dta-bg flex items-center justify-center">
          {value && isValidBunnyUrl(value) ? (
            <Image
              src={value}
              alt="Aperçu"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(false);
                setError("Image introuvable à cette URL");
              }}
            />
          ) : (
            <svg
              className="w-8 h-8 text-dta-taupe/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Champ URL */}
        <div className="flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-[var(--radius-input)] border bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent transition-colors ${
              error
                ? "border-red-300 bg-red-50"
                : imageLoaded
                  ? "border-green-400 bg-green-50/30"
                  : "border-dta-sand"
            }`}
          />

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

          {imageLoaded && (
            <p className="mt-1 text-xs text-green-600">Image valide</p>
          )}

          <p className="mt-1 text-xs text-dta-taupe">
            Collez l&apos;URL depuis Bunny CDN
          </p>
        </div>
      </div>
    </div>
  );
}
