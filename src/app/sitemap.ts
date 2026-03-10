import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://dreamteamafrica.com";

  // ── Static pages ──────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/saison-culturelle-africaine`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/made-in-africa`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lafropeen`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lafropeen/archives`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/exposants`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/nous-contacter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faire-un-don`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/lofficiel-dafrique`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/lofficiel-dafrique/annuaire`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/auth/signin`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/auth/signup`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/conditions-generales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/conditions-utilisation`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/politique-de-confidentialite`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/politique-cookies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/politique-annulation`, changeFrequency: "yearly", priority: 0.3 },
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
    lastModified: new Date(),
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

  // ── Exhibitor reservation pages ───────────────────────────
  const exhibitorPages: MetadataRoute.Sitemap = events
    .filter((e) =>
      ["foire-dafrique-paris", "salon-made-in-africa"].some((s) =>
        e.slug.includes(s)
      )
    )
    .map((e) => ({
      url: `${baseUrl}/resa-exposants/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...eventPages,
    ...productPages,
    ...articlePages,
    ...exhibitorPages,
  ];
}
