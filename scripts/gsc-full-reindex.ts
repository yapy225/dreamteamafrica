/**
 * Audit GSC complet : parcourt toutes les URLs du sitemap,
 * inspecte chaque URL, liste les échecs, puis relance l'indexation.
 *
 * Usage: npx tsx scripts/gsc-full-reindex.ts
 */
import { google } from "googleapis";
import { config } from "dotenv";

config();

const SITE_URL = "https://dreamteamafrica.com/";
const SITEMAP_URL = "https://dreamteamafrica.com/sitemap.xml";
const CONCURRENCY = 4;

type InspectRow = {
  url: string;
  verdict: string;
  coverage: string;
  fetch: string;
  indexing: string;
  lastCrawl: string;
};

async function fetchSitemapUrls(url: string): Promise<string[]> {
  const res = await fetch(url);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const out: string[] = [];
  for (const loc of locs) {
    if (loc.endsWith(".xml")) {
      out.push(...(await fetchSitemapUrls(loc)));
    } else {
      out.push(loc);
    }
  }
  return [...new Set(out)];
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    console.error("❌ GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY manquant");
    process.exit(1);
  }
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const scAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
  const searchconsole = google.searchconsole({ version: "v1", auth: scAuth });

  const idxAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const indexing = google.indexing({ version: "v3", auth: idxAuth });

  console.log(`\n📥 Récupération du sitemap : ${SITEMAP_URL}`);
  const urls = await fetchSitemapUrls(SITEMAP_URL);
  console.log(`   → ${urls.length} URLs uniques trouvées\n`);

  console.log(`🔎 Inspection via Search Console (concurrence ${CONCURRENCY})...\n`);

  const rows: InspectRow[] = [];
  let done = 0;
  await mapLimit(urls, CONCURRENCY, async (url) => {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl: SITE_URL, languageCode: "fr-FR" },
      });
      const idx = res.data.inspectionResult?.indexStatusResult;
      rows.push({
        url,
        verdict: idx?.verdict || "UNKNOWN",
        coverage: idx?.coverageState || "—",
        fetch: idx?.pageFetchState || "—",
        indexing: idx?.indexingState || "—",
        lastCrawl: idx?.lastCrawlTime || "jamais",
      });
    } catch (e) {
      const err = e as { message?: string };
      rows.push({
        url,
        verdict: "ERROR",
        coverage: (err.message || "inspect failed").slice(0, 80),
        fetch: "—",
        indexing: "—",
        lastCrawl: "—",
      });
    }
    done++;
    if (done % 20 === 0) console.log(`   ... ${done}/${urls.length}`);
  });

  // Catégories
  const indexed = rows.filter((r) => r.verdict === "PASS");
  const failed = rows.filter((r) => r.verdict !== "PASS");

  console.log(`\n${"═".repeat(70)}`);
  console.log(`  RÉSULTATS AUDIT`);
  console.log(`${"═".repeat(70)}`);
  console.log(`  ✅ Indexées (PASS)  : ${indexed.length}`);
  console.log(`  ⚠️  En échec        : ${failed.length}`);
  console.log(`${"═".repeat(70)}\n`);

  // Regroupement par motif
  const byCoverage = new Map<string, InspectRow[]>();
  for (const r of failed) {
    const k = r.coverage;
    if (!byCoverage.has(k)) byCoverage.set(k, []);
    byCoverage.get(k)!.push(r);
  }
  const sorted = [...byCoverage.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [cov, list] of sorted) {
    console.log(`\n📂 ${cov}  (${list.length})`);
    for (const r of list) console.log(`   ${r.url}`);
  }

  // Sauvegarde JSON
  const fs = await import("fs");
  const outFile = `/tmp/gsc-audit-${new Date().toISOString().slice(0, 10)}.json`;
  fs.writeFileSync(outFile, JSON.stringify({ indexed, failed }, null, 2));
  console.log(`\n💾 Rapport complet : ${outFile}`);

  // Demande indexation pour tous les échecs
  if (failed.length) {
    console.log(`\n📢 Requêtes Indexing API pour ${failed.length} URLs en échec...\n`);
    let ok = 0;
    let ko = 0;
    await mapLimit(failed, CONCURRENCY, async (r) => {
      try {
        await indexing.urlNotifications.publish({
          requestBody: { url: r.url, type: "URL_UPDATED" },
        });
        ok++;
      } catch (e) {
        const err = e as { message?: string };
        console.log(`   ❌ ${r.url} → ${err.message?.slice(0, 80)}`);
        ko++;
      }
    });
    console.log(`\n🎉 ${ok} requêtes OK, ${ko} échouées.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
