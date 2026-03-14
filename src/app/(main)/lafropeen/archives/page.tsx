import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import JournalNav from "@/components/journal/JournalNav";
import ArchivesGrid from "@/components/journal/ArchivesGrid";
import JournalFooter from "@/components/journal/JournalFooter";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Archives — L'Afropéen | Articles Diaspora Africaine",
  description:
    "Archives complètes du journal L'Afropéen. Retrouvez tous nos articles sur la culture africaine, la diaspora, le business et le lifestyle.",
  openGraph: {
    title: "Archives — L'Afropéen",
    description: "Tous les articles archivés du journal de la diaspora africaine.",
    type: "website",
    url: `${siteUrl}/lafropeen/archives`,
  },
  alternates: {
    canonical: `${siteUrl}/lafropeen/archives`,
  },
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
    OR: [
      { status: "PUBLISHED", publishedAt: { lte: archiveCutoff } },
      { status: "PUBLISHED", position: "ARCHIVES" },
      { status: "ARCHIVED" },
    ],
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
          href="/lafropeen"
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
            {totalCount !== 1 ? "es" : "e"}
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
