"use client";

import { useState } from "react";
import { Store, Phone, Mail, User, Lock, Unlock, Ticket, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Exposant {
  id: string;
  name: string;
  sector: string;
  description: string | null;
  logo: string | null;
  contact: string;
  phone: string;
  email: string;
}

function maskPhone(p: string) {
  if (!p || p.length < 5) return p;
  return p.slice(0, -4) + "****";
}

function maskEmail(e: string) {
  if (!e || e.includes("@exposant.temp")) return "";
  const [local, domain] = e.split("@");
  if (!domain) return e;
  return local.slice(0, 3) + "***@" + domain;
}

export default function ExposantGrid({ exposants }: { exposants: Exposant[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-ticket-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();

      if (data.ok) {
        setUnlocked(true);
        setFirstName(data.firstName || "");
        setShowModal(false);
      } else {
        setError("no_ticket");
      }
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!unlocked && (
        <div className="mb-8 flex items-center justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark transition-colors"
          >
            <Lock size={16} />
            Débloquer les contacts des exposants
          </button>
        </div>
      )}

      {unlocked && (
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-medium text-green-700">
            <Unlock size={16} />
            {firstName ? `Bienvenue ${firstName}` : "Contacts débloqués"} ✅
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exposants.map((e) => (
          <Link
            key={e.id}
            href={unlocked ? `/nos-exposants/${e.id}` : "#"}
            onClick={(ev) => {
              if (!unlocked) {
                ev.preventDefault();
                setShowModal(true);
              }
            }}
            className="flex gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-dta-sand/30">
              {e.logo ? (
                <Image
                  src={e.logo}
                  alt={e.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <Store size={24} className="text-dta-accent" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                {e.name}
              </h3>
              {e.sector && (
                <p className="mt-0.5 text-sm font-medium text-dta-accent">
                  {e.sector}
                </p>
              )}
              {e.description && (
                <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                  {e.description}
                </p>
              )}
              <div className="mt-2 space-y-0.5 text-xs text-dta-taupe">
                {e.contact && (
                  <p className="flex items-center gap-1.5">
                    <User size={12} className="text-dta-accent/50" />
                    {e.contact}
                  </p>
                )}
                {e.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-dta-accent/50" />
                    {unlocked ? e.phone : maskPhone(e.phone)}
                  </p>
                )}
                {e.email && !e.email.includes("@exposant.temp") && (
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} className="text-dta-accent/50" />
                    {unlocked ? e.email : maskEmail(e.email)}
                  </p>
                )}
                {!unlocked && (
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-dta-accent">
                    <Lock size={10} /> Billet requis pour voir les contacts
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/10">
                <Ticket size={28} className="text-dta-accent" />
              </div>
              <h2 className="font-serif text-xl font-bold text-dta-dark">
                Accéder aux contacts
              </h2>
              <p className="mt-2 text-sm text-dta-char/70">
                Entrez le numéro de téléphone utilisé lors de votre achat de billet.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(ev) => { setPhone(ev.target.value); setError(""); }}
                  className="w-full rounded-lg border border-dta-sand py-3 pl-10 pr-4 text-sm focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                  autoFocus
                />
              </div>

              {error === "no_ticket" && (
                <div className="mt-4 rounded-lg bg-amber-50 p-4 text-center">
                  <p className="text-sm font-medium text-amber-800">
                    Aucun billet trouvé pour ce numéro.
                  </p>
                  <p className="mt-1 text-xs text-amber-600">
                    Achetez votre billet pour accéder aux contacts de nos exposants.
                  </p>
                  <a
                    href="/culture-pour-tous"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-green-600 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-600 hover:text-white"
                  >
                    <Sparkles size={14} /> Dès 5€
                  </a>
                </div>
              )}

              {error === "network" && (
                <p className="mt-3 text-center text-sm text-red-500">
                  Erreur réseau. Veuillez réessayer.
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="mt-4 w-full rounded-[var(--radius-button)] bg-dta-accent py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Vérification..." : "Vérifier mon billet"}
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-dta-taupe hover:text-dta-char"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
