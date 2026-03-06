"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium text-dta-char transition-colors hover:bg-dta-beige"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-600" />
          <span className="text-green-600">Lien copié !</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span className="hidden sm:inline">Partager</span>
        </>
      )}
    </button>
  );
}
