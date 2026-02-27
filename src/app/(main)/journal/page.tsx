import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "L'Afropéen — Le Journal",
  description: "Le journal de la diaspora africaine en Europe. Actualités, culture, business et lifestyle.",
};

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

export default async function JournalPage() {
  const articles = await prisma.article.findMany({
    where: { position: { not: "ARCHIVES" } },
    include: { author: { select: { name: true } } },
    orderBy: [{ position: "asc" }, { publishedAt: "desc" }],
  });

  const archiveCount = await prisma.article.count({ where: { position: "ARCHIVES" } });

  const uneArticle = articles.find((a) => a.position === "UNE");
  const otherArticles = articles.filter((a) => a.position !== "UNE");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-bold text-dta-dark sm:text-6xl">
          L&apos;Afropéen
        </h1>
        <p className="mt-2 text-lg italic text-dta-taupe">
          Le journal de la diaspora africaine en Europe
        </p>
      </div>

      {/* Une article (featured) */}
      {uneArticle && (
        <Link
          href={`/journal/${uneArticle.slug}`}
          className="group mb-10 block rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[16/10] rounded-l-[var(--radius-card)] bg-gradient-to-br from-dta-accent/20 to-dta-sand lg:aspect-auto" />
            <div className="p-8">
              <div className="flex items-center gap-2">
                <span className="rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                  À la Une
                </span>
                <span
                  className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium ${categoryColors[uneArticle.category] || ""}`}
                >
                  {uneArticle.category}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold leading-tight text-dta-dark group-hover:text-dta-accent transition-colors sm:text-3xl">
                {uneArticle.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
                {uneArticle.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-dta-taupe">
                <span>{uneArticle.author.name}</span>
                <span>&middot;</span>
                <span>{formatDate(uneArticle.publishedAt)}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Category nav */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["ACTUALITE", "CULTURE", "DIASPORA", "BUSINESS", "LIFESTYLE", "OPINION"].map((cat) => {
            const count = articles.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <span
                key={cat}
                className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium ${categoryColors[cat] || ""}`}
              >
                {cat} ({count})
              </span>
            );
          })}
        </div>
        {archiveCount > 0 && (
          <Link
            href="/journal/archives"
            className="text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
          >
            Archives ({archiveCount}) &rarr;
          </Link>
        )}
      </div>

      {/* Other articles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {otherArticles.map((article) => (
          <Link
            key={article.id}
            href={`/journal/${article.slug}`}
            className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
          >
            <div className="aspect-[16/10] rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-beige to-dta-sand" />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${categoryColors[article.category] || ""}`}
                >
                  {article.category}
                </span>
                <span className="text-xs text-dta-taupe">
                  {positionLabels[article.position]}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-dta-dark group-hover:text-dta-accent transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-dta-taupe">
                <span>{article.author.name}</span>
                <span>&middot;</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
