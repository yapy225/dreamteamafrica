"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      totpCode: needsTotp ? totpCode : "",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes("TOTP_REQUIRED")) {
        setNeedsTotp(true);
        setError("");
      } else if (result.error.includes("TOTP_INVALID")) {
        setError("Code 2FA incorrect.");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-dta-char/70">
            Acc&eacute;dez &agrave; votre espace Dream Team Africa
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-dta-sand px-4 py-3 text-sm font-medium text-dta-char transition-colors hover:bg-dta-beige"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dta-sand" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-dta-taupe">ou</span>
            </div>
          </div>

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {!needsTotp ? (
              <>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dta-char">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                    placeholder="••••••••"
                  />
                  <div className="mt-1.5 text-right">
                    <Link href="/auth/forgot-password" className="text-xs text-dta-accent hover:text-dta-accent-dark">
                      Mot de passe oubli&eacute; ?
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                  <p className="text-sm font-medium text-amber-800">&#x1F512; V&eacute;rification en deux &eacute;tapes</p>
                  <p className="mt-1 text-xs text-amber-600">Entrez le code &agrave; 6 chiffres de votre application d&apos;authentification</p>
                </div>
                <label htmlFor="totp" className="mb-1.5 block text-sm font-medium text-dta-char">
                  Code 2FA
                </label>
                <input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-dta-dark focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                  placeholder="000000"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setNeedsTotp(false); setTotpCode(""); setError(""); }}
                  className="mt-3 text-xs text-dta-accent hover:text-dta-accent-dark"
                >
                  &larr; Retour
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[var(--radius-button)] bg-dta-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? "Connexion..." : needsTotp ? "V\u00e9rifier" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-dta-char/70">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="font-medium text-dta-accent hover:text-dta-accent-dark">
            Cr&eacute;er un compte
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-dta-char/70">
          <Link href="/mes-billets" className="font-medium text-dta-accent hover:text-dta-accent-dark">
            Retrouver mes billets par email
          </Link>
        </p>
      </div>
    </div>
  );
}
