"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader2 } from "lucide-react";

interface TicketSelectorProps {
  eventId: string;
  eventSlug: string;
  tier: string;
  price: number;
  highlight: boolean;
  sessionLabel?: string;
}

export default function TicketSelector({ eventId, tier, price, highlight, sessionLabel }: TicketSelectorProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          tier,
          quantity,
          sessionLabel,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
      }
    } catch {
      alert("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center rounded-[var(--radius-button)] border border-dta-sand">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-dta-char/50 transition-colors hover:text-dta-dark"
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium text-dta-dark">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="px-3 py-2 text-dta-char/50 transition-colors hover:text-dta-dark"
            disabled={quantity >= 10}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full rounded-[var(--radius-button)] px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${
          highlight
            ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
            : "bg-dta-dark text-white hover:bg-dta-char"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Redirection...
          </span>
        ) : (
          price === 0
            ? "Réserver ma place gratuitement"
            : `Acheter — ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price * quantity)}`
        )}
      </button>
    </div>
  );
}
