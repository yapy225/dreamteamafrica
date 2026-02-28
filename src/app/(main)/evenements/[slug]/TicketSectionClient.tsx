"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import TicketSelector from "./TicketSelector";

interface ProgramSession {
  date: string;
  time: string;
  venue: string;
  address: string;
  title: string;
  type: string;
  price?: number | string;
  pricing: string;
}

interface Tier {
  id: "EARLY_BIRD" | "STANDARD" | "VIP";
  name: string;
  price: number;
  description: string;
  features: string[];
  highlight: boolean;
}

interface TicketSectionClientProps {
  eventId: string;
  eventSlug: string;
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
  tiers,
  soldOut,
  sessions,
}: TicketSectionClientProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = sessions[selectedIdx];

  const sessionLabel = selected
    ? `${selected.title} — ${formatSessionDateLong(selected.date)}${selected.time ? ` à ${selected.time.replace(":", "h")}` : ""}`
    : undefined;

  // Does the selected session have its own price?
  const rawPrice = selected?.price;
  const sessionPrice =
    rawPrice != null && rawPrice !== "" && !isNaN(Number(rawPrice))
      ? Number(rawPrice)
      : null;

  return (
    <div>
      {/* Session selector */}
      {sessions.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-center text-sm font-medium text-dta-char">
            Choisissez votre séance
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sessions.map((s, idx) => {
              const numPrice = s.price != null && s.price !== "" && !isNaN(Number(s.price)) ? Number(s.price) : null;
              const hasPrice = numPrice !== null;
              return (
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
                        {hasPrice && (
                          <span className="ml-1 font-semibold text-dta-accent">
                            — {numPrice === 0 ? "Gratuit" : fmtPrice(numPrice!)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
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
              {sessionPrice !== null && (
                <p className="mt-3 font-serif text-2xl font-bold text-dta-accent">
                  {sessionPrice === 0 ? "Gratuit" : fmtPrice(sessionPrice)}
                </p>
              )}
              {selected.pricing && (
                <p className="mt-1 text-xs text-dta-taupe">
                  {selected.pricing}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ticket purchase */}
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
        ) : sessionPrice !== null ? (
          /* Session has its own price → single ticket card */
          <div className="mx-auto max-w-md rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-2 ring-dta-accent">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                {selected.title}
              </h3>
              <span className="font-serif text-2xl font-bold text-dta-accent">
                {sessionPrice === 0 ? "Gratuit" : fmtPrice(sessionPrice)}
              </span>
            </div>
            <p className="mt-1 text-xs text-dta-char/60">
              {formatSessionDateLong(selected.date)}
              {selected.time && ` à ${selected.time.replace(":", "h")}`}
              {selected.venue && ` — ${selected.venue}`}
            </p>
            {selected.pricing && (
              <p className="mt-2 text-xs text-dta-taupe">{selected.pricing}</p>
            )}
            <TicketSelector
              key={selectedIdx}
              eventId={eventId}
              eventSlug={eventSlug}
              tier="STANDARD"
              price={sessionPrice}
              highlight
              sessionLabel={sessionLabel}
              sessionPrice={sessionPrice}
            />
          </div>
        ) : (
          /* No session price → classic 3 tiers */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight
                    ? "ring-2 ring-dta-accent md:scale-105"
                    : ""
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    Populaire
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-bold text-dta-dark">
                    {tier.name}
                  </h3>
                  <span className="font-serif text-2xl font-bold text-dta-accent">
                    {fmtPrice(tier.price)}
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
                <TicketSelector
                  eventId={eventId}
                  eventSlug={eventSlug}
                  tier={tier.id}
                  price={tier.price}
                  highlight={tier.highlight}
                  sessionLabel={sessionLabel}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
