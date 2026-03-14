"use client";

import { useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SendSurveyButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState("");
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const router = useRouter();

  const handleSend = async () => {
    const list = emails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));

    if (list.length === 0) {
      alert("Aucun email valide.");
      return;
    }

    if (!confirm(`Envoyer le sondage à ${list.length} adresse${list.length > 1 ? "s" : ""} ?`)) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/sondage/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: list }),
      });
      const data = await res.json();
      setResult(data);
      router.refresh();
    } catch {
      alert("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-semibold text-white hover:bg-dta-accent-dark"
      >
        <Send size={14} />
        Envoyer le sondage
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Envoyer le sondage par email
              </h3>
              <button onClick={() => { setOpen(false); setResult(null); }} className="text-dta-taupe hover:text-dta-dark">
                <X size={18} />
              </button>
            </div>

            <p className="mb-3 text-xs text-dta-char/70">
              Collez les adresses email (une par ligne, ou s&eacute;par&eacute;es par des virgules).
            </p>

            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={6}
              placeholder={"exposant1@email.com\nexposant2@email.com\nexposant3@email.com"}
              className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
            />

            <p className="mt-1 text-xs text-dta-taupe">
              {emails.split(/[\n,;]+/).filter((e) => e.trim().includes("@")).length} email(s) d&eacute;tect&eacute;(s)
            </p>

            {result && (
              <div className="mt-3 rounded-lg bg-dta-bg p-3 text-sm">
                <span className="font-medium text-green-600">{result.sent} envoy&eacute;(s)</span>
                {result.failed > 0 && (
                  <span className="ml-2 font-medium text-red-600">{result.failed} &eacute;chou&eacute;(s)</span>
                )}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={loading || !emails.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
