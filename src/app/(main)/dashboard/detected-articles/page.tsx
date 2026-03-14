import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Bot, Eye, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import DetectedArticleActions from "./DetectedArticleActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Articles detectes - Dashboard" };

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-600" },
  SCORED: { label: "En cours", color: "bg-blue-100 text-blue-600" },
  REWRITING: { label: "En cours", color: "bg-yellow-100 text-yellow-700" },
  REWRITTEN: { label: "En cours", color: "bg-indigo-100 text-indigo-700" },
  PUBLISHED: { label: "Publie", color: "bg-green-100 text-green-700" },
  IGNORED: { label: "Ignore", color: "bg-amber-100 text-amber-700" },
  ERROR: { label: "Erreur", color: "bg-red-100 text-red-700" },
};

export default async function DetectedArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status;

  const articles = await prisma.detectedArticle.findMany({
    where: statusFilter ? { status: statusFilter as any } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { feed: { select: { name: true } } },
  });

  // Stats
  const counts = await prisma.detectedArticle.groupBy({
    by: ["status"],
    _count: true,
  });
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;
  const total = counts.reduce((sum, c) => sum + c._count, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Articles detectes
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          Pipeline RSS automatique — {total} article{total !== 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard/detected-articles"
          className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
            !statusFilter
              ? "bg-dta-dark text-white"
              : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
          }`}
        >
          Tous ({total})
        </Link>
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={`/dashboard/detected-articles?status=${key}`}
            className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === key
                ? "bg-dta-dark text-white"
                : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
            }`}
          >
            {label} ({countMap[key] || 0})
          </Link>
        ))}
      </div>

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Bot size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun article detecte
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Les articles apparaitront ici une fois le CRON RSS lance.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const sc = statusConfig[article.status] || statusConfig.PENDING;
            return (
              <div
                key={article.id}
                className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-base font-semibold text-dta-dark">
                        {article.rewrittenTitle || article.title}
                      </h3>
                      <span
                        className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                      {article.score !== null && (
                        <span
                          className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-semibold ${
                            article.score >= 7
                              ? "bg-green-100 text-green-700"
                              : article.score >= 5
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          Score: {article.score}/10
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                      <span>{article.feed.name}</span>
                      <span>&middot;</span>
                      <span>{article.sourceCategory}</span>
                      <span>&middot;</span>
                      <span>{formatDateTime(article.createdAt)}</span>
                      {article.scoreReason && (
                        <>
                          <span>&middot;</span>
                          <span className="italic">{article.scoreReason}</span>
                        </>
                      )}
                    </div>

                    {article.summary && (
                      <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                        {article.summary}
                      </p>
                    )}

                    {article.errorMessage && (
                      <p className="mt-2 text-sm text-red-600">
                        Erreur: {article.errorMessage}
                      </p>
                    )}
                  </div>

                  <DetectedArticleActions
                    articleId={article.id}
                    status={article.status}
                    sourceUrl={article.sourceUrl}
                    publishedArticleId={article.publishedArticleId}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
