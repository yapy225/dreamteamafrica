"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Star, Send, CheckCircle } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

function ClickableStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hover || value)
                ? "fill-dta-accent text-dta-accent"
                : "fill-transparent text-dta-sand"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "fill-dta-accent text-dta-accent"
              : "fill-dta-sand text-dta-sand"
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || rating === 0) {
      setStatus("error");
      setErrorMsg("Veuillez remplir tous les champs et sélectionner une note.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        const newComment = (await res.json()) as Comment;
        setComments((prev) => [newComment, ...prev]);
        setName("");
        setEmail("");
        setRating(0);
        setMessage("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus("error");
        setErrorMsg(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Impossible de se connecter au serveur.");
    }
  }

  return (
    <section ref={ref} className="bg-dta-beige py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mx-auto mb-4 h-px w-16 bg-dta-accent" />
          <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
            Laissez-nous votre commentaire
          </h2>
          <p className="mt-3 text-sm text-dta-char/60">
            Votre avis compte et aide notre communauté à grandir.
          </p>
        </div>

        {/* Form */}
        <div
          className={`rounded-[var(--radius-card)] border border-dta-sand/50 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-700 delay-200 sm:p-8 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {status === "success" && (
            <div className="mb-6 flex items-center gap-2 rounded-[var(--radius-input)] bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Merci pour votre avis ! Il a bien été enregistré.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="comment-name"
                  className="mb-1.5 block text-xs font-medium text-dta-char/70"
                >
                  Nom
                </label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full rounded-[var(--radius-input)] border border-dta-sand/70 bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe/60 focus:border-dta-accent focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="comment-email"
                  className="mb-1.5 block text-xs font-medium text-dta-char/70"
                >
                  Email
                </label>
                <input
                  id="comment-email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full rounded-[var(--radius-input)] border border-dta-sand/70 bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe/60 focus:border-dta-accent focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-dta-char/70">
                Note
              </label>
              <ClickableStars value={rating} onChange={setRating} />
            </div>

            <div>
              <label
                htmlFor="comment-message"
                className="mb-1.5 block text-xs font-medium text-dta-char/70"
              >
                Message
              </label>
              <textarea
                id="comment-message"
                required
                rows={4}
                placeholder="Partagez votre expérience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                className="w-full resize-none rounded-[var(--radius-input)] border border-dta-sand/70 bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe/60 focus:border-dta-accent focus:outline-none disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dta-accent-light disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {status === "loading" ? "Envoi..." : "Envoyer mon avis"}
            </button>
          </form>
        </div>

        {/* Comments list */}
        {comments.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-semibold text-dta-char/70">
              {comments.length} avis
            </h3>
            {comments.map((c, i) => (
              <div
                key={c.id}
                className={`rounded-[var(--radius-card)] border border-dta-sand/50 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-500 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dta-accent/10 text-xs font-semibold text-dta-accent">
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-dta-dark">
                        {c.name}
                      </span>
                      <span className="text-xs text-dta-taupe">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <StarDisplay rating={c.rating} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-dta-char/80">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
