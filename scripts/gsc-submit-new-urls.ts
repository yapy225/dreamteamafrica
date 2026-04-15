/**
 * Submits sitemap + requests indexation for the new SEO URLs.
 *
 * Uses GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY from .env
 * (service account must be added as Owner in Search Console for the property).
 *
 * Usage: npx tsx scripts/gsc-submit-new-urls.ts
 */
import { google } from "googleapis";
import { config } from "dotenv";

config();

const SITE_URL = "https://dreamteamafrica.com/";
const SITEMAP_URL = "https://dreamteamafrica.com/sitemap.xml";

const NEW_URLS = [
  // Landings shopping
  "https://dreamteamafrica.com/beurre-de-karite-paris",
  "https://dreamteamafrica.com/huile-de-chebe-paris",
  "https://dreamteamafrica.com/tissu-wax-paris",
  "https://dreamteamafrica.com/cosmetique-africaine-paris",
  "https://dreamteamafrica.com/epicerie-africaine-paris",
  // Landings refondues
  "https://dreamteamafrica.com/foire-paris-2026",
  "https://dreamteamafrica.com/marche-africain-paris",
  "https://dreamteamafrica.com/evenement-africain-paris",
  "https://dreamteamafrica.com/musee-art-africain-paris",
  "https://dreamteamafrica.com/boutique-africaine-paris",
  "https://dreamteamafrica.com/made-in-africa",
  // Articles funnel
  "https://dreamteamafrica.com/lafropeen/comment-utiliser-huile-de-chebe-cheveux-afro",
  "https://dreamteamafrica.com/lafropeen/beurre-de-karite-bienfaits-7-usages",
  "https://dreamteamafrica.com/lafropeen/wax-bogolan-bazin-guide-tissus-africains-paris",
];

async function main() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    console.error("❌ GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY missing from .env");
    process.exit(1);
  }
  const privateKey = rawKey.replace(/\\n/g, "\n");

  // ── Auth for Search Console (sitemap submission + URL inspection)
  const scAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
  const webmasters = google.webmasters({ version: "v3", auth: scAuth });
  const searchconsole = google.searchconsole({ version: "v1", auth: scAuth });

  // ── Auth for Indexing API (request indexation)
  const idxAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const indexing = google.indexing({ version: "v3", auth: idxAuth });

  // 1. Submit sitemap
  console.log(`\n📤 Submitting sitemap to Search Console...`);
  console.log(`   Site: ${SITE_URL}`);
  console.log(`   Sitemap: ${SITEMAP_URL}\n`);
  try {
    await webmasters.sitemaps.submit({ siteUrl: SITE_URL, feedpath: SITEMAP_URL });
    console.log(`✅ Sitemap submitted successfully.`);
  } catch (e) {
    const err = e as { message?: string; errors?: unknown };
    console.error(`⚠️  Sitemap submission failed:`, err.message || err);
  }

  // 2. URL inspection (confirms coverage status + implicitly notifies Google)
  console.log(`\n🔎 Inspecting ${NEW_URLS.length} URLs via Search Console...\n`);
  for (const url of NEW_URLS) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl: SITE_URL, languageCode: "fr-FR" },
      });
      const status = res.data.inspectionResult?.indexStatusResult?.verdict || "UNKNOWN";
      const coverage = res.data.inspectionResult?.indexStatusResult?.coverageState || "—";
      console.log(`  ${status === "PASS" ? "🟢" : status === "NEUTRAL" ? "🟡" : "🔴"} ${url}`);
      console.log(`     → ${status} | ${coverage}`);
    } catch (e) {
      const err = e as { message?: string };
      console.log(`  ⚠️  ${url}`);
      console.log(`     → ${err.message || "inspection failed"}`);
    }
  }

  // 3. Indexing API — request indexation
  console.log(`\n📢 Requesting indexation via Indexing API...\n`);
  let success = 0;
  let failed = 0;
  for (const url of NEW_URLS) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
      });
      console.log(`  ✅ ${url}`);
      success++;
    } catch (e) {
      const err = e as { message?: string };
      console.log(`  ❌ ${url}`);
      console.log(`     → ${err.message || "request failed"}`);
      failed++;
    }
  }

  console.log(`\n🎉 Done. ${success} indexation requests succeeded, ${failed} failed.`);
  console.log(`   Note: Indexing API is officially limited to JobPosting / BroadcastEvent.`);
  console.log(`   For other pages, Google may still crawl faster after a request.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
