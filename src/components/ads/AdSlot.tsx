"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ExternalLink, Play, X } from "lucide-react";

/**
 * Global registry to track which ad IDs are already displayed on the current page.
 * Each AdSlot registers the IDs it's showing, and passes them as `exclude` to the API
 * so other slots on the same page get different ads.
 */
const pageAdRegistry: { ids: Set<string>; listeners: Array<() => void> } = {
  ids: new Set(),
  listeners: [],
};

function registerAdIds(ids: string[]) {
  ids.forEach((id) => pageAdRegistry.ids.add(id));
  pageAdRegistry.listeners.forEach((fn) => fn());
}

function getExcludeIds() {
  return Array.from(pageAdRegistry.ids);
}

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

/** Image with graceful fallback to gradient on error/404 */
function AdImage({
  src,
  alt,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-dta-accent/30 via-dta-dark/60 to-dta-char/80" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      sizes={sizes}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export default function AdSlot({ page, placement, className = "" }: AdSlotProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Small stagger based on placement priority so BANNER_TOP loads first, then others exclude its IDs
    const delays: Record<string, number> = { BANNER_TOP: 0, HERO: 50, SIDEBAR: 100, IN_GRID: 150, INLINE: 200, VIDEO_SLOT: 250, INTERSTITIAL: 300 };
    const delay = delays[placement] ?? 0;

    const timer = setTimeout(() => {
      const limit = placement === "SIDEBAR" ? 6 : placement === "BANNER_TOP" ? 4 : placement === "IN_GRID" ? 4 : 1;
      const exclude = getExcludeIds().join(",");
      const excludeParam = exclude ? `&exclude=${exclude}` : "";
      fetch(`/api/ads/unified/serve?page=${page}&placement=${placement}&limit=${limit}${excludeParam}`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data: Ad[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setAds(data);
            registerAdIds(data.map((a) => a.id));
          }
        })
        .catch(() => {});
    }, delay);

    return () => clearTimeout(timer);
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

  const GradientBg = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-dta-accent/30 via-dta-dark/60 to-dta-char/80" />
  );

  // ─── HERO (2-column: image left + dark content right) ───
  if (placement === "HERO") {
    const ad = ads[0];
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ad)}
        className={`group relative block w-full overflow-hidden rounded-2xl ${className}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr]">
          {/* Image */}
          <div className="relative min-h-[260px] overflow-hidden bg-[#F5F0EB] sm:min-h-[360px]">
            {ad.imageUrl ? (
              <AdImage src={ad.imageUrl} alt={ad.title} sizes="(max-width: 640px) 100vw, 60vw" />
            ) : (
              <GradientBg />
            )}
          </div>
          {/* Content */}
          <div className="flex flex-col justify-center bg-[#2C2C2C] p-8 sm:p-10">
            <span className="inline-block w-fit rounded bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
              Sponsoris&eacute;
            </span>
            <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
              {ad.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
              {ad.content}
            </p>
            <div className="mt-6">
              <span className="inline-flex items-center rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#2C2C2C]">
                {ad.ctaText || "D\u00e9couvrir"}
              </span>
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
      <div className={`bg-dta-dark py-2.5 ${className}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-1 items-center gap-3 transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="shrink-0 rounded-full bg-dta-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Pub
            </span>
            <span className="min-w-0 truncate text-sm text-white">
              <strong>{ad.title}</strong>
              <span className="ml-1.5 hidden text-white/70 sm:inline">
                {ad.content}
              </span>
            </span>
            <a
              href={ad.targetUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => handleClick(ad)}
              className="shrink-0 rounded-full bg-dta-accent px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-dta-accent/80"
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
      <div className={`mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => handleClick(ad)}
          className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-dta-sand/50 bg-white shadow-lg transition-all duration-300 hover:-translate-y-px hover:shadow-xl sm:grid-cols-2"
        >
          {/* Visual */}
          <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden">
            {ad.imageUrl ? (
              <AdImage
                src={ad.imageUrl}
                alt={ad.title}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ) : (
              <GradientBg />
            )}
            <span className="absolute left-3 top-3 z-10 rounded-full bg-dta-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Sponsoris&eacute;
            </span>
          </div>

          {/* Content */}
          <div className="relative flex flex-col justify-center p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-dta-accent">
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
              <span className="inline-flex w-fit rounded-full bg-dta-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-dta-dark">
                {ad.ctaText || "D\u00e9couvrir"}
              </span>
            </div>
          </div>
        </a>
      </div>
    );
  }

  // ─── SIDEBAR (portrait 9:16 + card stack) ───
  if (placement === "SIDEBAR") {
    const mainAd = ads[0];
    const extraAds = ads.slice(1, 3);
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* Main portrait ad (9:16) */}
        <a
          href={mainAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => handleClick(mainAd)}
          className="group relative block overflow-hidden rounded-xl border border-dta-sand/50 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-[9/16] overflow-hidden">
            {mainAd.imageUrl ? (
              <AdImage
                src={mainAd.imageUrl}
                alt={mainAd.title}
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="300px"
              />
            ) : (
              <GradientBg />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 z-10 rounded-full bg-dta-accent px-2.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Pub
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h4 className="font-serif text-sm font-bold leading-snug text-white">
                {mainAd.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                {mainAd.content}
              </p>
              <span className="mt-2 inline-block rounded-full bg-dta-accent px-4 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-dta-accent/80">
                {mainAd.ctaText || "En savoir plus"}
              </span>
            </div>
          </div>
        </a>

        {/* Extra small cards */}
        {extraAds.map((ad, i) => (
          <a
            key={`${ad.id}-${i}`}
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
            className="group block overflow-hidden rounded-xl border border-dta-sand/50 bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="relative h-32 overflow-hidden">
              {ad.imageUrl ? (
                <AdImage
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="transition-transform duration-300 group-hover:scale-105"
                  sizes="280px"
                />
              ) : (
                <GradientBg />
              )}
              <span className="absolute left-2 top-2 z-10 rounded-full bg-dta-accent px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                Pub
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
      <div className={`overflow-hidden rounded-xl bg-[#1a1a1a] shadow-xl ${className}`}>
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
            <AdImage
              src={ad.imageUrl}
              alt={ad.title}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <GradientBg />
          )}
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
            className="shrink-0 rounded-full bg-dta-accent px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-dta-accent/80"
          >
            {ad.ctaText || "D\u00e9couvrir"}
          </a>
        </div>
      </div>
    );
  }

  // ─── IN_GRID (card grid — 4 cols if multiple, single card if one) ───
  if (placement === "IN_GRID") {
    const gridAds = ads.slice(0, 4);
    return (
      <div
        className={`grid gap-5 ${
          gridAds.length > 1
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : ""
        } ${className}`}
      >
        {gridAds.map((ad, i) => (
          <a
            key={`${ad.id}-${i}`}
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ad)}
            className="group block"
          >
            {/* Image + badge overlay */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F0EB]">
              {ad.imageUrl ? (
                <AdImage
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <GradientBg />
              )}
              <span className="absolute left-3 top-3 rounded bg-[#2C2C2C]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {ad.advertiserName || "Sponsoris\u00e9"}
              </span>
            </div>
            {/* Title + arrow */}
            <div className="mt-3">
              <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#2C2C2C] transition-colors group-hover:text-[#C4704B]">
                {ad.title}
              </h3>
              <span className="mt-1.5 inline-block text-[#C4704B] transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
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
            <div className="relative aspect-[9/16]">
              {ad.imageUrl ? (
                <AdImage src={ad.imageUrl} alt={ad.title} sizes="100vw" />
              ) : (
                <GradientBg />
              )}
            </div>
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
