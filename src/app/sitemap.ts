import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://dreamteamafrica.com";

  // ── Static pages ──────────────────────────────────────────
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/saison-culturelle-africaine`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lafropeen`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/exposants`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/nous-contacter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/lofficiel-dafrique`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/lofficiel-dafrique/annuaire`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/activites-culturelles-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/que-faire-paris-ce-weekend`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/marche-africain-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/musee-art-africain-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/croisiere-seine-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/spectacle-africain-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/foire-paris-2026`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/sortir-paris-ce-soir`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/boutique-africaine-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/beurre-de-karite-paris`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/huile-de-chebe-paris`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/tissu-wax-paris`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/cosmetique-africaine-paris`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/epicerie-africaine-paris`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/concert-afro-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/weekend-paris-pas-cher`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/sejour-culturel-africain-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/danse-zaouli-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  // ── Journal category pages ────────────────────────────────
  const categories = [
    "actualite",
    "culture",
    "cinema",
    "musique",
    "sport",
    "diaspora",
    "business",
    "lifestyle",
    "opinion",
  ];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/lafropeen/categorie/${cat}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // ── Dynamic pages from database ──────────────────────────
  const [events, products, articles] = await Promise.all([
    prisma.event.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true, source: true, eventId: true },
    }),
  ]);

  const eventPages: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${baseUrl}/saison-culturelle-africaine/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/made-in-africa/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Articles: higher priority for SEO event articles and recent ones
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => {
    const isSeoArticle = a.source === "seo" || a.eventId;
    const isRecent = a.publishedAt > sevenDaysAgo;
    return {
      url: `${baseUrl}/lafropeen/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: isSeoArticle || isRecent ? "daily" : "weekly",
      priority: isSeoArticle ? 0.9 : isRecent ? 0.85 : 0.7,
    };
  });

  return [
    ...staticPages,
    ...categoryPages,
    ...eventPages,
    ...productPages,
    ...articlePages,
  ];
}
