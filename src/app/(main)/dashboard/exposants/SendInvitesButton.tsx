"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function SendInvitesButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  const handleClick = async () => {
    if (!confirm("Envoyer l'email d'invitation à tous les exposants qui n'ont pas encore rempli leur fiche ?")) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/exhibitor-invites", {
        method: "POST",
      });
      const data = await res.json();
      setResult({ sent: data.sent, failed: data.failed });
    } catch {
      setResult({ sent: 0, failed: -1 });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <Mail size={14} />
        {loading ? "Envoi..." : "Envoyer les fiches"}
      </button>
      {result && (
        <span className="text-xs text-dta-char/70">
          {result.failed === -1
            ? "Erreur"
            : `${result.sent} envoyé(s)${result.failed > 0 ? `, ${result.failed} échoué(s)` : ""}`}
        </span>
      )}
    </div>
  );
}
