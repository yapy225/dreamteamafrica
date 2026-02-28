"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Merci ! Vous recevrez bient\u00f4t nos actualit\u00e9s.");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(
          (data as { error?: string }).error ||
            "Une erreur est survenue. Veuillez r\u00e9essayer."
        );
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de se connecter au serveur.");
    }
  }

  return (
    <section
      id="newsletter"
      className="bg-dta-dark py-16"
    >
      <div className="mx-auto max-w-lg px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-white">
          Restez inform&eacute;
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/40">
          Recevez chaque jour le meilleur de L&apos;Afrop&eacute;en
          directement dans votre bo&icirc;te mail. Un article par jour,
          z&eacute;ro spam.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-[var(--radius-button)] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-dta-accent focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dta-accent-light disabled:opacity-50"
          >
            {status === "loading" ? "Envoi..." : "S\u2019abonner"}
          </button>
        </form>

        {/* Status messages */}
        {status === "success" && (
          <p className="mt-4 text-sm text-green-400">{message}</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">{message}</p>
        )}
      </div>
    </section>
  );
}
