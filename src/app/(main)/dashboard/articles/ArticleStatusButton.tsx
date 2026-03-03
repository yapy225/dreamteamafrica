"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Globe, FileText, Archive, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

const transitions: Record<Status, { status: Status; label: string; icon: typeof Globe; className: string }[]> = {
  PUBLISHED: [
    { status: "DRAFT", label: "Brouillon", icon: FileText, className: "hover:bg-gray-50 text-gray-700" },
    { status: "ARCHIVED", label: "Archiver", icon: Archive, className: "hover:bg-amber-50 text-amber-700" },
  ],
  DRAFT: [
    { status: "PUBLISHED", label: "Publier", icon: Globe, className: "hover:bg-green-50 text-green-700" },
    { status: "ARCHIVED", label: "Archiver", icon: Archive, className: "hover:bg-amber-50 text-amber-700" },
  ],
  ARCHIVED: [
    { status: "PUBLISHED", label: "Publier", icon: Globe, className: "hover:bg-green-50 text-green-700" },
    { status: "DRAFT", label: "Brouillon", icon: FileText, className: "hover:bg-gray-50 text-gray-700" },
  ],
};

export default function ArticleStatusButton({
  articleId,
  currentStatus,
}: {
  articleId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleChange = async (newStatus: Status) => {
    setOpen(false);
    setLoading(true);
    const res = await fetch(`/api/articles/${articleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors du changement de statut.");
    }
    setLoading(false);
  };

  const actions = transitions[currentStatus] || [];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark disabled:opacity-50"
        title="Changer le statut"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={16} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-[var(--radius-card)] bg-white py-1 shadow-[var(--shadow-card-hover)]">
          {actions.map(({ status, label, icon: Icon, className }) => (
            <button
              key={status}
              onClick={() => handleChange(status)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${className}`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
