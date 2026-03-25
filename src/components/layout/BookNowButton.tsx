"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";

export default function BookNowButton() {
  return (
    <Link
      href="/saison-culturelle-africaine/foire-dafrique-paris"
      aria-label="Réserver mes billets"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D94F30] to-[#C4704B] px-4 py-2.5 sm:px-5 sm:py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl animate-bounce-slow"
    >
      <Ticket className="h-5 w-5" />
      <span className="text-sm font-bold">Last Chance — 7€</span>
      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-red-700 animate-ping-slow">50</span>
      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-red-700">50</span>
    </Link>
  );
}
