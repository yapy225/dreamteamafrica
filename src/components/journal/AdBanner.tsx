"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BannerAd {
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
  const currentWeek = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)));
  return `S${Math.min(currentWeek, weeks)}/${weeks}`;
}

export default function AdBanner() {
  const [ads, setAds] = useState<BannerAd[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fetch ads */
  useEffect(() => {
    fetch("/api/journal-ads/serve?placement=BANNER&limit=6")
      .then((res) => res.json())
      .then((data: BannerAd[]) => {
        if (Array.isArray(data) && data.length > 0) setAds(data);
      })
      .catch(() => {});
  }, []);

  /* Track impressions */
  const trackImpression = useCallback((ad: BannerAd) => {
    if (!trackedRef.current.has(ad.id)) {
      trackedRef.current.add(ad.id);
      fetch("/api/journal-ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id, type: "impression" }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      trackImpression(ads[0]);
    }
  }, [ads, trackImpression]);

  /* Auto-rotate */
  useEffect(() => {
    if (ads.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % ads.length;
          trackImpression(ads[next]);
          return next;
        });
        setFading(false);
      }, 300);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ads, trackImpression]);

  /* Click tracking */
  const handleClick = (ad: BannerAd) => {
    fetch("/api/journal-ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  if (ads.length === 0) return null;

  const ad = ads[activeIndex];

  return (
    <div className="h-[44px] bg-dta-beige">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-1 items-center gap-3 transition-opacity duration-300 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Sponsored badge */}
          <span className="shrink-0 rounded-full bg-dta-sand px-2 py-0.5 text-xs font-medium text-dta-taupe">
            Sponsoris&eacute;
          </span>

          {/* Content */}
          <span className="min-w-0 truncate text-sm text-dta-dark">
            <strong>{ad.title}</strong>
            <span className="ml-1.5 hidden text-dta-char/70 sm:inline">
              {ad.description}
            </span>
          </span>

          {/* CTA */}
          <a
            href={ad.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
            className="shrink-0 rounded-[var(--radius-button)] border border-dta-accent px-3 py-0.5 text-xs font-medium text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
          >
            {ad.ctaText || "En savoir plus"}
          </a>

          {/* Campaign week */}
          <span className="hidden shrink-0 text-[10px] text-dta-taupe lg:inline">
            {campaignWeekLabel(ad.campaignStart, ad.campaignWeeks)}
          </span>
        </div>
      </div>
    </div>
  );
}
