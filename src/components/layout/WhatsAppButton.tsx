"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "33782801852";
const MESSAGE = "Bonjour, je vous contacte depuis le site Dream Team Africa.";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3 sm:px-5 sm:py-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline text-sm font-semibold">Nous contacter</span>
    </a>
  );
}
