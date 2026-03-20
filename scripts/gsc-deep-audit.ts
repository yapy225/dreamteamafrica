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

  // Get ALL pages that Google knows about (with impressions or not)
  // We'll check all pages from the sitemap + discovered pages
  console.log("=== TOUTES LES PAGES CONNUES PAR GOOGLE ===\n");
  
  // Fetch all pages with any data
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: "2025-01-01",
      endDate: "2026-03-16",
      dimensions: ["page"],
      rowLimit: 500,
    },
  });

  const allPages = (res.data.rows || []).map(r => r.keys?.[0]).filter(Boolean) as string[];
  console.log(`Total pages avec données: ${allPages.length}\n`);

  // Now inspect each one
  console.log("=== INSPECTION DE TOUTES LES PAGES ===\n");
  
  const results: Record<string, string[]> = {
    "404": [],
    "redirect": [],
    "noindex": [],
    "not_indexed": [],
    "blocked": [],
    "indexed": [],
    "other": [],
  };

  for (const url of allPages) {
    try {
      const inspection = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl: SITE_URL },
      });
      const idx = inspection.data.inspectionResult?.indexStatusResult;
      const coverage = idx?.coverageState || "unknown";
      const verdict = idx?.verdict || "unknown";
      const crawlState = idx?.pageFetchState || "";
      
      if (coverage.includes("not found") || crawlState === "SOFT_404" || coverage.includes("404")) {
        results["404"].push(url);
        console.log(`  404: ${url}`);
      } else if (coverage.includes("redirect")) {
        results["redirect"].push(url);
        console.log(`  REDIRECT: ${url}`);
      } else if (coverage.includes("noindex") || coverage.includes("Excluded by")) {
        results["noindex"].push(url);
        console.log(`  NOINDEX: ${url}`);
      } else if (coverage.includes("not indexed") || verdict === "NEUTRAL") {
        results["not_indexed"].push(url);
        console.log(`  NOT INDEXED: ${url} (${coverage})`);
      } else if (coverage.includes("blocked")) {
        results["blocked"].push(url);
        console.log(`  BLOCKED: ${url}`);
      } else if (verdict === "PASS") {
        results["indexed"].push(url);
      } else {
        results["other"].push(url);
        console.log(`  OTHER: ${url} → ${coverage} / ${verdict}`);
      }
    } catch (e: any) {
      console.error(`  ERROR: ${url} → ${e.message?.slice(0, 60)}`);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("\n=== RÉSUMÉ ===");
  console.log(`  Indexées: ${results["indexed"].length}`);
  console.log(`  404: ${results["404"].length}`);
  console.log(`  Redirections: ${results["redirect"].length}`);
  console.log(`  Noindex: ${results["noindex"].length}`);
  console.log(`  Non indexées: ${results["not_indexed"].length}`);
  console.log(`  Bloquées: ${results["blocked"].length}`);
  console.log(`  Autre: ${results["other"].length}`);
  
  if (results["404"].length) {
    console.log("\n--- PAGES 404 ---");
    results["404"].forEach(u => console.log(`  ${u}`));
  }
  if (results["redirect"].length) {
    console.log("\n--- REDIRECTIONS ---");
    results["redirect"].forEach(u => console.log(`  ${u}`));
  }
  if (results["not_indexed"].length) {
    console.log("\n--- NON INDEXÉES ---");
    results["not_indexed"].forEach(u => console.log(`  ${u}`));
  }
  if (results["blocked"].length) {
    console.log("\n--- BLOQUÉES ---");
    results["blocked"].forEach(u => console.log(`  ${u}`));
  }
}

main().catch(console.error);
