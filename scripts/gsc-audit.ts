import { google } from "googleapis";

const KEY_FILE = "/Users/yaps225/Downloads/dreamteamafrica-0eeaae773b05.json";

const SITES = [
  {
    name: "Dream Team Africa",
    url: "https://dreamteamafrica.com/",
    keyPages: [
      "https://dreamteamafrica.com/",
      "https://dreamteamafrica.com/saison-culturelle-africaine",
      "https://dreamteamafrica.com/made-in-africa",
      "https://dreamteamafrica.com/lafropeen",
      "https://dreamteamafrica.com/exposants",
      "https://dreamteamafrica.com/lofficiel-dafrique",
    ],
  },
  {
    name: "Sneakers Love",
    url: "sc-domain:sneakerslove.fr",
    keyPages: [
      "https://sneakerslove.fr/",
      "https://sneakerslove.fr/jordan",
      "https://sneakerslove.fr/nike",
      "https://sneakerslove.fr/adidas",
      "https://sneakerslove.fr/new-balance",
      "https://sneakerslove.fr/guide",
    ],
  },
  {
    name: "Service at Home",
    url: "https://serviceathome.fr/",
    keyPages: [
      "https://serviceathome.fr/",
    ],
  },
];

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function auditSite(
  site: (typeof SITES)[number],
  searchconsole: ReturnType<typeof google.searchconsole>,
  webmasters: ReturnType<typeof google.webmasters>,
) {
  const startDate = dateStr(30);
  const endDate = dateStr(1);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${site.name.toUpperCase()} — ${site.url}`);
  console.log(`  Période : ${startDate} → ${endDate}`);
  console.log(`${"═".repeat(60)}`);

  // 1. Sitemaps
  console.log("\n── SITEMAPS ──");
  try {
    const sitemaps = await webmasters.sitemaps.list({ siteUrl: site.url });
    for (const s of sitemaps.data.sitemap || []) {
      console.log(
        `  ${s.path} — soumises: ${s.contents?.[0]?.submitted}, indexées: ${s.contents?.[0]?.indexed}, erreurs: ${s.errors}, warnings: ${s.warnings}`,
      );
    }
    if (!sitemaps.data.sitemap?.length) console.log("  Aucun sitemap trouvé");
  } catch (e: any) {
    console.error("  Erreur sitemaps:", e.message);
  }

  // 2. Top queries
  console.log("\n── TOP 25 REQUÊTES ──");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: site.url,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 25,
      },
    });
    for (const r of res.data.rows || []) {
      console.log(
        `  "${r.keys?.[0]}" — ${r.clicks} clics, ${r.impressions} imp, CTR ${((r.ctr || 0) * 100).toFixed(1)}%, pos ${(r.position || 0).toFixed(1)}`,
      );
    }
    if (!res.data.rows?.length) console.log("  Aucune donnée");
  } catch (e: any) {
    console.error("  Erreur queries:", e.message);
  }

  // 3. Top pages
  console.log("\n── TOP 30 PAGES ──");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: site.url,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 30,
      },
    });
    for (const r of res.data.rows || []) {
      console.log(
        `  ${r.keys?.[0]} — ${r.clicks} clics, ${r.impressions} imp, CTR ${((r.ctr || 0) * 100).toFixed(1)}%, pos ${(r.position || 0).toFixed(1)}`,
      );
    }
    if (!res.data.rows?.length) console.log("  Aucune donnée");
  } catch (e: any) {
    console.error("  Erreur pages:", e.message);
  }

  // 4. URL Inspection
  console.log("\n── URL INSPECTION ──");
  for (const url of site.keyPages) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl: site.url },
      });
      const idx = res.data.inspectionResult?.indexStatusResult;
      const mob = res.data.inspectionResult?.mobileUsabilityResult;
      console.log(`\n  ${url}`);
      console.log(`    Couverture: ${idx?.coverageState}`);
      console.log(`    Verdict: ${idx?.verdict}`);
      console.log(`    Crawlé: ${idx?.lastCrawlTime || "jamais"}`);
      console.log(`    Fetch: ${idx?.pageFetchState}`);
      console.log(`    Indexation: ${idx?.indexingState}`);
      console.log(`    Mobile: ${mob?.verdict}`);
      if (idx?.sitemap?.length) {
        console.log(`    Sitemap: ${idx.sitemap.join(", ")}`);
      }
    } catch (e: any) {
      console.error(`  ${url}: ${e.message.slice(0, 100)}`);
    }
  }

  // 5. Pages 0 clics mais impressions
  console.log("\n── PAGES AVEC IMPRESSIONS MAIS 0 CLICS ──");
  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: site.url,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 50,
      },
    });
    const zeroClicks = (res.data.rows || []).filter(
      (r) => r.clicks === 0 && (r.impressions || 0) > 5,
    );
    for (const r of zeroClicks) {
      console.log(
        `  ${r.keys?.[0]} — 0 clics, ${r.impressions} imp, pos ${(r.position || 0).toFixed(1)}`,
      );
    }
    if (!zeroClicks.length) console.log("  Aucune page problématique");
  } catch (e: any) {
    console.error("  Erreur:", e.message);
  }

  // 6. Mobile vs Desktop
  console.log("\n── MOBILE vs DESKTOP ──");
  for (const device of ["MOBILE", "DESKTOP"]) {
    try {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: site.url,
        requestBody: {
          startDate,
          endDate,
          dimensionFilterGroups: [
            {
              filters: [
                { dimension: "device", operator: "equals", expression: device },
              ],
            },
          ],
        },
      });
      const row = res.data.rows?.[0];
      console.log(
        `  ${device}: ${row?.clicks || 0} clics, ${row?.impressions || 0} imp, CTR ${((row?.ctr || 0) * 100).toFixed(1)}%, pos ${(row?.position || 0).toFixed(1)}`,
      );
    } catch (e: any) {
      console.error(`  ${device} erreur:`, e.message);
    }
  }
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const client = await auth.getClient();
  const searchconsole = google.searchconsole({
    version: "v1",
    auth: client as any,
  });
  const webmasters = google.webmasters({
    version: "v3",
    auth: client as any,
  });

  const target = process.argv[2];
  const sites = target
    ? SITES.filter(
        (s) =>
          s.name.toLowerCase().includes(target.toLowerCase()) ||
          s.url.includes(target.toLowerCase()),
      )
    : SITES;

  if (!sites.length) {
    console.error(`Aucun site trouvé pour "${target}". Sites disponibles : ${SITES.map((s) => s.name).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n🔍 Audit SEO — ${new Date().toLocaleDateString("fr-FR")}`);
  console.log(`Sites : ${sites.map((s) => s.name).join(", ")}`);

  for (const site of sites) {
    await auditSite(site, searchconsole, webmasters);
  }
}

main().catch(console.error);
