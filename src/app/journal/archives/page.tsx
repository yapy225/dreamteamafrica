import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archives — L'Afropéen",
  description: "Archives des articles du journal L'Afropéen",
};

const categoryColors: Record<string, string> = {
  ACTUALITE: "bg-blue-100 text-blue-700",
  CULTURE: "bg-purple-100 text-purple-700",
  DIASPORA: "bg-green-100 text-green-700",
  BUSINESS: "bg-amber-100 text-amber-700",
  LIFESTYLE: "bg-pink-100 text-pink-700",
  OPINION: "bg-red-100 text-red-700",
};

const ARTICLES_PER_PAGE = 12;

export default async function ArchivesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const categoryFilter = params.category;

  const where: Record<string, unknown> = { position: "ARCHIVES" };
  if (categoryFilter) where.category = categoryFilter;

  const [articles, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({ where }),
    prisma.article.findMany({
      where: { position: "ARCHIVES" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/journal"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
      >
        <ArrowLeft size={14} />
        Retour au journal
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-dta-dark">Archives</h1>
        <p className="mt-2 text-dta-char/70">
          {totalCount} article{totalCount !== 1 ? "s" : ""} archivé{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/journal/archives"
          className={`rounded-[var(--radius-full)] px-4 py-1.5 text-sm font-medium transition-colors ${
            !categoryFilter
              ? "bg-dta-accent text-white"
              : "bg-white text-dta-char shadow-[var(--shadow-card)] hover:bg-dta-accent hover:text-white"
          }`}
        >
          Tous
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/journal/archives?category=${c.category}`}
            className={`rounded-[var(--radius-full)] px-4 py-1.5 text-sm font-medium transition-colors ${
              categoryFilter === c.category
                ? "bg-dta-accent text-white"
                : "bg-white text-dta-char shadow-[var(--shadow-card)] hover:bg-dta-accent hover:text-white"
            }`}
          >
            {c.category}
          </Link>
        ))}
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <p className="font-serif text-xl font-bold text-dta-dark">Aucun article en archives</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
            >
              <div className="aspect-[16/10] rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-beige to-dta-sand" />
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${categoryColors[article.category] || ""}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-dta-taupe">{article.views} vues</span>
                </div>
                <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-dta-dark group-hover:text-dta-accent transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-dta-char/70">{article.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-dta-taupe">
                  <span>{article.author.name}</span>
                  <span>&middot;</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/journal/archives?page=${page - 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
              className="rounded-[var(--radius-button)] border border-dta-sand px-4 py-2 text-sm font-medium text-dta-char hover:bg-dta-beige"
            >
              Précédent
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/journal/archives?page=${p}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
              className={`rounded-[var(--radius-button)] px-3.5 py-2 text-sm font-medium transition-colors ${
                p === page
                  ? "bg-dta-accent text-white"
                  : "text-dta-char hover:bg-dta-beige"
              }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`/journal/archives?page=${page + 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
              className="rounded-[var(--radius-button)] border border-dta-sand px-4 py-2 text-sm font-medium text-dta-char hover:bg-dta-beige"
            >
              Suivant
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
