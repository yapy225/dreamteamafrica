"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !rgpd) return;

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
        setMessage("Merci ! Vous recevrez bientôt nos actualités.");
        setEmail("");
        setRgpd(false);
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de se connecter au serveur.");
    }
  }

  return (
    <section ref={ref} className="bg-dta-dark py-20">
      <div
        className={`mx-auto max-w-2xl px-4 text-center transition-all duration-700 sm:px-6 lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dta-accent/20">
          <Mail className="h-6 w-6 text-dta-accent-light" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          Restez informé de nos prochains événements
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          Recevez en avant-première nos dates de balades, offres spéciales et
          nouveautés.
        </p>

        {status === "success" ? (
          <div className="mt-8 flex flex-col items-center gap-2">
            <CheckCircle className="h-10 w-10 text-green-400" />
            <p className="text-sm text-green-400">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
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
                disabled={status === "loading" || !rgpd}
                className="shrink-0 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dta-accent-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Envoi..." : "S'inscrire"}
              </button>
            </div>

            {/* RGPD checkbox */}
            <label className="flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                checked={rgpd}
                onChange={(e) => setRgpd(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-dta-accent"
                required
              />
              <span className="text-xs leading-relaxed text-white/40">
                En cochant cette case, j&apos;accepte de recevoir les
                newsletters de Dream Team Africa et je confirme avoir pris
                connaissance de la{" "}
                <a href="/politique-de-confidentialite" target="_blank" className="underline hover:text-white/60">
                  politique de confidentialité
                </a>. Conformément au
                RGPD, je peux me désinscrire à tout moment.
              </span>
            </label>

            {status === "error" && (
              <p className="text-sm text-red-400">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
