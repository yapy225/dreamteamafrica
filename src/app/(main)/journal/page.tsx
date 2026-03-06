import { prisma } from "@/lib/db";
import { groupArticlesByZone, getZoneLabel } from "@/lib/journal";
import type { JournalZone } from "@/lib/journal";

import JournalNav from "@/components/journal/JournalNav";
import HeroCarousel from "@/components/journal/HeroCarousel";
import LifecycleBar from "@/components/journal/LifecycleBar";
import ArticleRow from "@/components/journal/ArticleRow";
import ArticlesWithSidebar from "@/components/journal/ArticlesWithSidebar";
import ArchivesGrid from "@/components/journal/ArchivesGrid";
import Newsletter from "@/components/journal/Newsletter";
import JournalFooter from "@/components/journal/JournalFooter";
import AdSlot from "@/components/ads/AdSlot";

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

      {/* ── Banner Top — rotation publicitaire ── */}
      <AdSlot page="JOURNAL" placement="BANNER_TOP" />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero: UNE + FACE_UNE */}
        <HeroCarousel
          uneArticles={zones.UNE.length > 0 ? zones.UNE : zones.FACE_UNE}
          faceUneArticles={zones.UNE.length > 0 ? zones.FACE_UNE : zones.PAGES_4_5}
        />

        {/* ── Pub Une — après le hero ── */}
        <AdSlot page="JOURNAL" placement="HERO" />

        {/* Lifecycle Bar */}
        <LifecycleBar activeZone={firstActiveZone} />

        {/* Pages 4-5 */}
        {zones.PAGES_4_5.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_4_5}
            zoneName={getZoneLabel("PAGES_4_5")}
          />
        )}

        {/* ── Pub J4 — après pages 4-5 ── */}
        <AdSlot page="JOURNAL" placement="INLINE" />

        {/* Pages 6-7 */}
        {zones.PAGES_6_7.length > 0 && (
          <ArticleRow
            articles={zones.PAGES_6_7}
            zoneName={getZoneLabel("PAGES_6_7")}
          />
        )}

        {/* Pages 8-9 with sidebar ads */}
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

        {/* ── Pub J10 — après pages 10-11 ── */}
        <AdSlot page="JOURNAL" placement="VIDEO_SLOT" />

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

          {/* ── Pub J14 — en tête des archives ── */}
          <div className="mb-8">
            <AdSlot page="JOURNAL" placement="IN_GRID" />
          </div>

          <ArchivesGrid
            articles={archivePreview}
            totalPages={archiveTotalPages}
            currentPage={1}
          />

          {/* ── Pub J20 — fin des archives ── */}
          <div className="mt-8">
            <AdSlot page="JOURNAL" placement="SIDEBAR" className="lg:flex-row" />
          </div>
        </div>
      )}

      <JournalFooter />
    </>
  );
}
