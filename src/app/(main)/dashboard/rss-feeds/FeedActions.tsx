"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function FeedActions({
  feedId,
  active,
}: {
  feedId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/rss-feeds/${feedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setLoading(false);
    router.refresh();
  }

  async function deleteFeed() {
    if (!confirm("Supprimer ce flux et tous ses articles detectes ?")) return;
    setLoading(true);
    await fetch(`/api/rss-feeds/${feedId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      <button
        onClick={toggleActive}
        disabled={loading}
        className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark disabled:opacity-50"
        title={active ? "Desactiver" : "Activer"}
      >
        {active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} />}
      </button>
      <button
        onClick={deleteFeed}
        disabled={loading}
        className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
