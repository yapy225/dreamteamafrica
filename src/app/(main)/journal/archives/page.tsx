import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import JournalNav from "@/components/journal/JournalNav";
import ArchivesGrid from "@/components/journal/ArchivesGrid";
import JournalFooter from "@/components/journal/JournalFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archives - L'Afropeen",
  description:
    "Archives des articles du journal L'Afropeen. Tous les articles de plus de 21 jours.",
};

const ARTICLES_PER_PAGE = 8;

export default async function ArchivesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const categoryFilter = params.cat;

  // Articles older than 21 days are archives
  const archiveCutoff = new Date();
  archiveCutoff.setDate(archiveCutoff.getDate() - 21);

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
    publishedAt: { lte: archiveCutoff },
  };
  if (categoryFilter) where.category = categoryFilter;

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <>
      <JournalNav />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/journal"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
        >
          <ArrowLeft size={14} />
          Retour au journal
        </Link>

        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-dta-dark">
            Archives
          </h1>
          <p className="mt-2 text-dta-char/70">
            {totalCount} article{totalCount !== 1 ? "s" : ""} archiv
            {totalCount !== 1 ? "es" : "e"} (+ de 21 jours)
          </p>
        </div>

        <ArchivesGrid
          articles={articles}
          totalPages={totalPages}
          currentPage={page}
          category={categoryFilter}
        />
      </div>

      <JournalFooter />
    </>
  );
}
