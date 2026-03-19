"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function SendInviteButton({
  email,
  contactName,
  companyName,
  profileToken,
}: {
  email: string;
  contactName: string;
  companyName: string;
  profileToken: string;
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/admin/exhibitor-invites/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contactName, companyName, profileToken }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-button)] bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
        <Mail size={12} /> Envoyé
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 rounded-[var(--radius-button)] px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        error
          ? "border border-red-300 bg-red-50 text-red-600"
          : "border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
      }`}
    >
      <Mail size={12} />
      {loading ? "Envoi..." : error ? "Réessayer" : "Envoyer fiche"}
    </button>
  );
}
