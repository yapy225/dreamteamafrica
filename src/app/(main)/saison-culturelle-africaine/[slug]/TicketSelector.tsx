"use client";

import { useState, useEffect } from "react";
import PurchasePanel from "./PurchasePanel";

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
}: TicketSelectorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!highlight) return;
    // Open from sticky button event
    const handler = () => setOpen(true);
    window.addEventListener("open-prevente", handler);
    // Open if arriving with #billetterie hash
    if (window.location.hash === "#billetterie") {
      setTimeout(() => setOpen(true), 600);
    }
    return () => window.removeEventListener("open-prevente", handler);
  }, [highlight]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`mt-4 w-full rounded-[var(--radius-button)] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          highlight
            ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
            : "bg-dta-dark text-white hover:bg-dta-char"
        }`}
      >
        {price === 0 ? "Réserver gratuitement" : `Réserver — ${new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(price)}`}
      </button>
      {price > 0 && (
        <button
          onClick={() => { setOpen(true); }}
          className="mt-2 w-full rounded-[var(--radius-button)] border border-green-600 bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700 transition-all duration-200 hover:bg-green-100"
        >
          ou dès 5&nbsp;&euro; · Culture pour Tous
        </button>
      )}

      <PurchasePanel
        open={open}
        onClose={() => setOpen(false)}
        eventId={eventId}
        eventSlug={eventSlug}
        tier={{ id: tier, name: tierName, price }}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventEndDate={fixedVisitDate ? undefined : eventEndDate}
        fixedVisitDate={fixedVisitDate}
      />
    </>
  );
}
