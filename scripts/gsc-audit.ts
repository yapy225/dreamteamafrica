import { google } from "googleapis";

const KEY_FILE = "/Users/yaps225/Downloads/dreamteamafrica-0eeaae773b05.json";
const SITE_URL = "https://dreamteamafrica.com/";

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const client = await auth.getClient();
  const searchconsole = google.searchconsole({ version: "v1", auth: client as any });
  const webmasters = google.webmasters({ version: "v3", auth: client as any });

  // 1. Sitemaps
  console.log("=== SITEMAPS ===");
  try {
    const sitemaps = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
    for (const s of sitemaps.data.sitemap || []) {
      console.log(`  ${s.path} — submitted: ${s.contents?.[0]?.submitted}, indexed: ${s.contents?.[0]?.indexed}, errors: ${s.errors}, warnings: ${s.warnings}`);
    }
  } catch (e: any) {
    console.error("Sitemaps error:", e.message);
  }

  // 2. Top queries
  console.log("\n=== TOP 25 QUERIES (30 jours) ===");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: "2026-02-14",
        endDate: "2026-03-16",
        dimensions: ["query"],
        rowLimit: 25,
      },
    });
    for (const r of res.data.rows || []) {
      console.log(`  "${r.keys?.[0]}" — ${r.clicks} clics, ${r.impressions} imp, CTR ${((r.ctr||0)*100).toFixed(1)}%, pos ${(r.position||0).toFixed(1)}`);
    }
  } catch (e: any) {
    console.error("Queries error:", e.message);
  }

  // 3. Top pages
  console.log("\n=== TOP PAGES (30 jours) ===");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: "2026-02-14",
        endDate: "2026-03-16",
        dimensions: ["page"],
        rowLimit: 30,
      },
    });
    for (const r of res.data.rows || []) {
      console.log(`  ${r.keys?.[0]} — ${r.clicks} clics, ${r.impressions} imp, CTR ${((r.ctr||0)*100).toFixed(1)}%, pos ${(r.position||0).toFixed(1)}`);
    }
  } catch (e: any) {
    console.error("Pages error:", e.message);
  }

  // 4. URL Inspection for key pages
  console.log("\n=== URL INSPECTION ===");
  const urlsToCheck = [
    "https://dreamteamafrica.com/saison-culturelle-africaine",
    "https://dreamteamafrica.com/",
    "https://dreamteamafrica.com/made-in-africa",
    "https://dreamteamafrica.com/lafropeen",
    "https://dreamteamafrica.com/exposants",
    "https://dreamteamafrica.com/nous-contacter",
    "https://dreamteamafrica.com/foire-dafrique-paris",
    "https://dreamteamafrica.com/lofficiel-dafrique",
  ];

  for (const url of urlsToCheck) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl: SITE_URL },
      });
      const idx = res.data.inspectionResult?.indexStatusResult;
      const mob = res.data.inspectionResult?.mobileUsabilityResult;
      console.log(`\n  ${url}`);
      console.log(`    Coverage: ${idx?.coverageState}`);
      console.log(`    Verdict: ${idx?.verdict}`);
      console.log(`    Crawled: ${idx?.lastCrawlTime || "never"}`);
      console.log(`    Crawl status: ${idx?.pageFetchState}`);
      console.log(`    Indexing: ${idx?.indexingState}`);
      console.log(`    Mobile: ${mob?.verdict}`);
      if (idx?.referringUrls?.length) {
        console.log(`    Referring: ${idx.referringUrls.join(", ")}`);
      }
      if (idx?.sitemap?.length) {
        console.log(`    In sitemap: ${idx.sitemap.join(", ")}`);
      }
    } catch (e: any) {
      console.error(`  ${url}: ${e.message.slice(0, 100)}`);
    }
  }

  // 5. Pages with 0 clicks but impressions (potential issues)
  console.log("\n=== PAGES AVEC IMPRESSIONS MAIS 0 CLICS ===");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: "2026-02-14",
        endDate: "2026-03-16",
        dimensions: ["page"],
        rowLimit: 50,
      },
    });
    const zeroClicks = (res.data.rows || []).filter(r => r.clicks === 0 && (r.impressions || 0) > 5);
    for (const r of zeroClicks) {
      console.log(`  ${r.keys?.[0]} — 0 clics, ${r.impressions} imp, pos ${(r.position||0).toFixed(1)}`);
    }
  } catch (e: any) {
    console.error("Zero clicks error:", e.message);
  }

  // 6. Mobile vs Desktop
  console.log("\n=== MOBILE vs DESKTOP ===");
  for (const device of ["MOBILE", "DESKTOP"]) {
    try {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: "2026-02-14",
          endDate: "2026-03-16",
          dimensionFilterGroups: [{
            filters: [{ dimension: "device", operator: "equals", expression: device }],
          }],
        },
      });
      const row = res.data.rows?.[0];
      console.log(`  ${device}: ${row?.clicks || 0} clics, ${row?.impressions || 0} imp, CTR ${((row?.ctr||0)*100).toFixed(1)}%, pos ${(row?.position||0).toFixed(1)}`);
    } catch (e: any) {
      console.error(`  ${device} error:`, e.message);
    }
  }
}

main().catch(console.error);
