"use client";

import { useState } from "react";

const TABS = [
  { key: "utilisation", label: "Utilisation" },
  { key: "ingredients", label: "Ingr\u00e9dients" },
  { key: "avis", label: "Avis" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ProductTabs({ description }: { description: string }) {
  const [active, setActive] = useState<TabKey>("utilisation");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-[#F0ECE7]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
              active === tab.key
                ? "text-[#C4704B]"
                : "text-[#999] hover:text-[#6B6B6B]"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#C4704B]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {active === "utilisation" && (
          <div className="whitespace-pre-line text-sm leading-relaxed text-[#6B6B6B]">
            {description}
          </div>
        )}

        {active === "ingredients" && (
          <div className="rounded-2xl border border-[#F0ECE7] bg-white p-6 text-center">
            <p className="text-sm text-[#999]">
              Les informations sur les ingr&eacute;dients seront bient&ocirc;t
              disponibles.
            </p>
          </div>
        )}

        {active === "avis" && (
          <div className="rounded-2xl border border-[#F0ECE7] bg-white p-6 text-center">
            <p className="text-sm text-[#999]">
              Aucun avis pour le moment. Soyez le premier &agrave; donner votre
              avis !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
