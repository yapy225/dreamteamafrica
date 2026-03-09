import { PrismaClient } from "@prisma/client";
import { generateCoverImage } from "../src/lib/generate-cover-image";

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", coverImage: null },
    select: { id: true, slug: true, title: true, category: true },
    orderBy: { publishedAt: "desc" },
  });

  console.log(`Found ${articles.length} articles without cover image.\n`);

  let generated = 0;
  let failed = 0;

  for (const article of articles) {
    console.log(`  Generating: ${article.title.slice(0, 60)}...`);
    try {
      const url = await generateCoverImage(article.title, article.category, article.slug);
      if (url) {
        await prisma.article.update({
          where: { id: article.id },
          data: { coverImage: url },
        });
        console.log(`  ✓ ${article.slug} → ${url}\n`);
        generated++;
      } else {
        console.log(`  ✗ ${article.slug} — no image returned\n`);
        failed++;
      }
    } catch (err: any) {
      console.error(`  ✗ ${article.slug} — ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\nDone: ${generated} generated, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
