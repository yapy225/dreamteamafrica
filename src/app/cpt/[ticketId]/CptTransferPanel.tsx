"use client";

import { useState } from "react";

type PendingTransfer = {
  id: string;
  toEmail: string;
  toFirstName: string | null;
  expiresAt: string;
  createdAt: string;
};

export default function CptTransferPanel({
  ticketId,
  token,
  eventTitle,
  pendingTransfers: initialPending,
}: {
  ticketId: string;
  token: string;
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
      const res = await fetch(`/api/tickets/${ticketId}/transfer/init?t=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: toEmail.trim(),
          toFirstName: toFirstName.trim() || undefined,
          toLastName: toLastName.trim() || undefined,
          message: message.trim() || undefined,
          token,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi.");
      } else {
        setSuccess("Invitation envoyée !");
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
      const res = await fetch(`/api/transfers/${transferId}/cancel?t=${encodeURIComponent(token)}`, { method: "POST" });
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

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
      {!open ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Céder mon billet</p>
            <p className="mt-1 text-xs text-slate-500">
              Offrez-le à un proche. L&apos;ancien QR sera invalidé.
              {pending.length > 0 && ` ${pending.length} invitation${pending.length > 1 ? "s" : ""} en cours.`}
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-dta-accent hover:text-dta-accent"
          >
            Céder
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Céder — {eventTitle}</p>
            <button onClick={() => { setOpen(false); setError(""); setSuccess(""); }} className="text-xs text-slate-400 hover:text-slate-600">Fermer</button>
          </div>

          {pending.length > 0 && (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="mb-2 text-[11px] font-medium text-amber-800">Invitation{pending.length > 1 ? "s" : ""} en cours</p>
              <ul className="space-y-1.5">
                {pending.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 text-[11px] text-amber-900">
                    <span className="truncate">{t.toFirstName || ""} <span className="text-amber-600">{t.toEmail}</span></span>
                    <button onClick={() => handleCancel(t.id)} className="text-[10px] font-semibold text-red-600 hover:underline">Annuler</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <input type="email" required placeholder="Email du destinataire *" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Prénom" value={toFirstName} onChange={(e) => setToFirstName(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent" />
              <input type="text" placeholder="Nom" value={toLastName} onChange={(e) => setToLastName(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent" />
            </div>
            <textarea placeholder="Message personnel (facultatif)" maxLength={500} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent" />
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-dta-accent px-4 py-2 text-xs font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50">
              {loading ? "Envoi..." : "Envoyer l'invitation"}
            </button>
          </form>
          {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
          {success && <p className="mt-2 text-[11px] text-green-700">{success}</p>}
        </>
      )}
    </div>
  );
}
