"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_CONFIG, getLifecycleDay } from "@/lib/journal";

/* ─── Types ─────────────────────────────────────────────── */

interface ArticleAuthor {
  name: string | null;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  gradientClass: string | null;
  category: string;
  publishedAt: Date;
  isSponsored: boolean;
  sponsorName: string | null;
  readingTimeMin: number | null;
  author: ArticleAuthor;
}

interface HeroCarouselProps {
  uneArticles: Article[];
  faceUneArticles: Article[];
}

/* ─── Helpers ───────────────────────────────────────────── */

function bgClass(article: Article): string {
  return article.gradientClass ?? "j-g1";
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/* ─── Component ─────────────────────────────────────────── */

export default function HeroCarousel({
  uneArticles,
  faceUneArticles,
}: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeSlide || transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setActiveSlide(index);
        setTransitioning(false);
      }, 300);
    },
    [activeSlide, transitioning]
  );

  /* Auto-cycle every 5s */
  useEffect(() => {
    if (uneArticles.length <= 1) return;
    const timer = setInterval(() => {
      goToSlide((activeSlide + 1) % uneArticles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide, uneArticles.length, goToSlide]);

  if (uneArticles.length === 0) return null;

  const currentArticle = uneArticles[activeSlide];
  const catConfig = CATEGORY_CONFIG[currentArticle.category];

  return (
    <section aria-label="Articles \u00e0 la une">
      {/* Section label */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-serif text-lg font-bold text-dta-dark">
          \u00c0 la Une &mdash; Jour 1 \u00e0 3
        </h2>
        <div className="flex items-center gap-1">
          {uneArticles.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? "w-4 bg-dta-accent"
                  : "w-1.5 bg-dta-sand"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: Main carousel */}
        <div className="relative min-h-[500px] overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          {/* Slides */}
          {uneArticles.map((article, i) => {
            const slideCat = CATEGORY_CONFIG[article.category];
            return (
              <Link
                key={article.id}
                href={`/journal/${article.slug}`}
                className={`group absolute inset-0 flex flex-col justify-end transition-all duration-500 ${
                  i === activeSlide
                    ? "z-10 scale-100 opacity-100"
                    : "z-0 scale-[1.02] opacity-0"
                }`}
                aria-hidden={i !== activeSlide}
                tabIndex={i === activeSlide ? 0 : -1}
              >
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={i === 0}
                  />
                ) : (
                  <div className={`absolute inset-0 ${bgClass(article)}`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="relative z-10 p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-2">
                    {slideCat && (
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium ${slideCat.badgeHero}`}
                      >
                        {slideCat.label}
                      </span>
                    )}
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                      J{getLifecycleDay(article.publishedAt)}
                    </span>
                    {article.isSponsored && (
                      <span className="rounded-full bg-dta-accent/30 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                        Article invit&eacute;
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold leading-tight text-white drop-shadow-sm lg:text-3xl">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
                    {article.author.name && <span>{article.author.name}</span>}
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.readingTimeMin && (
                      <span>{article.readingTimeMin} min</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Dot navigation */}
          {uneArticles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {uneArticles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSlide(i);
                  }}
                  aria-label={`Aller au slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeSlide
                      ? "w-6 bg-dta-accent"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Face Une articles */}
        <div className="flex flex-col gap-4">
          {faceUneArticles.slice(0, 3).map((article) => {
            const faceCat = CATEGORY_CONFIG[article.category];
            return (
              <Link
                key={article.id}
                href={`/journal/${article.slug}`}
                className="group relative flex min-h-[160px] flex-1 items-end overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              >
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className={`absolute inset-0 ${bgClass(article)}`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="relative z-10 p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    {faceCat && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${faceCat.badgeHero}`}
                      >
                        {faceCat.label}
                      </span>
                    )}
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      J{getLifecycleDay(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold leading-snug text-white drop-shadow-sm">
                    {article.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-white/60">
                    {article.author.name && <span>{article.author.name}</span>}
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
