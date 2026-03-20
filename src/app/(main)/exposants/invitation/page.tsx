"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Check, Loader2, AlertCircle } from "lucide-react";

export default function ExposantInvitationPage() {
  const [step, setStep] = useState<"code" | "form" | "success">("code");
  const [code, setCode] = useState("");
  const [couponLabel, setCouponLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileToken, setProfileToken] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    sector: "",
  });

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setCouponLabel(data.label);
        setStep("form");
      } else {
        setError(data.error || "Code invalide.");
      }
    } catch {
      setError("Erreur de connexion.");
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ...form }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setProfileToken(data.profileToken);
        setStep("success");
      } else {
        setError(data.error || "Erreur.");
      }
    } catch {
      setError("Erreur de connexion.");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4">
            <Gift size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Invitation exposant
          </h1>
          <p className="mt-2 text-sm text-dta-char/70">
            Vous avez re&ccedil;u un code d&apos;invitation pour un stand
            gratuit &agrave; la Foire d&apos;Afrique Paris 2026
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]">
          {/* Step 1: Enter code */}
          {step === "code" && (
            <form onSubmit={handleValidateCode} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dta-dark">
                  Code d&apos;invitation
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="DTA-SOLIDAIRE-XXXXXX"
                  required
                  className={inputClass + " text-center font-mono text-lg tracking-wider"}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full rounded-full bg-dta-accent px-6 py-3 font-semibold text-white hover:bg-dta-accent/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="mx-auto animate-spin" />
                ) : (
                  "Valider mon code"
                )}
              </button>
            </form>
          )}

          {/* Step 2: Fill form */}
          {step === "form" && (
            <>
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <Check size={16} className="inline mr-1" />
                <strong>{couponLabel}</strong> — Compl&eacute;tez vos informations
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dta-dark">
                      Pr&eacute;nom *
                    </label>
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dta-dark">
                      Nom *
                    </label>
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dta-dark">
                    Association / Entreprise *
                  </label>
                  <input
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dta-dark">
                    Secteur d&apos;activit&eacute;
                  </label>
                  <input
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    placeholder="Association, Humanitaire, Culture..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dta-dark">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dta-dark">
                    T&eacute;l&eacute;phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  ) : (
                    "Confirmer mon stand gratuit"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-dta-dark mb-2">
                Stand confirm&eacute; !
              </h2>
              <p className="text-dta-char/70 mb-6">
                Votre stand gratuit &agrave; la Foire d&apos;Afrique Paris 2026
                est confirm&eacute;. Compl&eacute;tez maintenant votre fiche
                exposant pour maximiser votre visibilit&eacute;.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/exposants/profil/${profileToken}`}
                  className="rounded-full bg-dta-accent px-6 py-3 font-semibold text-white hover:bg-dta-accent/90 text-center"
                >
                  Compl&eacute;ter ma fiche exposant
                </Link>
                <Link
                  href="/saison-culturelle-africaine/foire-dafrique-paris"
                  className="rounded-full border border-dta-sand px-6 py-3 font-semibold text-dta-char hover:bg-dta-beige text-center"
                >
                  Voir l&apos;&eacute;v&eacute;nement
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
