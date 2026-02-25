import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Newspaper } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import DeleteArticleButton from "./DeleteArticleButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes articles" };

const positionLabels: Record<string, string> = {
  UNE: "À la Une",
  FACE_UNE: "Face Une",
  PAGES_4_5: "Pages 4-5",
  PAGES_6_7: "Pages 6-7",
  PAGES_8_9: "Pages 8-9",
  PAGES_10_11: "Pages 10-11",
  PAGES_12_13: "Pages 12-13",
  ARCHIVES: "Archives",
};

const categoryColors: Record<string, string> = {
  ACTUALITE: "bg-blue-100 text-blue-700",
  CULTURE: "bg-purple-100 text-purple-700",
  DIASPORA: "bg-green-100 text-green-700",
  BUSINESS: "bg-amber-100 text-amber-700",
  LIFESTYLE: "bg-pink-100 text-pink-700",
  OPINION: "bg-red-100 text-red-700",
};

export default async function ArticlesPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ARTISAN" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const articles = await prisma.article.findMany({
    where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            {session.user.role === "ADMIN" ? "Tous les articles" : "Mes articles"}
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Newspaper size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">Aucun article</h2>
          <p className="mt-2 text-sm text-dta-char/70">Rédigez votre premier article pour L&apos;Afropéen.</p>
          <Link
            href="/dashboard/articles/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Écrire un article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                    {article.title}
                  </h3>
                  <span className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${categoryColors[article.category] || ""}`}>
                    {article.category}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                  <span>{positionLabels[article.position] || article.position}</span>
                  <span>&middot;</span>
                  <span>Jour {article.dayCount}</span>
                  <span>&middot;</span>
                  <span>{article.views} vue{article.views !== 1 ? "s" : ""}</span>
                  <span>&middot;</span>
                  <span>{formatDate(article.publishedAt)}</span>
                  {session.user.role === "ADMIN" && (
                    <>
                      <span>&middot;</span>
                      <span>par {article.author.name}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-1">
                <Link
                  href={`/journal/${article.slug}`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Voir"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/dashboard/articles/${article.id}/edit`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
