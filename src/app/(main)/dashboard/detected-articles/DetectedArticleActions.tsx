"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, RefreshCw, ExternalLink, Eye } from "lucide-react";

export default function DetectedArticleActions({
  articleId,
  status,
  sourceUrl,
  publishedArticleId,
}: {
  articleId: string;
  status: string;
  sourceUrl: string;
  publishedArticleId?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function retry() {
    setLoading(true);
    await fetch(`/api/detected-articles/${articleId}/retry`, {
      method: "POST",
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Supprimer cet article detecte ?")) return;
    setLoading(true);
    await fetch(`/api/detected-articles/${articleId}`, {
      method: "DELETE",
    });
    setLoading(false);
    router.refresh();
  }

  async function ignore() {
    setLoading(true);
    await fetch(`/api/detected-articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "IGNORED" }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
        title="Voir l'original"
      >
        <ExternalLink size={16} />
      </a>

      {publishedArticleId && (
        <a
          href={`/dashboard/articles/${publishedArticleId}/edit`}
          className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
          title="Voir l'article publie"
        >
          <Eye size={16} />
        </a>
      )}

      {(status === "ERROR" || status === "IGNORED") && (
        <button
          onClick={retry}
          disabled={loading}
          className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
          title="Relancer le traitement"
        >
          <RefreshCw size={16} />
        </button>
      )}

      {status === "PENDING" && (
        <button
          onClick={ignore}
          disabled={loading}
          className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
          title="Ignorer"
        >
          <RefreshCw size={16} className="rotate-180" />
        </button>
      )}

      <button
        onClick={remove}
        disabled={loading}
        className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
