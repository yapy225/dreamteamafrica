import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Eye, Clock, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import ShareButton from "./ShareButton";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, string> = {
  ACTUALITE: "bg-blue-100 text-blue-700",
  CULTURE: "bg-purple-100 text-purple-700",
  DIASPORA: "bg-green-100 text-green-700",
  BUSINESS: "bg-amber-100 text-amber-700",
  LIFESTYLE: "bg-pink-100 text-pink-700",
  OPINION: "bg-red-100 text-red-700",
};

const categoryColorsDark: Record<string, string> = {
  ACTUALITE: "bg-blue-500/20 text-blue-300",
  CULTURE: "bg-purple-500/20 text-purple-300",
  DIASPORA: "bg-green-500/20 text-green-300",
  BUSINESS: "bg-amber-500/20 text-amber-300",
  LIFESTYLE: "bg-pink-500/20 text-pink-300",
  OPINION: "bg-red-500/20 text-red-300",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      ...(article.coverImage && { images: [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.coverImage && { images: [article.coverImage] }),
    },
  };
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
  const viewCount = article.views + 1;

  // Related articles
  const related = await prisma.article.findMany({
    where: { category: article.category, id: { not: article.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const initials = (article.author.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    ...(article.coverImage && { image: article.coverImage }),
    datePublished: article.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.country && { nationality: article.author.country }),
    },
    publisher: {
      "@type": "Organization",
      name: "Dream Team Africa",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/logo-dta.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/journal/${slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── A. Sticky Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-dta-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/journal"
            className="flex items-center gap-1.5 text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={16} />
            Retour au journal
          </Link>
          <ShareButton />
        </div>
      </nav>

      {/* ── B. Article Hero ── */}
      <section className="relative min-h-[50vh] overflow-hidden bg-dta-dark">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dta-dark via-dta-char to-dta-dark" />
        <div className="absolute inset-0 opacity-15">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
        </div>
        {article.coverImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/60 to-transparent" />
          </>
        )}

        <div className="relative flex min-h-[50vh] items-end px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold ${categoryColorsDark[article.category] || ""}`}
              >
                {article.category}
              </span>
              {article.featured && (
                <span className="rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                  En vedette
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-5 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dta-sand/80">
              {article.excerpt}
            </p>

            {/* Metadata */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dta-sand/60">
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
                {viewCount} vue{viewCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── C. Article Body ── */}
      <article className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`mb-6 text-base leading-[1.9] text-dta-char/85 ${
                i === 0
                  ? "first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-dta-accent"
                  : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* ── D. Author Card ── */}
      <section className="bg-dta-beige px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-dta-dark">
                  {article.author.name}
                </p>
                {article.author.country && (
                  <p className="flex items-center gap-1 text-sm text-dta-taupe">
                    <MapPin size={13} />
                    {article.author.country}
                  </p>
                )}
              </div>
            </div>
            {article.author.bio && (
              <p className="mt-4 text-sm leading-relaxed text-dta-char/70">
                {article.author.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── E. Related Articles ── */}
      {related.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
                À lire aussi
              </h2>
              <Link
                href="/journal"
                className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
              >
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/journal/${r.slug}`}
                  className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/15 to-dta-sand">
                    {r.coverImage && (
                      <Image src={r.coverImage} alt={r.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                    )}
                  </div>
                  <div className="p-5">
                    <span
                      className={`inline-block rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${categoryColors[r.category] || ""}`}
                    >
                      {r.category}
                    </span>
                    <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs text-dta-taupe">
                      Par {r.author.name} &middot; {formatDate(r.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/journal"
                className="text-sm font-medium text-dta-accent"
              >
                Voir tous les articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── F. Footer CTA ── */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-dta-taupe transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={14} />
            Retour au journal
          </Link>
        </div>
      </section>
    </>
  );
}
