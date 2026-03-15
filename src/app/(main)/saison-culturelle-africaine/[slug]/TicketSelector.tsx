"use client";

import { useState } from "react";
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
