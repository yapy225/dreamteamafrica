"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Send,
  Trash2,
  RefreshCw,
  Pencil,
  Sparkles,
  CheckCheck,
} from "lucide-react";

/* ───────── Single Draft Actions ───────── */

export function DraftActions({
  draftId,
  status,
  content,
  editedContent,
  postUrl,
}: {
  draftId: string;
  status: string;
  content: string;
  editedContent?: string | null;
  postUrl?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(editedContent || content);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    await fetch(`/api/admin/social-drafts/${draftId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  async function saveEdit() {
    setLoading(true);
    await fetch(`/api/admin/social-drafts/${draftId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editedContent: editText }),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function publish() {
    setLoading(true);
    await fetch("/api/admin/social-drafts/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Supprimer ce brouillon ?")) return;
    setLoading(true);
    await fetch(`/api/admin/social-drafts/${draftId}`, {
      method: "DELETE",
    });
    setLoading(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="mt-3 space-y-2">
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={4}
          className="w-full rounded-[var(--radius-card)] border border-dta-taupe/30 bg-white px-3 py-2 text-sm text-dta-dark focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
        />
        <div className="flex gap-2">
          <button
            onClick={saveEdit}
            disabled={loading}
            className="rounded-[var(--radius-button)] bg-dta-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-[var(--radius-button)] bg-dta-beige px-3 py-1.5 text-xs font-medium text-dta-char hover:bg-dta-taupe/20"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      {status === "DRAFT" && (
        <>
          <button
            onClick={() => updateStatus("APPROVED")}
            disabled={loading}
            className="rounded-[var(--radius-button)] p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
            title="Approuver"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => setEditing(true)}
            disabled={loading}
            className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark disabled:opacity-50"
            title="Modifier"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading}
            className="rounded-[var(--radius-button)] p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
            title="Rejeter"
          >
            <X size={16} />
          </button>
        </>
      )}

      {status === "APPROVED" && (
        <>
          <button
            onClick={publish}
            disabled={loading}
            className="rounded-[var(--radius-button)] p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            title="Publier maintenant"
          >
            <Send size={16} />
          </button>
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading}
            className="rounded-[var(--radius-button)] p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
            title="Rejeter"
          >
            <X size={16} />
          </button>
        </>
      )}

      {status === "POSTED" && postUrl && (
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[var(--radius-button)] p-2 text-blue-600 hover:bg-blue-50"
          title="Voir le post"
        >
          <Send size={16} />
        </a>
      )}

      {(status === "REJECTED" || status === "FAILED") && (
        <button
          onClick={() => updateStatus("DRAFT")}
          disabled={loading}
          className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
          title="Remettre en brouillon"
        >
          <RefreshCw size={16} />
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

/* ───────── Quick Actions (top bar) ───────── */

export function QuickActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generateOfficiel() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social-drafts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "officiel" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`${data.count} brouillon(s) genere(s)`);
      } else {
        alert(data.error || "Erreur lors de la generation");
      }
    } catch {
      alert("Erreur reseau");
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={generateOfficiel}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
      >
        <Sparkles size={16} />
        Generer commentaires
      </button>
    </div>
  );
}

/* ───────── Bulk Approve ───────── */

export function BulkApproveButton({ draftIds }: { draftIds: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function bulkApprove() {
    if (draftIds.length === 0) return;
    if (
      !confirm(`Approuver ${draftIds.length} brouillon(s) ?`)
    )
      return;

    setLoading(true);
    await Promise.all(
      draftIds.map((id) =>
        fetch(`/api/admin/social-drafts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "APPROVED" }),
        })
      )
    );
    setLoading(false);
    router.refresh();
  }

  if (draftIds.length === 0) return null;

  return (
    <button
      onClick={bulkApprove}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      <CheckCheck size={16} />
      Approuver tout ({draftIds.length})
    </button>
  );
}
