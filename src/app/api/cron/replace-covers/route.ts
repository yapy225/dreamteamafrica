import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchPexelsPhoto, buildPexelsQuery } from "@/lib/pexels";
import sharp from "sharp";
import { uploadBuffer } from "@/lib/bunny";

export const maxDuration = 60;

const BATCH_SIZE = 5; // 5 articles par exécution

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Trouver les articles dont la cover n'a pas encore été remplacée par Pexels
  // On marque les covers remplacées en ajoutant un tag "pexels-cover"
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      coverImage: { not: null },
      NOT: { tags: { has: "pexels-cover" } },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
    take: BATCH_SIZE,
  });

  if (articles.length === 0) {
    return NextResponse.json({
      message: "Toutes les covers ont été remplacées",
      replaced: 0,
    });
  }

  let replaced = 0;
  let failed = 0;
  const details: Array<{ title: string; status: string }> = [];

  for (const article of articles) {
    try {
      const query = buildPexelsQuery(article.title, article.category);
      const photo = await searchPexelsPhoto(query);

      if (!photo) {
        // Pas de photo Pexels → marquer quand même pour ne pas réessayer
        await prisma.article.update({
          where: { id: article.id },
          data: { tags: [...article.tags, "pexels-cover"] },
        });
        details.push({ title: article.title, status: "no-photo" });
        continue;
      }

      // Télécharger et optimiser
      const imgRes = await fetch(photo.url);
      if (!imgRes.ok) {
        details.push({ title: article.title, status: "download-failed" });
        failed++;
        continue;
      }

      const rawBuffer = Buffer.from(await imgRes.arrayBuffer());
      const webpBuffer = await sharp(rawBuffer)
        .resize(1200, undefined, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const filePath = `articles/${article.slug}.webp`;
      const { url: cdnUrl } = await uploadBuffer(
        Buffer.from(webpBuffer),
        filePath,
        "image/webp",
      );

      // Mettre à jour l'article
      await prisma.article.update({
        where: { id: article.id },
        data: {
          coverImage: cdnUrl,
          tags: [...article.tags, "pexels-cover"],
        },
      });

      replaced++;
      details.push({ title: article.title, status: "replaced" });

      // Rate limit Pexels
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      details.push({ title: article.title, status: `error: ${msg}` });
    }
  }

  // Compter combien il en reste
  const remaining = await prisma.article.count({
    where: {
      status: "PUBLISHED",
      coverImage: { not: null },
      NOT: { tags: { has: "pexels-cover" } },
    },
  });

  return NextResponse.json({
    replaced,
    failed,
    remaining,
    details,
  });
}
