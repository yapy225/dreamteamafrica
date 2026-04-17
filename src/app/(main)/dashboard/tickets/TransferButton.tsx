"use client";

import { useEffect, useState } from "react";

type PendingTransfer = {
  id: string;
  toEmail: string;
  toFirstName: string | null;
  expiresAt: string;
  createdAt: string;
};

export default function TransferButton({
  ticketId,
  eventTitle,
  pendingTransfers: initialPending,
}: {
  ticketId: string;
  eventTitle: string;
  pendingTransfers: PendingTransfer[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState<PendingTransfer[]>(initialPending);

  const [toEmail, setToEmail] = useState("");
  const [toFirstName, setToFirstName] = useState("");
  const [toLastName, setToLastName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPending(initialPending);
  }, [initialPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!toEmail.trim()) {
      setError("Adresse email du destinataire requise.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/transfer/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: toEmail.trim(),
          toFirstName: toFirstName.trim() || undefined,
          toLastName: toLastName.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi.");
      } else {
        setSuccess("Invitation envoyée ! Le destinataire recevra un email.");
        setPending((p) => [
          ...p,
          {
            id: data.transferId,
            toEmail: toEmail.trim(),
            toFirstName: toFirstName.trim() || null,
            expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
          },
        ]);
        setToEmail("");
        setToFirstName("");
        setToLastName("");
        setMessage("");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (transferId: string) => {
    if (!confirm("Annuler cette invitation de transfert ?")) return;
    try {
      const res = await fetch(`/api/transfers/${transferId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de l'annulation.");
        return;
      }
      setPending((p) => p.filter((t) => t.id !== transferId));
    } catch {
      alert("Erreur réseau.");
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-dta-accent hover:text-dta-accent"
        >
          Céder ce billet
        </button>
        {pending.length > 0 && (
          <p className="text-[10px] text-amber-600">
            {pending.length} invitation{pending.length > 1 ? "s" : ""} en cours
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:min-w-[320px]"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-700">Céder mon billet</p>
        <button
          onClick={() => { setOpen(false); setError(""); setSuccess(""); }}
          className="text-[11px] text-slate-400 hover:text-slate-600"
        >
          Fermer
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="mb-2 text-[11px] font-medium text-amber-800">
            Invitation{pending.length > 1 ? "s" : ""} en cours
          </p>
          <ul className="space-y-1.5">
            {pending.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 text-[11px] text-amber-900">
                <span className="truncate">
                  {t.toFirstName || ""} <span className="text-amber-600">{t.toEmail}</span>
                </span>
                <button
                  onClick={() => handleCancel(t.id)}
                  className="flex-shrink-0 text-[10px] font-semibold text-red-600 hover:underline"
                >
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          required
          placeholder="Email du destinataire *"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Prénom"
            value={toFirstName}
            onChange={(e) => setToFirstName(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
          />
          <input
            type="text"
            placeholder="Nom"
            value={toLastName}
            onChange={(e) => setToLastName(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
          />
        </div>
        <textarea
          placeholder="Message personnel (facultatif)"
          maxLength={500}
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-dta-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading ? "Envoi..." : `Envoyer l'invitation pour ${eventTitle}`}
        </button>
      </form>
      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
      {success && <p className="mt-2 text-[11px] text-green-700">{success}</p>}
      <p className="mt-2 text-[10px] text-slate-400">
        Gratuit. Invitation valide 72h. L&apos;ancien QR code sera invalidé.
      </p>
    </div>
  );
}
