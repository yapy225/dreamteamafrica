"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ExternalLink, Play, X } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  supportType: string;
  mediaFormat: string;
  plan: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  targetUrl: string;
  ctaText: string | null;
  advertiserName: string | null;
}

type Placement =
  | "HERO"
  | "BANNER_TOP"
  | "INLINE"
  | "SIDEBAR"
  | "VIDEO_SLOT"
  | "IN_GRID"
  | "INTERSTITIAL";

type Page =
  | "ACCUEIL"
  | "JOURNAL"
  | "OFFICIEL"
  | "MARKETPLACE"
  | "EVENEMENTS";

interface AdSlotProps {
  page: Page;
  placement: Placement;
  className?: string;
}

export default function AdSlot({ page, placement, className = "" }: AdSlotProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const limit = placement === "SIDEBAR" ? 6 : placement === "BANNER_TOP" ? 4 : 1;
    fetch(`/api/ads/unified/serve?page=${page}&placement=${placement}&limit=${limit}`)
      .then((r) => r.json())
      .then((data: Ad[]) => {
        if (Array.isArray(data) && data.length > 0) setAds(data);
      })
      .catch(() => {});
  }, [page, placement]);

  const trackImpression = useCallback((ad: Ad) => {
    if (!trackedRef.current.has(ad.id)) {
      trackedRef.current.add(ad.id);
      fetch("/api/ads/unified/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: ad.id, type: "impression" }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (ads.length > 0) trackImpression(ads[0]);
  }, [ads, trackImpression]);

  // Auto-rotate for BANNER_TOP
  useEffect(() => {
    if (ads.length <= 1 || placement !== "BANNER_TOP") return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((p) => {
          const next = (p + 1) % ads.length;
          trackImpression(ads[next]);
          return next;
        });
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads, placement, trackImpression]);

  const handleClick = (ad: Ad) => {
    fetch("/api/ads/unified/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: ad.id, type: "click" }),
    }).catch(() => {});
  };

  if (ads.length === 0 || dismissed) return null;

  // ─── HERO (full-width landscape banner) ───
  if (placement === "HERO") {
    const ad = ads[0];
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ad)}
        className={`group relative block w-full overflow-hidden ${className}`}
      >
        <div className="relative h-[200px] sm:h-[280px]">
          {ad.imageUrl ? (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-dta-dark to-dta-char" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6 sm:p-8">
            <div>
              <span className="rounded-full bg-dta-accent/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Sponsoris&eacute;
              </span>
              <h3 className="mt-2 font-serif text-xl font-bold text-white sm:text-2xl">
                {ad.title}
              </h3>
              <p className="mt-1 line-clamp-1 max-w-lg text-sm text-white/80">
                {ad.content}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // ─── BANNER_TOP (thin rotating bar) ───
  if (placement === "BANNER_TOP") {
    const ad = ads[activeIndex];
    return (
      <div className={`h-[44px] bg-dta-beige ${className}`}>
        <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-1 items-center gap-3 transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="shrink-0 rounded-full bg-dta-sand px-2 py-0.5 text-xs font-medium text-dta-taupe">
              Sponsoris&eacute;
            </span>
            <span className="min-w-0 truncate text-sm text-dta-dark">
              <strong>{ad.title}</strong>
              <span className="ml-1.5 hidden text-dta-char/70 sm:inline">
                {ad.content}
              </span>
            </span>
            <a
              href={ad.targetUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => handleClick(ad)}
              className="shrink-0 rounded-[var(--radius-button)] border border-dta-accent px-3 py-0.5 text-xs font-medium text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
            >
              {ad.ctaText || "En savoir plus"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── INLINE (between sections — image or landscape) ───
  if (placement === "INLINE") {
    const ad = ads[0];
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ad)}
        className={`group relative grid grid-cols-1 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-px hover:shadow-[var(--shadow-card-hover)] sm:grid-cols-2 ${className}`}
      >
        {/* Visual */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-dta-accent/20 to-dta-sand" />
          )}
          <span className="absolute left-3 top-3 z-10 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            Encart sponsoris&eacute;
          </span>
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center p-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-dta-taupe">
              DTA ADS
            </span>
            {ad.advertiserName && (
              <span className="text-[10px] text-dta-taupe">
                &mdash; {ad.advertiserName}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
            {ad.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
            {ad.content}
          </p>
          <div className="mt-4">
            <span className="inline-flex w-fit rounded-[var(--radius-button)] bg-dta-dark px-5 py-2 text-sm font-medium text-white transition-colors group-hover:bg-dta-accent">
              {ad.ctaText || "D\u00e9couvrir"}
            </span>
          </div>
        </div>
      </a>
    );
  }

  // ─── SIDEBAR (vertical stack, square or portrait) ───
  if (placement === "SIDEBAR") {
    return (
      <div className={`flex gap-4 overflow-x-auto lg:flex-col lg:overflow-x-visible ${className}`}>
        {ads.slice(0, 3).map((ad, i) => (
          <a
            key={`${ad.id}-${i}`}
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
            className="group block w-[240px] shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] lg:w-full"
          >
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
                <div className="absolute inset-0 bg-gradient-to-br from-dta-accent/20 to-dta-sand" />
              )}
              <span className="absolute left-2 top-2 z-10 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                Encart sponsoris&eacute;
              </span>
            </div>
            <div className="p-3">
              <h4 className="font-serif text-sm font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
                {ad.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dta-char/70">
                {ad.content}
              </p>
              <span className="mt-2 block text-xs font-semibold text-dta-accent">
                {ad.ctaText || "En savoir plus"} &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // ─── VIDEO_SLOT ───
  if (placement === "VIDEO_SLOT") {
    const ad = ads[0];
    return (
      <div className={`overflow-hidden rounded-xl bg-[#222] shadow-[var(--shadow-card)] ${className}`}>
        <div className="flex items-center gap-2 px-5 pt-4">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-medium text-white/70">
            Vid&eacute;o sponsoris&eacute;e
          </span>
        </div>

        <div className="relative mx-5 mt-3 aspect-video overflow-hidden rounded-lg bg-black/40">
          {ad.videoUrl ? (
            <video
              src={ad.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : ad.imageUrl ? (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : null}
          <button
            aria-label="Lire la vid\u00e9o"
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20">
              <Play size={20} className="text-white" fill="white" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <span className="text-xs font-bold text-white/60">
              {ad.advertiserName
                ? ad.advertiserName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                : "AD"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-base font-bold text-white">
              {ad.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-white/50">
              {ad.advertiserName ? `${ad.advertiserName} \u00b7 ` : ""}
              {ad.content}
            </p>
          </div>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
            className="shrink-0 rounded-[var(--radius-button)] border border-dta-accent px-4 py-1.5 text-xs font-medium text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
          >
            {ad.ctaText || "D\u00e9couvrir"}
          </a>
        </div>
      </div>
    );
  }

  // ─── IN_GRID (square card inside a product grid) ───
  if (placement === "IN_GRID") {
    const ad = ads[0];
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ad)}
        className={`group rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-dta-sand">
          {ad.imageUrl && (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-dta-accent/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Sponsoris&eacute;
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-base font-semibold text-[#2C2C2C] transition-colors group-hover:text-dta-accent">
            {ad.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-[#999]">
            {ad.content}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-dta-accent">
              {ad.ctaText || "D\u00e9couvrir"} &rarr;
            </span>
            <ExternalLink size={12} className="text-dta-taupe" />
          </div>
        </div>
      </a>
    );
  }

  // ─── INTERSTITIAL (mobile fullscreen) ───
  if (placement === "INTERSTITIAL") {
    const ad = ads[0];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:hidden">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white">
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-3 z-20 rounded-full bg-black/50 p-1.5 text-white"
          >
            <X size={16} />
          </button>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
          >
            {ad.imageUrl && (
              <div className="relative aspect-[9/16]">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-dta-accent">
                Sponsoris&eacute;
              </span>
              <h3 className="mt-1 font-serif text-lg font-bold text-dta-dark">
                {ad.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-dta-char/70">
                {ad.content}
              </p>
            </div>
          </a>
        </div>
      </div>
    );
  }

  return null;
}
