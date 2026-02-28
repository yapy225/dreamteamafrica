import Link from "next/link";
import Image from "next/image";
import { getLifecycleDay, CATEGORY_CONFIG } from "@/lib/journal";

/* ─── Types ─────────────────────────────────────────────── */

interface ArticleAuthor {
  name: string | null;
}

interface ArticleData {
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

interface ArticleCardProps {
  article: ArticleData;
  variant: "hero" | "side" | "row" | "archive";
  showLifecycleDay?: boolean;
}

/* ─── Helpers ───────────────────────────────────────────── */

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function bgClass(article: ArticleData): string {
  return article.gradientClass ?? "j-g1";
}

/* ─── Component ─────────────────────────────────────────── */

export default function ArticleCard({
  article,
  variant,
  showLifecycleDay = false,
}: ArticleCardProps) {
  const catConfig = CATEGORY_CONFIG[article.category];
  const lifecycleDay = getLifecycleDay(article.publishedAt);

  /* ---------- hero ---------- */
  if (variant === "hero") {
    return (
      <Link
        href={`/journal/${article.slug}`}
        className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      >
        {/* Background */}
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className={`absolute inset-0 ${bgClass(article)}`} />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {catConfig && (
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${catConfig.badgeHero}`}
              >
                {catConfig.label}
              </span>
            )}
            {showLifecycleDay && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                J{lifecycleDay}
              </span>
            )}
            {article.isSponsored && (
              <span className="rounded-full bg-dta-accent/30 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                Article invit&eacute;
              </span>
            )}
          </div>

          <h2 className="font-serif text-2xl font-bold leading-tight text-white drop-shadow-sm">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
            {article.excerpt}
          </p>

          {/* Meta */}
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
  }

  /* ---------- side ---------- */
  if (variant === "side") {
    return (
      <Link
        href={`/journal/${article.slug}`}
        className="group relative flex min-h-[128px] items-end overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      >
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 ${bgClass(article)}`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 p-4">
          <div className="mb-1.5 flex items-center gap-2">
            {catConfig && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${catConfig.badgeHero}`}
              >
                {catConfig.label}
              </span>
            )}
            {showLifecycleDay && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                J{lifecycleDay}
              </span>
            )}
            {article.isSponsored && (
              <span className="rounded-full bg-dta-accent/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                Article invit&eacute;
              </span>
            )}
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
  }

  /* ---------- row ---------- */
  if (variant === "row") {
    return (
      <Link
        href={`/journal/${article.slug}`}
        className="group grid grid-cols-[160px_1fr] gap-4 overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="160px"
            />
          ) : (
            <div className={`absolute inset-0 ${bgClass(article)}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center py-4 pr-4">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {catConfig && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${catConfig.badge}`}
              >
                {catConfig.label}
              </span>
            )}
            {showLifecycleDay && (
              <span className="rounded-full bg-dta-sand px-2 py-0.5 text-[10px] font-bold text-dta-accent">
                J{lifecycleDay}
              </span>
            )}
            {article.isSponsored && (
              <span className="rounded-full bg-dta-accent/10 px-2 py-0.5 text-[10px] font-medium text-dta-accent">
                Article invit&eacute;
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-dta-char/70">
            {article.excerpt}
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-dta-taupe">
            {article.author.name && <span>{article.author.name}</span>}
            <span>{formatDate(article.publishedAt)}</span>
            {article.readingTimeMin && (
              <span>{article.readingTimeMin} min</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* ---------- archive ---------- */
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="j-archive-card group block overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]"
    >
      {/* Image */}
      <div className="relative h-[90px] overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className={`absolute inset-0 ${bgClass(article)}`} />
        )}
      </div>

      <div className="p-3">
        <div className="mb-1 flex items-center gap-1.5">
          {catConfig && (
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${catConfig.badge}`}
            >
              {catConfig.label}
            </span>
          )}
          {article.isSponsored && (
            <span className="rounded-full bg-dta-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-dta-accent">
              Invit&eacute;
            </span>
          )}
        </div>
        <h4 className="font-serif text-sm font-bold leading-snug text-dta-dark group-hover:text-dta-accent">
          {article.title}
        </h4>
        <p className="mt-1 text-[10px] text-dta-taupe">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
