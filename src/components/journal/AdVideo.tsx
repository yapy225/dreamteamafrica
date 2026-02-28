"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { campaignProgress } from "@/lib/journal";

interface VideoAd {
  id: string;
  title: string;
  description: string;
  ctaText: string | null;
  ctaUrl: string;
  imageUrl: string | null;
  gradientClass: string | null;
  advertiserName: string | null;
  campaignWeeks: number;
  campaignStart: string;
}

function brandInitials(name: string | null): string {
  if (!name) return "AD";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function AdVideo() {
  const [ad, setAd] = useState<VideoAd | null>(null);
  const trackedRef = useRef(false);

  /* Fetch */
  useEffect(() => {
    fetch("/api/journal-ads/serve?placement=VIDEO&limit=1")
      .then((res) => res.json())
      .then((data: VideoAd[]) => {
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

  const progress = campaignProgress(ad.campaignStart, ad.campaignWeeks);

  return (
    <div className="overflow-hidden rounded-xl bg-[#222] shadow-[var(--shadow-card)]">
      {/* Badge */}
      <div className="flex items-center gap-2 px-5 pt-4">
        <span className="j-pulse inline-block h-2 w-2 rounded-full bg-red-500" />
        <span className="text-xs font-medium text-white/70">
          Vid&eacute;o sponsoris&eacute;e
        </span>
      </div>

      {/* Video area */}
      <div className="relative mx-5 mt-3 aspect-[16/4] overflow-hidden rounded-lg bg-black/40">
        {/* Centered play button */}
        <button
          aria-label="Lire la vid\u00e9o"
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20">
            <Play size={20} className="text-white" fill="white" />
          </div>
        </button>

        {/* Simulated progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-dta-accent"
            style={{
              animation: "j-video-progress 30s linear infinite",
              width: "0%",
            }}
          />
        </div>

        {/* Inline keyframes for progress bar */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes j-video-progress {
                from { width: 0%; }
                to { width: 100%; }
              }
            `,
          }}
        />
      </div>

      {/* Bottom info */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Brand logo area — initials from advertiserName */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <span className="text-xs font-bold text-white/60">
            {brandInitials(ad.advertiserName)}
          </span>
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-base font-bold text-white">
            {ad.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/50">
            {ad.advertiserName ? `${ad.advertiserName} \u00b7 ` : ""}{ad.description}
          </p>
        </div>

        {/* CTA + campaign week */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={ad.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleClick}
            className="rounded-[var(--radius-button)] border border-dta-accent px-4 py-1.5 text-xs font-medium text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
          >
            {ad.ctaText || "D\u00e9couvrir"}
          </a>
          <span className="hidden text-[10px] text-white/30 lg:inline">
            {progress.label}
          </span>
        </div>
      </div>
    </div>
  );
}
