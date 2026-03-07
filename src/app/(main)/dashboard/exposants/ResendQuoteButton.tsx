"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export default function ResendQuoteButton({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleClick = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/exposants/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (res.ok) {
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading" || status === "sent"}
      className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-dta-accent-dark disabled:opacity-50"
    >
      {status === "loading" && <Loader2 size={12} className="animate-spin" />}
      {status === "sent" && <CheckCircle size={12} />}
      {status === "idle" && <Mail size={12} />}
      {status === "error" && <Mail size={12} />}
      {status === "sent" ? "Envoyé" : status === "error" ? "Erreur" : "Devis"}
    </button>
  );
}
