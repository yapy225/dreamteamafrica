import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Eye, Clock, MapPin, ArrowRight, Newspaper, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  getLifecycleDay,
  getZoneForDay,
  getZoneLabel,
  CATEGORY_CONFIG,
  GRADIENT_MAP,
} from "@/lib/journal";
import ShareButton from "./ShareButton";
import JournalNav from "@/components/journal/JournalNav";
import Newsletter from "@/components/journal/Newsletter";
import JournalFooter from "@/components/journal/JournalFooter";
import EventPromoCard from "@/components/journal/EventPromoCard";
import OfficielPromoCard from "@/components/journal/OfficielPromoCard";
import Comments from "@/components/sections/Comments";

export const revalidate = 60;



export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article introuvable" };
  const title = article.metaTitle || `${article.title} — L'Afropéen`;
  const description = article.metaDescription || article.excerpt;
  const articleWithAuthor = await prisma.article.findUnique({
    where: { slug },
    select: { author: { select: { name: true } }, category: true, updatedAt: true },
  });
  return {
    title,
    description,
    keywords: article.seoKeywords.length > 0 ? article.seoKeywords : undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: articleWithAuthor?.updatedAt?.toISOString(),
      authors: articleWithAuthor?.author?.name ? [articleWithAuthor.author.name] : undefined,
      section: articleWithAuthor?.category,
      tags: article.seoKeywords.length > 0 ? article.seoKeywords : undefined,
      url: `${siteUrl}/lafropeen/${slug}`,
      ...(article.coverImage && {
        images: [
          {
            url: article.coverImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@dreamteamafrica",
      title: article.title,
      description,
      ...(article.coverImage && { images: [article.coverImage] }),
    },
    alternates: {
      canonical: `${siteUrl}/lafropeen/${slug}`,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, bio: true, country: true } },
    },
  });

  if (!article) notFound();

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const readTime = article.readingTimeMin ?? Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
  const viewCount = article.views + 1;
  const lifecycleDay = getLifecycleDay(article.publishedAt);
  const zone = getZoneForDay(lifecycleDay);
  const zoneLabel = getZoneLabel(zone);
  const catConfig = CATEGORY_CONFIG[article.category];

  // Gradient background for hero when no cover image
  const gradientStyle = !article.coverImage && article.gradientClass
    ? { background: GRADIENT_MAP[article.gradientClass] }
    : undefined;

  // Related articles: first by shared tags, then by category
  const tagRelated = article.tags.length > 0
    ? await prisma.article.findMany({
        where: {
          id: { not: article.id },
          status: "PUBLISHED",
          tags: { hasSome: article.tags },
        },
        take: 3,
        orderBy: { views: "desc" },
        include: { author: { select: { name: true } } },
      })
    : [];

  const categoryRelated = await prisma.article.findMany({
    where: {
      category: article.category,
      id: { notIn: [article.id, ...tagRelated.map((a) => a.id)] },
      status: "PUBLISHED",
    },
    take: Math.max(0, 3 - tagRelated.length),
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const related = [...tagRelated, ...categoryRelated].slice(0, 3);

  // Cross-link: upcoming events for internal linking
  const upcomingEvents = await prisma.event.findMany({
    where: { published: true, date: { gte: new Date() } },
    select: { title: true, slug: true, date: true },
    orderBy: { date: "asc" },
    take: 3,
  });

  // Category slug mapping for breadcrumb
  const categorySlugMap: Record<string, string> = {
    ACTUALITE: "actualite",
    CULTURE: "culture",
    CINEMA: "cinema",
    MUSIQUE: "musique",
    SPORT: "sport",
    DIASPORA: "diaspora",
    BUSINESS: "business",
    LIFESTYLE: "lifestyle",
    OPINION: "opinion",
  };

  // ── Match article to its linked event (explicit) or by keywords (fallback) ──
  const eventSelect = {
    title: true, slug: true, date: true, endDate: true,
    venue: true, coverImage: true, capacity: true, description: true,
  } as const;

  const matchedEvent = await (async () => {
    // 1. Explicit link via eventId — always correct
    if (article.eventId) {
      const linked = await prisma.event.findUnique({
        where: { id: article.eventId },
        select: eventSelect,
      });
      if (linked) return linked;
    }

    // 2. Fallback: keyword matching for non-linked articles
    const articleWords = [
      article.title.toLowerCase(),
      ...article.tags.map((t) => t.toLowerCase()),
      ...(article.seoKeywords || []).map((k: string) => k.toLowerCase()),
    ].join(" ");

    const publishedEvents = await prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      select: eventSelect,
      orderBy: { date: "asc" },
    });

    let bestEvent: (typeof publishedEvents)[0] | null = null;
    let bestScore = 0;

    for (const evt of publishedEvents) {
      const evtWords = evt.title.toLowerCase().split(/\s+/);
      let score = 0;
      for (const word of evtWords) {
        if (word.length > 3 && articleWords.includes(word)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestEvent = evt;
      }
    }

    if (bestScore >= 2) return bestEvent;
    return publishedEvents[0] || null;
  })();

  // Determine which promo card to show
  const isOfficielArticle = article.source === "seo-officiel";
  const showEventCard = !isOfficielArticle && !!matchedEvent;
  const showOfficielCard = isOfficielArticle;

  // Get directory entry count for Officiel card
  const officielEntryCount = showOfficielCard
    ? await prisma.inscription.count({ where: { status: "VALIDATED" } })
    : 0;

  // Split content at 2nd paragraph to inject promo card
  let contentBefore = article.content;
  let contentAfter = "";
  if (showEventCard || showOfficielCard) {
    let pCount = 0;
    let splitIndex = -1;
    const pCloseRegex = /<\/p>/gi;
    let match;
    while ((match = pCloseRegex.exec(article.content)) !== null) {
      pCount++;
      if (pCount === 2) {
        splitIndex = match.index + match[0].length;
        break;
      }
    }
    if (splitIndex > -1) {
      contentBefore = article.content.slice(0, splitIndex);
      contentAfter = article.content.slice(splitIndex);
    }
  }

  const initials = (article.author.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);


  const articleUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/lafropeen/${slug}`;
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/logo-dta.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    ...(article.coverImage && { image: [article.coverImage] }),
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    wordCount: article.content.split(/\s+/).length,
    articleSection: catConfig?.label,
    keywords: article.seoKeywords?.join(", "),
    inLanguage: "fr-FR",
    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.country && {
        nationality: article.author.country,
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "Dream Team Africa",
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Journal Nav */}
      <JournalNav />

      {/* Breadcrumb with Schema.org */}
      <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-dta-sand/70 sm:text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">Accueil</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li className="text-dta-sand/40">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/lafropeen" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">L&apos;Afropeen</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          {catConfig && (
            <>
              <li className="text-dta-sand/40">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/lafropeen/categorie/${categorySlugMap[article.category]}`} itemProp="item" className="hover:text-dta-accent">
                  <span itemProp="name">{catConfig.label}</span>
                </Link>
                <meta itemProp="position" content="3" />
              </li>
            </>
          )}
          <li className="text-dta-sand/40">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="line-clamp-1 max-w-[200px] text-white/90">
              {article.title}
            </span>
            <meta itemProp="position" content={catConfig ? "4" : "3"} />
          </li>
        </ol>
      </nav>

      {/* Article Hero */}
      <section className="relative min-h-[50vh] overflow-hidden bg-dta-dark">
        {/* Background */}
        {article.coverImage ? (
          <>
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority={true}
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/60 to-transparent" />
          </>
        ) : gradientStyle ? (
          <>
            <div className="absolute inset-0 opacity-30" style={gradientStyle} />
            <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/60 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-dta-dark via-dta-char to-dta-dark" />
            <div className="absolute inset-0 opacity-15">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
            </div>
          </>
        )}

        <div className="relative flex min-h-[50vh] items-end px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {catConfig && (
                <span
                  className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold ${catConfig.badgeHero}`}
                >
                  {catConfig.label}
                </span>
              )}
              <span className="rounded-[var(--radius-full)] bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                J{lifecycleDay} &mdash; {zoneLabel}
              </span>
              {article.isSponsored && (
                <span className="rounded-[var(--radius-full)] bg-dta-accent/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  Article invite
                  {article.sponsorName && ` — ${article.sponsorName}`}
                </span>
              )}
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

            {/* Share */}
            <div className="mt-4">
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-dta-char/85 prose-headings:text-dta-char prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-6 prose-p:leading-[1.9] prose-a:text-dta-accent prose-strong:text-dta-char first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-dta-accent"
            dangerouslySetInnerHTML={{ __html: contentBefore }}
          />

          {/* Promo Card — inserted mid-article */}
          {showOfficielCard && (
            <OfficielPromoCard
              variant={article.seoKeywords?.some((k: string) => k.includes("annuaire")) ? "annuaire" : "inscription"}
              entryCount={officielEntryCount}
            />
          )}
          {showEventCard && matchedEvent && (
            <EventPromoCard
              title={matchedEvent.title}
              slug={matchedEvent.slug}
              date={matchedEvent.date}
              endDate={matchedEvent.endDate}
              venue={matchedEvent.venue}
              coverImage={matchedEvent.coverImage}
              capacity={matchedEvent.capacity}
              description={matchedEvent.description}
            />
          )}

          {contentAfter && (
            <div
              className="prose prose-lg max-w-none text-dta-char/85 prose-headings:text-dta-char prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-6 prose-p:leading-[1.9] prose-a:text-dta-accent prose-strong:text-dta-char"
              dangerouslySetInnerHTML={{ __html: contentAfter }}
            />
          )}
        </div>
      </article>

      {/* Tags + Category link */}
      {(article.tags.length > 0 || catConfig) && (
        <div className="border-t border-dta-sand/30 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {catConfig && (
              <div className="mb-4">
                <Link
                  href={`/lafropeen/categorie/${categorySlugMap[article.category]}`}
                  className={`inline-block rounded-[var(--radius-full)] px-3 py-1 text-sm font-medium transition-all hover:scale-105 ${catConfig.badge}`}
                >
                  Tous les articles {catConfig.label}
                </Link>
              </div>
            )}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[var(--radius-full)] bg-dta-bg px-3 py-1 text-xs text-dta-taupe"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maillage interne L'Afropéen — Catégories populaires */}
      <section className="bg-dta-accent/5 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-lg font-bold text-dta-dark">
            Explorer nos rubriques
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["ACTUALITE", "CULTURE", "MUSIQUE", "CINEMA", "SPORT", "DIASPORA", "BUSINESS", "LIFESTYLE"].map((cat) => (
              <Link
                key={cat}
                href={`/lafropeen/categorie/${cat.toLowerCase()}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-dta-dark shadow-sm transition-all hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5"
              >
                {cat === "ACTUALITE" ? "Actualit\u00e9" : cat === "CINEMA" ? "Cin\u00e9ma" : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
          <Link
            href="/lafropeen/archives"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
          >
            Toutes les archives <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Author Card */}
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

      {/* Comments */}
      <Comments />

      {/* Newsletter */}
      <Newsletter />

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
                A lire aussi
              </h2>
              <Link
                href="/lafropeen"
                className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
              >
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => {
                const rCatConfig = CATEGORY_CONFIG[r.category];
                return (
                  <Link
                    key={r.id}
                    href={`/lafropeen/${r.slug}`}
                    className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/15 to-dta-sand">
                      {r.coverImage && (
                        <Image
                          src={r.coverImage}
                          alt={r.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      {rCatConfig && (
                        <span
                          className={`inline-block rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${rCatConfig.badge}`}
                        >
                          {rCatConfig.label}
                        </span>
                      )}
                      <h3 className="mt-2 line-clamp-2 font-serif text-base font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-xs text-dta-taupe">
                        Par {r.author.name} &middot;{" "}
                        {formatDate(r.publishedAt)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/lafropeen"
                className="text-sm font-medium text-dta-accent"
              >
                Voir tous les articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Maillage interne L'Afropéen */}
      <section className="border-t border-dta-sand/50 bg-white px-4 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <Link
            href="/lafropeen"
            className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <Newspaper size={18} className="mb-2 text-dta-accent" />
            <h3 className="text-sm font-bold text-dta-dark">Derni&egrave;res actualit&eacute;s</h3>
            <p className="mt-1 text-xs text-dta-char/60">Les articles &agrave; la une</p>
          </Link>
          <Link
            href="/lafropeen/archives"
            className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <BookOpen size={18} className="mb-2 text-dta-accent" />
            <h3 className="text-sm font-bold text-dta-dark">Archives</h3>
            <p className="mt-1 text-xs text-dta-char/60">Tous nos articles</p>
          </Link>
          <Link
            href="/lafropeen/categorie/culture"
            className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <span className="mb-2 block text-lg">🌍</span>
            <h3 className="text-sm font-bold text-dta-dark">Culture africaine</h3>
            <p className="mt-1 text-xs text-dta-char/60">Art, musique, cin&eacute;ma, litt&eacute;rature</p>
          </Link>
        </div>
      </section>

      <JournalFooter />
    </>
  );
}
