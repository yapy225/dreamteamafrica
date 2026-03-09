import * as crypto from "crypto";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const events = [
  { title: "Festival International du Cinéma Africain (FICA) — 1ère Édition 2026", slug: "festival-international-du-cinema-africain", date: "20 avril 2026", venue: "Cinéma Le Kosmos, Fontenay-sous-Bois" },
  { title: "Festival de l'Autre Culture", slug: "festival-de-lautre-culture", date: "27 juin 2026", venue: "Parc des Épivans" },
  { title: "Juste Une Danse", slug: "juste-une-danse", date: "31 octobre 2026", venue: "Espace Mas, Paris" },
  { title: "Festival du Conte Africain — Sous l'arbre à Palabre", slug: "festival-conte-africain", date: "11 novembre 2026", venue: "Espace Mas, Paris" },
];

const baseUrl = "https://dreamteamafrica.com/saison-culturelle-africaine";

async function postTweet(text: string) {
  const apiKey = process.env.TWITTER_API_KEY as string;
  const apiSecret = process.env.TWITTER_API_SECRET as string;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN as string;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET as string;
  const url = "https://api.twitter.com/2/tweets";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&");
  const baseString = `POST&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
  oauthParams.oauth_signature = signature;

  const authHeader = "OAuth " + Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(", ");

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  return { status: res.status, id: data.data?.id, error: data.detail || data.title };
}

async function main() {
  for (const event of events) {
    const eventUrl = `${baseUrl}/${event.slug}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Génère un tweet accrocheur (max 260 chars) pour: ${event.title} le ${event.date} à ${event.venue}. Inclure 2-3 hashtags. Réponds UNIQUEMENT le texte du tweet.`,
      }],
      max_tokens: 100,
      temperature: 0.8,
    });

    const tweet = (response.choices[0]?.message?.content || "").trim();
    const fullTweet = `${tweet}\n\n${eventUrl}`;

    console.log(`\nPosting: ${event.title}`);
    const result = await postTweet(fullTweet);
    console.log(`  Status: ${result.status} ${result.status === 201 ? "✓" : "✗"} ${result.id || result.error || ""}`);

    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("\nDone!");
}

main().catch(console.error);
