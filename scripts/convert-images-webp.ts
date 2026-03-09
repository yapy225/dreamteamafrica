import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY!;
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const STORAGE_HOSTNAME = process.env.BUNNY_STORAGE_HOSTNAME ?? "storage.bunnycdn.com";
const CDN_URL = process.env.NEXT_PUBLIC_BUNNY_CDN_URL!;

async function uploadBuffer(buffer: Buffer, filePath: string, contentType: string) {
  const url = `https://${STORAGE_HOSTNAME}/${STORAGE_ZONE}/${filePath}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: STORAGE_API_KEY, "Content-Type": contentType },
    body: new Uint8Array(buffer),
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  return `${CDN_URL}/${filePath}`;
}

async function main() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      coverImage: { not: null, endsWith: ".png" },
    },
    select: { id: true, slug: true, coverImage: true },
  });

  console.log(`Found ${articles.length} articles with PNG images to convert.\n`);

  let converted = 0;
  let failed = 0;

  for (const article of articles) {
    const pngUrl = article.coverImage!;
    const webpPath = `articles/${article.slug}.webp`;

    try {
      // Download PNG
      const res = await fetch(pngUrl);
      if (!res.ok) {
        console.error(`  SKIP ${article.slug} — download failed (${res.status})`);
        failed++;
        continue;
      }
      const pngBuffer = Buffer.from(await res.arrayBuffer());
      const pngSize = (pngBuffer.length / 1024).toFixed(0);

      // Convert to WebP
      const webpBuffer = await sharp(pngBuffer)
        .resize(1200, undefined, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const webpSize = (webpBuffer.length / 1024).toFixed(0);

      // Upload WebP
      const webpUrl = await uploadBuffer(Buffer.from(webpBuffer), webpPath, "image/webp");

      // Update database
      await prisma.article.update({
        where: { id: article.id },
        data: { coverImage: webpUrl },
      });

      const reduction = (100 - (webpBuffer.length / pngBuffer.length) * 100).toFixed(0);
      console.log(`  ✓ ${article.slug} — ${pngSize} KB → ${webpSize} KB (−${reduction}%)`);
      converted++;
    } catch (err: any) {
      console.error(`  ✗ ${article.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${converted} converted, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
