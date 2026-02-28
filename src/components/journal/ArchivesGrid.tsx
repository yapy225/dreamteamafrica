import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { CATEGORY_CONFIG } from "@/lib/journal";

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

interface ArchivesGridProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  category?: string;
}

/* ─── Component ─────────────────────────────────────────── */

export default function ArchivesGrid({
  articles,
  totalPages,
  currentPage,
  category,
}: ArchivesGridProps) {
  const allCategories = Object.entries(CATEGORY_CONFIG);

  function paginationHref(page: number): string {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (category) params.set("cat", category);
    return `/journal/archives?${params.toString()}`;
  }

  function categoryHref(cat?: string): string {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (cat) params.set("cat", cat);
    return `/journal/archives?${params.toString()}`;
  }

  /* Build visible page numbers */
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={categoryHref()}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "border-dta-dark bg-dta-dark text-white"
              : "border-dta-sand text-dta-char hover:border-dta-accent"
          }`}
        >
          Tous
        </Link>
        {allCategories.map(([key, config]) => (
          <Link
            key={key}
            href={categoryHref(key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === key
                ? "border-dta-dark bg-dta-dark text-white"
                : "border-dta-sand text-dta-char hover:border-dta-accent"
            }`}
          >
            {config.label}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="archive"
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-dta-taupe">
          Aucun article trouv&eacute; dans cette cat&eacute;gorie.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination des archives"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {/* Previous */}
          {currentPage > 1 ? (
            <Link
              href={paginationHref(currentPage - 1)}
              className="rounded-[var(--radius-button)] border border-dta-sand px-3 py-1.5 text-sm font-medium text-dta-char transition-colors hover:border-dta-accent"
            >
              &laquo; Pr&eacute;c.
            </Link>
          ) : (
            <span className="rounded-[var(--radius-button)] border border-dta-sand/50 px-3 py-1.5 text-sm font-medium text-dta-sand">
              &laquo; Pr&eacute;c.
            </span>
          )}

          {/* Page numbers */}
          {start > 1 && (
            <>
              <Link
                href={paginationHref(1)}
                className="rounded-[var(--radius-button)] border border-dta-sand px-3 py-1.5 text-sm font-medium text-dta-char transition-colors hover:border-dta-accent"
              >
                1
              </Link>
              {start > 2 && (
                <span className="px-1 text-dta-taupe">&hellip;</span>
              )}
            </>
          )}

          {pages.map((p) => (
            <Link
              key={p}
              href={paginationHref(p)}
              className={`rounded-[var(--radius-button)] border px-3 py-1.5 text-sm font-medium transition-colors ${
                p === currentPage
                  ? "border-dta-dark bg-dta-dark text-white"
                  : "border-dta-sand text-dta-char hover:border-dta-accent"
              }`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </Link>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <span className="px-1 text-dta-taupe">&hellip;</span>
              )}
              <Link
                href={paginationHref(totalPages)}
                className="rounded-[var(--radius-button)] border border-dta-sand px-3 py-1.5 text-sm font-medium text-dta-char transition-colors hover:border-dta-accent"
              >
                {totalPages}
              </Link>
            </>
          )}

          {/* Next */}
          {currentPage < totalPages ? (
            <Link
              href={paginationHref(currentPage + 1)}
              className="rounded-[var(--radius-button)] border border-dta-sand px-3 py-1.5 text-sm font-medium text-dta-char transition-colors hover:border-dta-accent"
            >
              Suiv. &raquo;
            </Link>
          ) : (
            <span className="rounded-[var(--radius-button)] border border-dta-sand/50 px-3 py-1.5 text-sm font-medium text-dta-sand">
              Suiv. &raquo;
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
