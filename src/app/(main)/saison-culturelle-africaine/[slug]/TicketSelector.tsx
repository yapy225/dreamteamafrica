"use client";

import { useState, useEffect } from "react";
import PurchasePanel from "./PurchasePanel";

interface CptVariant {
  id: string;
  name: string;
  price: number;
  deposit: number;
}

interface TicketSelectorProps {
  eventId: string;
  eventSlug: string;
  tier: string;
  tierName: string;
  price: number;
  highlight: boolean;
  eventTitle: string;
  eventDate: string;
  eventEndDate?: string;
  sessionLabel?: string;
  fixedVisitDate?: string;
  maxQuantity?: number;
  isCulturePourTous?: boolean;
  cptVariant?: CptVariant;
}

export default function TicketSelector({
  eventId,
  eventSlug,
  tier,
  tierName,
  price,
  highlight,
  eventTitle,
  eventDate,
  eventEndDate,
  sessionLabel,
  fixedVisitDate,
  isCulturePourTous,
  cptVariant,
}: TicketSelectorProps) {
  const [openFull, setOpenFull] = useState(false);
  const [openCpt, setOpenCpt] = useState(false);

  useEffect(() => {
    if (!highlight) return;
    const handler = () => setOpenFull(true);
    window.addEventListener("open-prevente", handler);
    if (window.location.hash === "#billetterie") {
      setTimeout(() => setOpenFull(true), 600);
    }
    return () => window.removeEventListener("open-prevente", handler);
  }, [highlight]);

  const mainLabel = isCulturePourTous
    ? "Réserver avec 5€ — Culture pour Tous"
    : price === 0
    ? "Réserver gratuitement"
    : `Réserver — ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)}`;

  const mainBtnClass = isCulturePourTous
    ? "bg-emerald-600 text-white hover:bg-emerald-700"
    : highlight
    ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
    : "bg-dta-dark text-white hover:bg-dta-char";

  return (
    <>
      <div className={`mt-4 ${cptVariant ? "flex flex-col gap-2 sm:flex-row" : ""}`}>
        <button
          onClick={() => setOpenFull(true)}
          className={`w-full rounded-[var(--radius-button)] px-4 py-3 text-sm font-semibold transition-all duration-200 ${mainBtnClass}`}
        >
          {mainLabel}
        </button>
        {cptVariant && (
          <button
            onClick={() => setOpenCpt(true)}
            className="w-full rounded-[var(--radius-button)] border-2 border-emerald-600 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-50"
            aria-label={`Culture pour Tous dès ${cptVariant.deposit}€`}
          >
            ✨ CPT dès {cptVariant.deposit}€ →
          </button>
        )}
      </div>

      <PurchasePanel
        open={openFull}
        onClose={() => setOpenFull(false)}
        eventId={eventId}
        eventSlug={eventSlug}
        tier={{ id: tier, name: tierName, price, isCulturePourTous }}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventEndDate={fixedVisitDate ? undefined : eventEndDate}
        fixedVisitDate={fixedVisitDate}
      />

      {cptVariant && (
        <PurchasePanel
          open={openCpt}
          onClose={() => setOpenCpt(false)}
          eventId={eventId}
          eventSlug={eventSlug}
          tier={{ id: cptVariant.id, name: cptVariant.name, price: cptVariant.price, isCulturePourTous: true }}
          eventTitle={eventTitle}
          eventDate={eventDate}
          eventEndDate={fixedVisitDate ? undefined : eventEndDate}
          fixedVisitDate={fixedVisitDate}
        />
      )}
    </>
  );
}
