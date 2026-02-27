"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "artisan" ? "ARTISAN" : "USER";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-dta-char/70">
            {defaultRole === "ARTISAN"
              ? "Inscrivez-vous en tant qu'artisan pour vendre vos créations"
              : "Rejoignez la communauté Dream Team Africa"}
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-dta-char">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dta-char">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                placeholder="vous@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-dta-char">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                placeholder="6 caractères minimum"
              />
            </div>

            {/* Role toggle */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dta-char">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "USER" })}
                  className={`rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-medium transition-colors ${
                    form.role === "USER"
                      ? "bg-dta-accent text-white"
                      : "border border-dta-sand text-dta-char hover:bg-dta-beige"
                  }`}
                >
                  Acheteur
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "ARTISAN" })}
                  className={`rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-medium transition-colors ${
                    form.role === "ARTISAN"
                      ? "bg-dta-accent text-white"
                      : "border border-dta-sand text-dta-char hover:bg-dta-beige"
                  }`}
                >
                  Artisan
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[var(--radius-button)] bg-dta-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-dta-char/70">
          Déjà un compte ?{" "}
          <Link href="/auth/signin" className="font-medium text-dta-accent hover:text-dta-accent-dark">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><p className="text-dta-taupe">Chargement...</p></div>}>
      <SignUpForm />
    </Suspense>
  );
}
