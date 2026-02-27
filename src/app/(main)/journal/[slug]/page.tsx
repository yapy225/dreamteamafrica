import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Eye, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, string> = {
  ACTUALITE: "bg-blue-100 text-blue-700",
  CULTURE: "bg-purple-100 text-purple-700",
  DIASPORA: "bg-green-100 text-green-700",
  BUSINESS: "bg-amber-100 text-amber-700",
  LIFESTYLE: "bg-pink-100 text-pink-700",
  OPINION: "bg-red-100 text-red-700",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article introuvable" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true, bio: true, country: true } } },
  });

  if (!article) notFound();

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Related articles
  const related = await prisma.article.findMany({
    where: { category: article.category, id: { not: article.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/journal"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
      >
        <ArrowLeft size={14} />
        Retour au journal
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2">
          <span className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold ${categoryColors[article.category] || ""}`}>
            {article.category}
          </span>
          {article.featured && (
            <span className="rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
              En vedette
            </span>
          )}
        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-dta-dark sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-dta-char/70">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-dta-taupe">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-dta-accent" />
            {article.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-dta-accent" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-dta-accent" />
            {readTime} min de lecture
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-dta-accent" />
            {article.views + 1} vue{article.views > 0 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Cover image placeholder */}
      {article.coverImage ? (
        <div className="mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-dta-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="mb-10 aspect-[16/9] rounded-[var(--radius-card)] bg-gradient-to-br from-dta-accent/10 via-dta-sand to-dta-beige" />
      )}

      {/* Content */}
      <div className="prose-dta">
        {article.content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="mb-5 text-base leading-[1.8] text-dta-char/85"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Author box */}
      <div className="mt-12 rounded-[var(--radius-card)] bg-dta-beige p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dta-accent/10 font-serif text-lg font-bold text-dta-accent">
            {article.author.name?.charAt(0)}
          </div>
          <div>
            <p className="font-serif text-base font-bold text-dta-dark">{article.author.name}</p>
            {article.author.country && (
              <p className="text-xs text-dta-taupe">{article.author.country}</p>
            )}
          </div>
        </div>
        {article.author.bio && (
          <p className="mt-3 text-sm leading-relaxed text-dta-char/70">{article.author.bio}</p>
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Dans la même rubrique
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/journal/${r.slug}`}
                className="group rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${categoryColors[r.category] || ""}`}>
                  {r.category}
                </span>
                <h3 className="mt-2 font-serif text-sm font-semibold leading-snug text-dta-dark group-hover:text-dta-accent transition-colors">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-dta-taupe">{r.author.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
