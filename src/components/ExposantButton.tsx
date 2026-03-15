"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import dynamic from "next/dynamic";

const ExposantPanel = dynamic(() => import("./ExposantPanel"), { ssr: false });

interface ExposantButtonProps {
  eventName: string;
  className?: string;
  size?: number;
}

export default function ExposantButton({
  eventName,
  className = "inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-button)] bg-fuchsia-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-fuchsia-700",
  size = 13,
}: ExposantButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        <Store size={size} />
        Exposer
      </button>
      {open && (
        <ExposantPanel
          eventName={eventName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
