"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Ad {
  id: string;
  title: string;
  format: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  targetUrl: string;
}

export default function SponsoredArticle() {
  const [ads, setAds] = useState<Ad[]>([]);
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/ads/serve?format=SPONSORED_ARTICLE&limit=1")
      .then((res) => res.json())
      .then((data: Ad[]) => {
        if (Array.isArray(data)) setAds(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    ads.forEach((ad) => {
      if (!trackedRef.current.has(ad.id)) {
        trackedRef.current.add(ad.id);
        fetch("/api/ads/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaignId: ad.id, type: "impression" }),
        }).catch(() => {});
      }
    });
  }, [ads]);

  const handleClick = (ad: Ad) => {
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  if (ads.length === 0) return null;

  const ad = ads[0];

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => handleClick(ad)}
      className="group block overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
    >
      {ad.imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>
      )}

      <div className="p-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-dta-accent">
          Article sponsorisé
        </p>
        <h3 className="font-serif text-lg font-semibold text-dta-dark group-hover:text-dta-accent">
          {ad.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
          {ad.content}
        </p>
        <span className="mt-3 inline-block text-xs font-semibold text-dta-accent">
          En savoir plus &rarr;
        </span>
      </div>
    </a>
  );
}
