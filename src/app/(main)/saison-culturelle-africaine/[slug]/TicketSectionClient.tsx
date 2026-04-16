"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import TicketSelector from "./TicketSelector";
import SocialProofBanner from "./SocialProofBanner";

interface ProgramSession {
  date: string;
  time: string;
  venue: string;
  address: string;
  title: string;
  type: string;
  pricing: string;
}

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlight: boolean;
  quota: number | null;
  sold: number;
  onSiteOnly?: boolean;
  isCulturePourTous?: boolean;
  cptVariantOf?: string | null;
  deposit?: number | null;
}

interface TicketSectionClientProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventEndDate?: string;
  tiers: Tier[];
  soldOut: boolean;
  sessions: ProgramSession[];
}

function formatSessionDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatSessionDateLong(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export default function TicketSectionClient({
  eventId,
  eventSlug,
  eventTitle,
  eventDate,
  eventEndDate,
  tiers,
  soldOut,
  sessions,
}: TicketSectionClientProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = sessions[selectedIdx];

  const sessionLabel = selected
    ? `${selected.title} — ${formatSessionDateLong(selected.date)}${selected.time ? ` à ${selected.time.replace(":", "h")}` : ""}`
    : undefined;

  /* CPT enabled when at least one tier is marked isCulturePourTous (signal per event) */
  const cptEnabled = tiers.some((t) => t.isCulturePourTous);

  /* Hide CPT tiers themselves — CPT is shown as a 2nd button on every paid parent tier */
  const parentTiers = tiers.filter((t) => !t.isCulturePourTous && !t.cptVariantOf);

  /* When sessions and tiers match 1:1, show only the tier for the selected session */
  const oneToOne = sessions.length > 0 && sessions.length === parentTiers.length;
  const visibleTiers = oneToOne ? [parentTiers[selectedIdx]] : parentTiers;

  return (
    <div>
      {/* Session selector */}
      {sessions.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-center text-sm font-medium text-dta-char">
            Choisissez votre séance
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sessions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`rounded-[var(--radius-card)] border-2 px-4 py-3 text-left transition-all ${
                  selectedIdx === idx
                    ? "border-dta-accent bg-white shadow-[var(--shadow-card)]"
                    : "border-transparent bg-white/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] ${
                      selectedIdx === idx
                        ? "bg-dta-accent text-white"
                        : "bg-dta-accent/10 text-dta-accent"
                    }`}
                  >
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize text-dta-dark">
                      {formatSessionDate(s.date)}
                      {s.time && (
                        <span className="ml-1.5 font-normal text-dta-taupe">
                          {s.time.replace(":", "h")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-dta-char/70 line-clamp-1">
                      {s.title}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected session detail */}
          {selected && (
            <div className="mt-4 rounded-[var(--radius-card)] bg-white/80 px-5 py-4 text-center">
              <p className="font-serif text-lg font-bold text-dta-dark">
                {selected.title}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-dta-taupe">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-dta-accent" />
                  {formatSessionDateLong(selected.date)}
                </span>
                {selected.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-dta-accent" />
                    {selected.time.replace(":", "h")}
                  </span>
                )}
                {selected.venue && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-dta-accent" />
                    {selected.venue}
                  </span>
                )}
              </div>
              {selected.pricing && (
                <p className="mt-1 text-xs text-dta-taupe">
                  {selected.pricing}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Social proof banner — cascades to next tier when current is sold out */}
      {(() => {
        const available = tiers.find(
          (t) => t.quota != null && t.quota > 0 && t.quota - t.sold > 0 && !t.onSiteOnly,
        );
        return available ? (
          <SocialProofBanner sold={available.sold} quota={available.quota!} tierName={available.name} tierPrice={available.price} />
        ) : null;
      })()}

      {/* Culture pour Tous — rappel juste avant les tarifs */}
      {cptEnabled && !soldOut && (
        <div className="mx-auto mt-8 max-w-3xl rounded-[var(--radius-card)] border-2 border-emerald-500 bg-emerald-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xl text-white">
              ✨
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-emerald-900">
                Pas le budget maintenant ? Réservez dès 5 € avec Culture pour Tous
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                Payez seulement <strong>5 € d&apos;acompte aujourd&apos;hui</strong>, rechargez votre billet à votre rythme jusqu&apos;au jour J.
                Même billet, même place. 👉 Cliquez sur <strong>« ✨ CPT dès 5 € »</strong> à côté du tarif de votre choix.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ticket tiers */}
      <div className="mt-10">
        {soldOut ? (
          <div className="mx-auto max-w-md rounded-[var(--radius-card)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <p className="font-serif text-2xl font-bold text-dta-dark">
              Complet
            </p>
            <p className="mt-3 text-sm text-dta-char/70">
              Cet événement affiche complet. Inscrivez-vous pour être notifié en
              cas de désistement.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 ${visibleTiers.length === 1 ? "mx-auto max-w-md" : visibleTiers.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
            {visibleTiers.map((tier) => {
              const tierRemaining = tier.quota != null ? tier.quota - tier.sold : null;
              const tierSoldOut = tierRemaining != null && tierRemaining <= 0;

              return (
              <div
                key={tier.id}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight && !tierSoldOut
                    ? "ring-2 ring-dta-accent md:scale-105"
                    : ""
                } ${tierSoldOut ? "opacity-60" : ""}`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {tier.highlight && !tierSoldOut && (
                    <span className="inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                      Populaire
                    </span>
                  )}
                  {tierSoldOut && (
                    <span className="inline-block rounded-[var(--radius-full)] bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      Épuisé
                    </span>
                  )}
                  {tierRemaining != null && tierRemaining > 0 && tierRemaining <= 20 && (
                    <span className="inline-block rounded-[var(--radius-full)] bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Plus que {tierRemaining} place{tierRemaining > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-bold text-dta-dark">
                    {tier.name}
                  </h3>
                  <span className="font-serif text-2xl font-bold text-dta-accent">
                    {tier.price === 0 ? "Gratuit" : fmtPrice(tier.price)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-dta-char/60">
                  {tier.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-dta-char/70"
                    >
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dta-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.onSiteOnly ? (
                  <div className="mt-4 rounded-[var(--radius-button)] bg-dta-accent/10 py-3 text-center text-sm font-semibold text-dta-accent">
                    Réservation sur place — {fmtPrice(tier.price)}
                  </div>
                ) : tierSoldOut ? (
                  <div className="mt-4 rounded-[var(--radius-button)] bg-gray-100 py-3 text-center text-sm font-medium text-gray-500">
                    Places épuisées
                  </div>
                ) : (
                  <TicketSelector
                    eventId={eventId}
                    eventSlug={eventSlug}
                    tier={tier.id}
                    tierName={tier.name}
                    price={tier.price}
                    highlight={tier.highlight}
                    eventTitle={eventTitle}
                    eventDate={eventDate}
                    eventEndDate={eventEndDate}
                    sessionLabel={sessionLabel}
                    fixedVisitDate={selected?.date ? `${selected.date}T12:00:00Z` : undefined}
                    maxQuantity={tierRemaining != null ? Math.min(10, tierRemaining) : 10}
                    isCulturePourTous={tier.isCulturePourTous}
                    cptVariant={cptEnabled && !tierSoldOut && !tier.onSiteOnly && tier.price > 0 ? {
                      id: tier.id,
                      name: tier.name,
                      price: tier.price,
                      deposit: 5,
                    } : undefined}
                  />
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
