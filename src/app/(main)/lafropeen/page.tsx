import { prisma } from "@/lib/db";
import { groupArticlesByZone, getZoneLabel } from "@/lib/journal";
import type { JournalZone } from "@/lib/journal";

import Link from "next/link";
import { CATEGORY_CONFIG } from "@/lib/journal";
import JournalNav from "@/components/journal/JournalNav";
import HeroCarousel from "@/components/journal/HeroCarousel";
import LifecycleBar from "@/components/journal/LifecycleBar";
import ArticleRow from "@/components/journal/ArticleRow";
import ArticlesWithSidebar from "@/components/journal/ArticlesWithSidebar";
import ArchivesGrid from "@/components/journal/ArchivesGrid";
import Newsletter from "@/components/journal/Newsletter";
import JournalFooter from "@/components/journal/JournalFooter";
import DiscoverMore from "@/components/sections/DiscoverMore";

const CATEGORY_SLUGS = [
  { slug: "actualite", key: "ACTUALITE" },
  { slug: "culture", key: "CULTURE" },
  { slug: "cinema", key: "CINEMA" },
  { slug: "musique", key: "MUSIQUE" },
  { slug: "sport", key: "SPORT" },
  { slug: "diaspora", key: "DIASPORA" },
  { slug: "business", key: "BUSINESS" },
  { slug: "lifestyle", key: "LIFESTYLE" },
  { slug: "opinion", key: "OPINION" },
];

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "L'Afropéen — Journal de la Diaspora Africaine à Paris",
  description:
    "Le journal de la diaspora africaine en Europe. Actualités, culture africaine, cinéma, musique, business, diaspora et lifestyle. Articles quotidiens.",
  keywords: [
    "diaspora africaine Paris",
    "actualité africaine France",
    "culture africaine Paris",
    "journal diaspora africaine",
    "média diaspora africaine",
    "actualité Afrique",
    "cinéma africain",
    "musique africaine",
    "entrepreneuriat africain France",
    "lifestyle afro Paris",
  ],
  openGraph: {
    title: "L'Afropéen — Journal Diaspora Africaine",
    description: "Actualités, culture, business et lifestyle de la diaspora africaine en Europe.",
    type: "website",
    url: `${siteUrl}/lafropeen`,
    images: [
      {
        url: `${siteUrl}/foire-afrique.jpg`,
        width: 1200,
        height: 630,
        alt: "L'Afropéen — Journal de la Diaspora Africaine",
      },
    ],
  },
  alternates: {
    canonical: `${siteUrl}/lafropeen`,
  },
};

export default async function JournalPage() {
  const [publishedArticles, archivedArticles, totalArchived] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 50, // Limit to recent articles for zone display
    }),
    prisma.article.findMany({
      where: { status: "ARCHIVED" },
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 8, // Only first page of archives
    }),
    prisma.article.count({ where: { status: "ARCHIVED" } }),
  ]);

  const zones = groupArticlesByZone(publishedArticles);

  // Add manually archived articles to the ARCHIVES zone
  zones.ARCHIVES = [...zones.ARCHIVES, ...archivedArticles];

  // Determine which zone to highlight in the lifecycle bar
  const firstActiveZone: JournalZone =
    (
      [
        "UNE",
        "FACE_UNE",
        "PAGES_4_5",
        "PAGES_6_7",
        "PAGES_8_9",
        "PAGES_10_11",
        "PAGES_12_13",
      ] as JournalZone[]
    ).find((z) => zones[z].length > 0) ?? "UNE";

  // Archives preview (first 8) — archived articles already limited by query
  const archivePreview = zones.ARCHIVES.slice(0, 8);
  const archiveTotalPages = Math.ceil((zones.ARCHIVES.length + totalArchived) / 8);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "L'Afropéen — Journal de la Diaspora Africaine",
    description:
      "Actualités, culture, cinéma, musique, business et lifestyle de la diaspora africaine en Europe.",
    url: `${siteUrl}/lafropeen`,
    publisher: {
      "@type": "Organization",
      name: "Dream Team Africa",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-dta.png` },
    },
    inLanguage: "fr-FR",
    numberOfItems: publishedArticles.length + archivedArticles.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publishedArticles.length,
      itemListElement: publishedArticles.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/lafropeen/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <JournalNav />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl lg:text-4xl">
          L&apos;Afropéen — Journal de la Diaspora Africaine
        </h1>

        {/* Hero: UNE + FACE_UNE */}
        <HeroCarousel
          uneArticles={(zones.UNE.length > 0 ? zones.UNE : zones.FACE_UNE).slice(0, 3)}
          faceUneArticles={[
            ...(zones.UNE.length > 3 ? zones.UNE.slice(3) : []),
            ...zones.FACE_UNE,
            ...(zones.UNE.length === 0 ? zones.PAGES_4_5 : []),
          ].slice(0, 3)}
        />

        {/* Category Navigation — Internal Linking */}
        <nav className="flex flex-wrap justify-center gap-2" aria-label="Rubriques">
          {CATEGORY_SLUGS.map(({ slug, key }) => {
            const config = CATEGORY_CONFIG[key];
            return (
              <Link
                key={slug}
                href={`/lafropeen/categorie/${slug}`}
                className={`rounded-[var(--radius-full)] px-4 py-1.5 text-sm font-medium transition-all hover:scale-105 ${config?.badge ?? "bg-gray-100 text-gray-700"}`}
              >
                {config?.label ?? slug}
              </Link>
            );
          })}
        </nav>

        {/* Lifecycle Bar */}
        <LifecycleBar activeZone={firstActiveZone} />

        {/* Pages 4-5 */}
        {zones.PAGES_4_5.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_4_5}
            zoneName={getZoneLabel("PAGES_4_5")}
          />
        )}

        {/* Pages 6-7 */}
        {zones.PAGES_6_7.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_6_7}
            zoneName={getZoneLabel("PAGES_6_7")}
          />
        )}

        {/* Pages 8-9 */}
        {zones.PAGES_8_9.length > 0 && (
          <ArticlesWithSidebar
            articles={zones.PAGES_8_9}
            zoneName={getZoneLabel("PAGES_8_9")}
          />
        )}

        {/* Pages 10-11 */}
        {zones.PAGES_10_11.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_10_11}
            zoneName={getZoneLabel("PAGES_10_11")}
          />
        )}

        {/* Pages 12-13 */}
        {zones.PAGES_12_13.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_12_13}
            zoneName={getZoneLabel("PAGES_12_13")}
          />
        )}
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Archives preview */}
      {archivePreview.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="shrink-0 font-serif text-lg font-bold text-dta-dark">
              Archives
            </h2>
            <div className="h-px flex-1 bg-dta-sand" />
          </div>

          <ArchivesGrid
            articles={archivePreview}
            totalPages={archiveTotalPages}
            currentPage={1}
          />

        </div>
      )}

      <DiscoverMore exclude="journal" />

      <JournalFooter />
    </>
  );
}
