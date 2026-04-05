import { google } from "googleapis";

const KEY_FILE = "/Users/yaps225/Downloads/dreamteamafrica-0eeaae773b05.json";

const URLS = [
  // DTA
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
  // Sneakers Love
  "https://sneakerslove.fr/",
  "https://sneakerslove.fr/jordan",
  "https://sneakerslove.fr/jordan/jordan-4",
  "https://sneakerslove.fr/jordan/jordan-1",
  "https://sneakerslove.fr/jordan/jordan-4-black-cat",
  "https://sneakerslove.fr/jordan/jordan-4-military-black",
  "https://sneakerslove.fr/nike",
  "https://sneakerslove.fr/nike/dunk-low",
  "https://sneakerslove.fr/nike/air-force-1",
  "https://sneakerslove.fr/adidas",
  "https://sneakerslove.fr/adidas/samba",
  "https://sneakerslove.fr/adidas/gazelle",
  "https://sneakerslove.fr/new-balance",
  "https://sneakerslove.fr/new-balance/550",
  "https://sneakerslove.fr/puma",
  "https://sneakerslove.fr/veja",
  "https://sneakerslove.fr/autry",
  "https://sneakerslove.fr/guide",
  "https://sneakerslove.fr/accessoires",
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
