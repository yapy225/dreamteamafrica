"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface SidebarAd {
  id: string;
  title: string;
  description: string;
  ctaText: string | null;
  ctaUrl: string;
  imageUrl: string | null;
  gradientClass: string | null;
}

export default function AdSidebar() {
  const [ads, setAds] = useState<SidebarAd[]>([]);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const trackedRef = useRef<Set<string>>(new Set());

  /* Fetch sidebar ads */
  useEffect(() => {
    fetch("/api/journal-ads/serve?placement=SIDEBAR&limit=6")
      .then((res) => res.json())
      .then((data: SidebarAd[]) => {
        if (Array.isArray(data) && data.length > 0) setAds(data);
      })
      .catch(() => {});
  }, []);

  /* Track impressions */
  const trackImpression = useCallback((ad: SidebarAd) => {
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
    ads.slice(0, 3).forEach(trackImpression);
  }, [ads, trackImpression]);

  /* Rotate 3rd slot if more than 3 ads */
  useEffect(() => {
    if (ads.length <= 3) return;

    const extraAds = ads.slice(2); // index 2+
    const timer = setInterval(() => {
      setRotatingIndex((prev) => {
        const next = (prev + 1) % extraAds.length;
        trackImpression(extraAds[next]);
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [ads, trackImpression]);

  const handleClick = (ad: SidebarAd) => {
    fetch("/api/journal-ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  if (ads.length === 0) return null;

  /* Build display list: first 2 fixed, 3rd rotates */
  const displayAds: SidebarAd[] = [];
  if (ads[0]) displayAds.push(ads[0]);
  if (ads[1]) displayAds.push(ads[1]);
  if (ads.length > 2) {
    const extraAds = ads.slice(2);
    displayAds.push(extraAds[rotatingIndex % extraAds.length]);
  }

  return (
    <div className="flex flex-col gap-4">
      {displayAds.map((ad, i) => (
        <a
          key={`${ad.id}-${i}`}
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => handleClick(ad)}
          className="group block overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
        >
          {/* Image / gradient */}
          <div className="relative h-32 overflow-hidden">
            {ad.imageUrl ? (
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="280px"
              />
            ) : (
              <div
                className={`absolute inset-0 ${ad.gradientClass ?? "j-g5"}`}
              />
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <h4 className="font-serif text-sm font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
              {ad.title}
            </h4>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dta-char/70">
              {ad.description}
            </p>
            <span className="mt-2 inline-block text-xs font-semibold text-dta-accent">
              {ad.ctaText || "En savoir plus"} &rarr;
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
