"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  format: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  targetUrl: string;
}

export default function AdBanner({ format = "BANNER" }: { format?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/ads/serve?format=${format}&limit=1`)
      .then((res) => res.json())
      .then((data: Ad[]) => {
        if (Array.isArray(data)) setAds(data);
      })
      .catch(() => {});
  }, [format]);

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
      className="group relative block overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-r from-dta-dark to-dta-char shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-4 p-4 sm:p-5">
        {ad.imageUrl && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-dta-accent">
            Sponsorisé
          </p>
          <h4 className="mt-0.5 truncate text-sm font-semibold text-white group-hover:text-dta-sand">
            {ad.title}
          </h4>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/60">
            {ad.content}
          </p>
        </div>

        <ExternalLink size={16} className="flex-shrink-0 text-white/40 group-hover:text-dta-accent" />
      </div>
    </a>
  );
}
