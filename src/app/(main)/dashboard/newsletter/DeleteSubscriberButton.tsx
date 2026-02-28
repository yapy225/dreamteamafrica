"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteSubscriberButtonProps {
  subscriberId: string;
  subscriberEmail: string;
}

export default function DeleteSubscriberButton({
  subscriberId,
  subscriberEmail,
}: DeleteSubscriberButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer l'abonne ${subscriberEmail} ?`)) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/newsletter/${subscriberId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      title="Supprimer"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
