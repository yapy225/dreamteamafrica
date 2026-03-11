"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof document !== "undefined" ? document.title : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={shareX}
        className="flex items-center justify-center rounded-[var(--radius-button)] p-2 text-dta-char transition-colors hover:bg-dta-beige hover:text-dta-dark"
        aria-label="Partager sur X"
      >
        <XIcon size={15} />
      </button>
      <button
        onClick={shareFacebook}
        className="flex items-center justify-center rounded-[var(--radius-button)] p-2 text-dta-char transition-colors hover:bg-dta-beige hover:text-[#1877F2]"
        aria-label="Partager sur Facebook"
      >
        <FacebookIcon size={15} />
      </button>
      <button
        onClick={shareLinkedIn}
        className="flex items-center justify-center rounded-[var(--radius-button)] p-2 text-dta-char transition-colors hover:bg-dta-beige hover:text-[#0A66C2]"
        aria-label="Partager sur LinkedIn"
      >
        <LinkedInIcon size={15} />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium text-dta-char transition-colors hover:bg-dta-beige"
        aria-label="Copier le lien"
      >
        {copied ? (
          <>
            <Check size={15} className="text-green-600" />
            <span className="text-green-600 text-xs">Copié !</span>
          </>
        ) : (
          <>
            <Link2 size={15} />
            <span className="hidden text-xs sm:inline">Copier</span>
          </>
        )}
      </button>
    </div>
  );
}
