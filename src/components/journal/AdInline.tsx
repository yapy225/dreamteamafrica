"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Megaphone } from "lucide-react";

interface InlineAd {
  id: string;
  title: string;
  description: string;
  ctaText: string | null;
  ctaUrl: string;
  imageUrl: string | null;
  gradientClass: string | null;
  campaignWeeks: number;
  campaignStart: string;
}

function campaignWeekLabel(start: string, weeks: number): string {
  const startDate = new Date(start);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const currentWeek = Math.max(
    1,
    Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7))
  );
  return `S${Math.min(currentWeek, weeks)}/${weeks}`;
}

export default function AdInline() {
  const [ad, setAd] = useState<InlineAd | null>(null);
  const trackedRef = useRef(false);

  /* Fetch */
  useEffect(() => {
    fetch("/api/journal-ads/serve?placement=INLINE&limit=1")
      .then((res) => res.json())
      .then((data: InlineAd[]) => {
        if (Array.isArray(data) && data.length > 0) setAd(data[0]);
      })
      .catch(() => {});
  }, []);

  /* Track impression */
  useEffect(() => {
    if (ad && !trackedRef.current) {
      trackedRef.current = true;
      fetch("/api/journal-ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id, type: "impression" }),
      }).catch(() => {});
    }
  }, [ad]);

  const handleClick = () => {
    if (!ad) return;
    fetch("/api/journal-ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  if (!ad) return null;

  return (
    <a
      href={ad.ctaUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className="group relative grid grid-cols-1 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-px hover:shadow-[var(--shadow-card-hover)] sm:grid-cols-2"
    >
      {/* Left: Visual */}
      <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden">
        {ad.imageUrl ? (
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div
            className={`absolute inset-0 ${ad.gradientClass ?? "j-g5"}`}
          />
        )}
        <Megaphone
          size={48}
          className="relative z-10 text-white/30"
        />

        {/* Badge top-left */}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          Encart sponsoris&eacute;
        </span>
      </div>

      {/* Right: Content */}
      <div className="relative flex flex-col justify-center p-6">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-dta-taupe">
          DTA ADS
        </span>
        <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
          {ad.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
          {ad.description}
        </p>
        <span className="mt-4 inline-flex w-fit rounded-[var(--radius-button)] bg-dta-dark px-5 py-2 text-sm font-medium text-white transition-colors group-hover:bg-dta-accent">
          {ad.ctaText || "D\u00e9couvrir"}
        </span>

        {/* Campaign week bottom-right */}
        <span className="absolute bottom-3 right-3 text-[10px] text-dta-taupe">
          {campaignWeekLabel(ad.campaignStart, ad.campaignWeeks)}
        </span>
      </div>
    </a>
  );
}
