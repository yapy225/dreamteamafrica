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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "L'Afropeen - Le Journal de la Diaspora Africaine",
  description:
    "Le journal de la diaspora africaine en Europe. Actualites, culture, business, diaspora et lifestyle. Un article par jour, cycle de vie 21 jours.",
};

export default async function JournalPage() {
  const [publishedArticles, archivedArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.article.findMany({
      where: { status: "ARCHIVED" },
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
    }),
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

  // Archives preview (first 8)
  const archivePreview = zones.ARCHIVES.slice(0, 8);
  const archiveTotalPages = Math.ceil(zones.ARCHIVES.length / 8);

  return (
    <>
      <JournalNav />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
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
