"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ValidateProfileButton({ profileId }: { profileId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    setStatus("loading");
    setMessage("Génération des posts...");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    try {
      const res = await fetch("/api/admin/social-drafts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "exposant", profileId }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();

      if (res.ok) {
        setMessage(`${data.generated || 0} posts générés`);
        setStatus("done");
        router.refresh();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setMessage(data.error || "Erreur");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      clearTimeout(timeout);
      setMessage("Timeout ou erreur réseau");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="flex items-center gap-1 rounded-[var(--radius-button)] bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
      title="Valider et générer les posts réseaux sociaux"
    >
      {status === "loading" && <Loader2 size={12} className="animate-spin" />}
      {status === "done" && <CheckCircle size={12} />}
      {status === "idle" && <Sparkles size={12} />}
      {status === "error" && <Sparkles size={12} />}
      {status === "done" ? message : status === "error" ? message : "Valider"}
    </button>
  );
}
