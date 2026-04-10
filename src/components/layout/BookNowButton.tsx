"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Ticket } from "lucide-react";

const EVENT_PATH = "/saison-culturelle-africaine/foire-dafrique-paris";

export default function BookNowButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const isEventPage = pathname === EVENT_PATH;

  useEffect(() => {
    if (!isEventPage) { setVisible(true); return; }
    const check = () => {
      const section = document.getElementById("billetterie");
      if (!section) { setVisible(true); return; }
      const rect = section.getBoundingClientRect();
      // Hide when section top is within 300px of viewport bottom (approaching)
      // or when section is already in/above the viewport
      setVisible(rect.top > window.innerHeight + 100);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [isEventPage]);

  if (!visible) return null;

  const handleClick = () => {
    if (isEventPage) {
      document.getElementById("billetterie")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => window.dispatchEvent(new Event("open-prevente")), 400);
    } else {
      router.push(EVENT_PATH + "#billetterie");
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Réserver mes billets"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-[#D94F30] to-[#C4704B] px-4 py-2.5 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl animate-bounce-slow sm:left-6 sm:translate-x-0 sm:px-5 sm:py-3"
    >
      <Ticket className="h-5 w-5" />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-sm font-bold">Prévente — 10€</span>
        <span className="text-xs font-semibold text-green-200">ou dès 5€ · Culture pour Tous</span>
      </span>
    </button>
  );
}
