"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ToggleEventButton({
  eventId,
  published,
}: {
  eventId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark disabled:opacity-50"
      title={published ? "Masquer" : "Publier"}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : published ? (
        <EyeOff size={16} />
      ) : (
        <Eye size={16} />
      )}
    </button>
  );
}
