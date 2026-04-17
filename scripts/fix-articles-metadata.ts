/**
 * Corrige metadata manquante (metaTitle, metaDescription, seoKeywords) pour
 * les articles publiés qui en manquent, en dérivant depuis title / excerpt / tags.
 *
 * Usage: npx tsx scripts/fix-articles-metadata.ts
 */
import { prisma } from "@/lib/db";
import { config } from "dotenv";

config();

function deriveMetaTitle(title: string): string {
  // Limit ~60 chars for SEO — truncate cleanly at word boundary
  const suffix = " — L'Afropéen";
  const maxBase = 60 - suffix.length;
  if (title.length <= maxBase) return `${title}${suffix}`;
  const truncated = title.slice(0, maxBase).replace(/\s+\S*$/, "");
  return `${truncated}${suffix}`;
}

function deriveMetaDescription(excerpt: string, title: string): string {
  const src = excerpt?.trim() || title;
  if (src.length <= 160) return src;
  return src.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

function deriveKeywords(title: string, tags: string[]): string[] {
  const fromTags = tags.slice(0, 5);
  if (fromTags.length >= 3) return fromTags;
  // Extract meaningful words from title
  const stop = new Set([
    "de","la","le","les","des","du","un","une","et","ou","a","à","en","sur","pour","par","avec","dans",
    "the","of","in","on","for","and","or","a","an","to","at",
  ]);
  const words = title
    .toLowerCase()
    .replace(/[^\wàâéèêëîïôöùûüçœæ\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w))
    .slice(0, 5);
  return [...new Set([...fromTags, ...words])].slice(0, 5);
}

async function main() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { metaTitle: null },
        { metaDescription: null },
        { seoKeywords: { isEmpty: true } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      tags: true,
      metaTitle: true,
      metaDescription: true,
      seoKeywords: true,
    },
  });

  console.log(`\n🔧 ${articles.length} articles à corriger\n`);

  let fixed = 0;
  for (const a of articles) {
    const updates: Record<string, string | string[]> = {};

    if (!a.metaTitle) updates.metaTitle = deriveMetaTitle(a.title);
    if (!a.metaDescription) updates.metaDescription = deriveMetaDescription(a.excerpt, a.title);
    if (!a.seoKeywords?.length) updates.seoKeywords = deriveKeywords(a.title, a.tags);

    if (!Object.keys(updates).length) continue;

    await prisma.article.update({
      where: { id: a.id },
      data: updates,
    });
    fixed++;
    console.log(`  ✅ ${a.slug}`);
    for (const [k, v] of Object.entries(updates)) {
      console.log(`      ${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
    }
  }

  console.log(`\n🎉 ${fixed} articles corrigés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
