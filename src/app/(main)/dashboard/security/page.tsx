"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";

export default function SecurityPage() {
  const [step, setStep] = useState<"idle" | "setup" | "verify" | "enabled">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/account/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("setup");
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/account/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code invalide");
        setLoading(false);
        return;
      }
      setStep("enabled");
      setSuccess("2FA activé avec succès !");
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  };

  const handleDisable = async () => {
    const disableCode = prompt("Entrez votre code 2FA pour désactiver :");
    if (!disableCode) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/account/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: disableCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }
      setStep("idle");
      setSuccess("2FA désactivé.");
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Sécurité du compte</h1>
      <p className="mt-1 text-sm text-slate-500">Protégez votre compte avec l&apos;authentification à deux facteurs (2FA).</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">{success}</div>
        )}

        {step === "idle" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <ShieldOff size={28} className="text-slate-400" />
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900">2FA désactivé</h2>
            <p className="mt-2 text-sm text-slate-500">
              Activez l&apos;authentification à deux facteurs pour renforcer la sécurité de votre compte admin.
            </p>
            <button
              onClick={handleSetup}
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Activer le 2FA
            </button>
          </div>
        )}

        {step === "setup" && (
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900">Configurer le 2FA</h2>
            <p className="mt-2 text-sm text-slate-500">
              Scannez ce QR code avec votre application d&apos;authentification (Google Authenticator, Authy, etc.)
            </p>

            <div className="mt-6 flex justify-center">
              {qrCode && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <img src={qrCode} alt="QR Code 2FA" className="h-48 w-48" />
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">Ou entrez ce code manuellement :</p>
              <p className="mt-1 font-mono text-sm font-bold tracking-widest text-slate-700">{secret}</p>
            </div>

            <form onSubmit={handleVerify} className="mt-8">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Code de vérification
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-slate-900 focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                placeholder="000000"
              />
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="mt-4 w-full rounded-xl bg-dta-accent px-4 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Activer le 2FA"}
              </button>
            </form>
          </div>
        )}

        {step === "enabled" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck size={28} className="text-green-600" />
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900">2FA activé</h2>
            <p className="mt-2 text-sm text-slate-500">
              Votre compte est protégé par l&apos;authentification à deux facteurs.
            </p>
            <button
              onClick={handleDisable}
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <ShieldOff size={16} />
              Désactiver le 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
