"use client";

import { useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WhatsAppLink({
  surveyId,
  phone,
  name,
  days,
  sent,
}: {
  surveyId: string;
  phone: string;
  name: string;
  days: number[];
  sent: boolean;
}) {
  const [marked, setMarked] = useState(sent);
  const router = useRouter();

  // Build WhatsApp message
  const daysLabel = days.map((d) => (d === 1 ? "1er mai" : "2 mai")).join(" et ");
  const message = encodeURIComponent(
    `Bonjour ${name} !\n\n` +
    `Merci pour votre intérêt pour la *Foire d'Afrique Paris 2026* 🎉\n\n` +
    `Vous avez indiqué être intéressé(e) pour le *${daysLabel}*.\n\n` +
    `Voici nos formules exposant :\n` +
    `• *Pack 1 jour* : 190 € (table + 2 chaises + 2 badges)\n` +
    `• *Pack 2 jours* : 320 € (160 €/jour)\n` +
    `• *Pack Restauration* : 1 000 € (2 tables + 4 chaises + 4 badges)\n\n` +
    `💳 Réservation avec un acompte de 50 €, solde payable en mensualités.\n\n` +
    `Souhaitez-vous réserver votre stand ? Je peux vous envoyer le lien de paiement directement.`
  );

  // Normalize phone for wa.me link
  let cleaned = phone.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "33" + cleaned.slice(1);
  }
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  const waUrl = `https://wa.me/${cleaned}?text=${message}`;

  const handleClick = async () => {
    // Open WhatsApp
    window.open(waUrl, "_blank");

    // Mark as contacted
    if (!marked) {
      try {
        await fetch(`/api/sondage/${surveyId}/sent`, { method: "POST" });
        setMarked(true);
        router.refresh();
      } catch {
        // non-blocking
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-1.5 text-xs font-medium transition-all ${
        marked
          ? "border border-green-300 bg-green-50 text-green-700"
          : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {marked ? <Check size={12} /> : <MessageCircle size={12} />}
      {marked ? "Contacté" : "WhatsApp"}
    </button>
  );
}
