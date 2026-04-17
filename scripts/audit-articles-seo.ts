/**
 * Audit SEO des articles L'Afropéen : identifie les articles à risque d'être
 * considérés "thin content" par Google (faible indexation).
 *
 * Usage: npx tsx scripts/audit-articles-seo.ts
 */
import { prisma } from "@/lib/db";
import { config } from "dotenv";
import fs from "fs";

config();

const NON_INDEXED_SLUGS = [
  "la-guerre-rwanda-rdc-a-la-merci-de-l-hubris-de-trump",
  "for-every-1-showmax-made-it-lost-2-50",
  "abidjanis-une-passion-authentique-pour-l-art-africain",
  "digital-nomads-a-new-visa-wants-to-lure-short-term-travellers-to-south-africa",
  "egypt-s-currency-plunges-to-historic-low-billions-in-foreign-funds-exit",
  "kelima-l-art-de-subtiliser-l-identite-afro-dans-votre-interieur",
  "mois-de-penitence-des-familles-beneficient-d-une-assistance-sociale-dans-le-cadre-de-la-solidarite-tour-ado-2026",
  "quand-le-wax-rencontre-l-elegance-monochrome-par-evra-hodna",
  "a-kate-design-l-elegance-africaine-au-c-ur-du-monde-des-poupees",
  "quand-la-tradition-rencontre-la-modernite-maimouna-sene-revolutionne-la-mode-africaine",
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function main() {
  const all = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      metaTitle: true,
      metaDescription: true,
      tags: true,
      seoKeywords: true,
      category: true,
      publishedAt: true,
      source: true,
    },
  });

  console.log(`\n📊 ${all.length} articles publiés au total\n`);

  const issues: Record<string, string[]> = {
    "Contenu court (<600 mots)": [],
    "Sans metaTitle": [],
    "Sans metaDescription": [],
    "Excerpt court (<100 chars)": [],
    "Sans coverImage": [],
    "Sans tags": [],
    "Sans seoKeywords": [],
    "Sans maillage interne dans contenu": [],
  };

  const stats = { wordCount: [] as number[], withIssues: new Set<string>() };

  for (const a of all) {
    const plain = stripHtml(a.content);
    const words = plain.split(/\s+/).filter(Boolean).length;
    stats.wordCount.push(words);

    const problems: string[] = [];
    if (words < 600) problems.push("short");
    if (!a.metaTitle) problems.push("no-metaTitle");
    if (!a.metaDescription) problems.push("no-metaDesc");
    if ((a.excerpt || "").length < 100) problems.push("short-excerpt");
    if (!a.coverImage) problems.push("no-cover");
    if (!a.tags?.length) problems.push("no-tags");
    if (!a.seoKeywords?.length) problems.push("no-keywords");
    // Count internal links in content
    const internalLinks = (a.content.match(/href=["']\/[^"']+["']/g) || []).length;
    if (internalLinks === 0) problems.push("no-internal-links");

    if (problems.length) stats.withIssues.add(a.slug);

    if (problems.includes("short")) issues["Contenu court (<600 mots)"].push(`${a.slug} (${words}w)`);
    if (problems.includes("no-metaTitle")) issues["Sans metaTitle"].push(a.slug);
    if (problems.includes("no-metaDesc")) issues["Sans metaDescription"].push(a.slug);
    if (problems.includes("short-excerpt")) issues["Excerpt court (<100 chars)"].push(a.slug);
    if (problems.includes("no-cover")) issues["Sans coverImage"].push(a.slug);
    if (problems.includes("no-tags")) issues["Sans tags"].push(a.slug);
    if (problems.includes("no-keywords")) issues["Sans seoKeywords"].push(a.slug);
    if (problems.includes("no-internal-links")) issues["Sans maillage interne dans contenu"].push(a.slug);
  }

  const avgWords = Math.round(stats.wordCount.reduce((a, b) => a + b, 0) / stats.wordCount.length);
  const medianWords = stats.wordCount.sort((a, b) => a - b)[Math.floor(stats.wordCount.length / 2)];
  console.log(`📏 Longueur moyenne : ${avgWords} mots (médiane ${medianWords})`);
  console.log(`⚠️  Articles avec au moins un problème : ${stats.withIssues.size}/${all.length}\n`);

  console.log("═".repeat(70));
  console.log("  RÉPARTITION DES PROBLÈMES");
  console.log("═".repeat(70));
  for (const [k, v] of Object.entries(issues)) {
    console.log(`\n🔸 ${k} : ${v.length}`);
    if (v.length <= 15) for (const s of v) console.log(`   - ${s}`);
    else {
      for (const s of v.slice(0, 10)) console.log(`   - ${s}`);
      console.log(`   ... +${v.length - 10} autres`);
    }
  }

  // Focus on non-indexed subset
  console.log(`\n${"═".repeat(70)}`);
  console.log(`  FOCUS : ${NON_INDEXED_SLUGS.length} articles NON INDEXÉS (échantillon)`);
  console.log(`${"═".repeat(70)}\n`);

  for (const slug of NON_INDEXED_SLUGS) {
    const a = all.find((x) => x.slug === slug);
    if (!a) {
      console.log(`  ⚠️  ${slug} — introuvable en DB`);
      continue;
    }
    const plain = stripHtml(a.content);
    const words = plain.split(/\s+/).filter(Boolean).length;
    const internalLinks = (a.content.match(/href=["']\/[^"']+["']/g) || []).length;
    console.log(`• ${slug}`);
    console.log(`    words:${words}  cover:${!!a.coverImage}  metaTitle:${!!a.metaTitle}  metaDesc:${!!a.metaDescription}  tags:${a.tags.length}  kw:${a.seoKeywords.length}  internalLinks:${internalLinks}  source:${a.source}`);
  }

  fs.writeFileSync(
    "/tmp/articles-seo-audit.json",
    JSON.stringify({ stats: { avgWords, medianWords, total: all.length, withIssues: stats.withIssues.size }, issues }, null, 2),
  );
  console.log("\n💾 Rapport : /tmp/articles-seo-audit.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
