"use client";

import { useState } from "react";

export function ParrainageActions({ code, lien }: { code: string; lien: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lien);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Rejoins DreamTeamAfrica !",
        text: `Utilise mon code ${code} pour recevoir 4 NTBC bonus !`,
        url: lien,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={handleCopy}
        className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
      >
        {copied ? "✅ Copié !" : "Copier le lien"}
      </button>
      <button
        onClick={handleShare}
        className="rounded-xl bg-[#0D2B1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1a4a35]"
      >
        Partager
      </button>
    </div>
  );
}
