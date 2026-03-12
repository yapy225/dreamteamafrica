"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";

export default function GeneratePostsButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/social-drafts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "exposant" }),
      });
      const data = await res.json();
      if (res.ok) {
        setCount(data.generated || 0);
        setStatus("done");
        setTimeout(() => setStatus("idle"), 5000);
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
      disabled={status === "loading"}
      className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-dark px-4 py-2 text-sm font-medium text-white hover:bg-dta-dark/90 disabled:opacity-50"
    >
      {status === "loading" && <Loader2 size={16} className="animate-spin" />}
      {status === "done" && <CheckCircle size={16} />}
      {status === "idle" && <Sparkles size={16} />}
      {status === "error" && <Sparkles size={16} />}
      {status === "loading"
        ? "Génération en cours…"
        : status === "done"
          ? `${count} posts générés`
          : status === "error"
            ? "Erreur"
            : "Générer les posts réseaux sociaux"}
    </button>
  );
}
