/**
 * Force Google to index specific URLs via the Indexing API.
 * Usage: npx tsx scripts/index-urls.ts
 */
import { google } from "googleapis";
import path from "path";

const KEY_FILE = "/Users/yaps225/Downloads/dreamteamafrica-0eeaae773b05.json";

const URLS = [
  "https://dreamteamafrica.com/lofficiel-dafrique",
  "https://dreamteamafrica.com/lofficiel-dafrique/annuaire",
];

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const client = await auth.getClient();
  const indexing = google.indexing({ version: "v3", auth: client as any });

  for (const url of URLS) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
      });
      console.log(`✓ ${url} → ${res.status} ${res.statusText}`);
    } catch (err: any) {
      console.error(`✗ ${url} → ${err.message}`);
    }
  }
}

main();
