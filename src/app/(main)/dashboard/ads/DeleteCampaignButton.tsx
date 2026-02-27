"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteCampaignButton({
  campaignId,
  campaignTitle,
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer la campagne "${campaignTitle}" ? Cette action est irréversible.`)) return;

    setLoading(true);
    const res = await fetch(`/api/ads/${campaignId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la suppression.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      title="Supprimer"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
