import { google } from "googleapis";

const KEY_FILE = "/Users/yaps225/Downloads/dreamteamafrica-0eeaae773b05.json";

const URLS = [
  "https://dreamteamafrica.com/made-in-africa",
  "https://dreamteamafrica.com/exposants",
  "https://dreamteamafrica.com/nous-contacter",
  "https://dreamteamafrica.com/lofficiel-dafrique",
  "https://dreamteamafrica.com/saison-culturelle-africaine",
  "https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris",
  "https://dreamteamafrica.com/saison-culturelle-africaine/salon-made-in-africa",
  "https://dreamteamafrica.com/saison-culturelle-africaine/festival-conte-africain",
  "https://dreamteamafrica.com/saison-culturelle-africaine/festival-de-lautre-culture",
  "https://dreamteamafrica.com/saison-culturelle-africaine/juste-une-danse",
  "https://dreamteamafrica.com/saison-culturelle-africaine/festival-international-du-cinema-africain",
  "https://dreamteamafrica.com/saison-culturelle-africaine/evasion-paris",
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
      console.log("✓", url, "→", res.status);
    } catch (err: any) {
      console.error("✗", url, "→", err.message?.slice(0, 80));
    }
  }
}

main();
