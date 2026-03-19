import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./db";

let _client: Anthropic | null = null;
function getClient() {
  if (!_client)
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const APP_URL = "https://dreamteamafrica.com";

/**
 * Build system prompt with live data (tickets sold, stands available).
 */
async function buildSystemPrompt(): Promise<string> {
  // Données en temps réel
  const [earlyBirdSold, standardSold, totalTickets, standsReserved, standsBlocked] =
    await Promise.all([
      prisma.ticket.count({
        where: { eventId: "cmm767c1m0005ti794z61tzux", tier: "EARLY_BIRD" },
      }),
      prisma.ticket.count({
        where: { eventId: "cmm767c1m0005ti794z61tzux", tier: "STANDARD" },
      }),
      prisma.ticket.count({
        where: { eventId: "cmm767c1m0005ti794z61tzux" },
      }),
      prisma.exhibitorBooking.count({
        where: { status: { in: ["PARTIAL", "CONFIRMED"] } },
      }),
      prisma.standBlock.count({
        where: { eventId: "cmm767c1m0005ti794z61tzux" },
      }),
    ]);

  const earlyBirdQuota = 200;
  const earlyBirdRestants = Math.max(0, earlyBirdQuota - earlyBirdSold);
  const standsTotal = 60;
  const standsDisponibles = standsTotal - standsReserved - standsBlocked;

  return `Tu es l'assistant WhatsApp de Dream Team Africa. Tu réponds aux messages des visiteurs et exposants.

═══ ÉVÉNEMENT ═══
Foire d'Afrique Paris — 6ème édition
- Dates : 1er et 2 mai 2026
- Lieu : Espace MAS, 10 rue des Terres au Curé, Paris 13e
- Horaires : 12h – 22h

═══ BILLETTERIE (données en temps réel) ═══
- Early Bird : 5€ — ${earlyBirdRestants} billets restants sur ${earlyBirdQuota}${earlyBirdRestants === 0 ? " (ÉPUISÉ)" : ""}
- Prévente en ligne : 10€
- Sur place le jour J : 15€
- Total billets vendus : ${totalTickets}
- LIEN BILLETTERIE : ${APP_URL}/saison-culturelle-africaine/foire-dafrique-paris

═══ EXPOSANTS (données en temps réel) ═══
- Pack Entrepreneur 1 jour : 190€
- Pack Entrepreneur 2 jours : 320€
- Pack Restauration : 500€/jour
- Acompte de réservation : 50€
- Stands disponibles : ${standsDisponibles} sur ${standsTotal}
- Exposants inscrits : ${standsReserved}
- LIEN RÉSERVATION STAND : ${APP_URL}/resa-exposants/foire-dafrique-paris
- LIEN PACKS EXPOSANTS : ${APP_URL}/exposants

═══ RETROUVER SES BILLETS ═══
- Si quelqu'un a perdu ses billets : ${APP_URL}/mes-billets
- Il suffit d'entrer son email pour recevoir ses billets par email

═══ POLITIQUE D'ANNULATION ═══
- Remboursement intégral jusqu'à 30 jours avant
- 50% entre 30 et 7 jours avant
- Aucun remboursement dans les 7 derniers jours

═══ RÈGLES STRICTES ═══
1. TOUJOURS fournir le lien correspondant à la demande :
   - Demande de billet/réservation visiteur → donne le lien billetterie
   - Demande exposant/stand → donne le lien réservation stand
   - Billet perdu → donne le lien mes-billets
2. Réponds en français, ton chaleureux et professionnel
3. Sois concis : 3-5 phrases maximum
4. Inclus TOUJOURS le lien complet (pas de "cliquez ici")
5. Si les Early Bird sont épuisés, propose la Prévente à 10€
6. Si on demande les stands restants, donne le nombre exact
7. N'invente JAMAIS d'informations
8. Texte simple (pas de markdown, c'est pour WhatsApp)
9. 1-2 emojis max
10. Si la demande est hors sujet ou complexe, dis que l'équipe reviendra vers eux rapidement`;
}

/**
 * Generate a WhatsApp auto-reply draft using Claude Haiku.
 */
export async function generateWhatsAppDraft(
  incomingMessage: string,
  contactName: string,
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>,
): Promise<string | null> {
  try {
    const systemPrompt = await buildSystemPrompt();

    const messages: Anthropic.MessageParam[] = [];

    if (conversationHistory?.length) {
      const recent = conversationHistory.slice(-5);
      for (const msg of recent) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({
      role: "user",
      content: `[Message de ${contactName}] ${incomingMessage}`,
    });

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    for (const block of response.content) {
      if (block.type === "text") {
        return block.text;
      }
    }

    return null;
  } catch (err) {
    console.error("[WhatsApp AI] Draft generation failed:", err);
    return null;
  }
}

/**
 * Generate a draft and store it in the database.
 */
export async function generateAndStoreDraft(
  phone: string,
  incomingMessage: string,
  contactName: string,
): Promise<string | null> {
  const history = await prisma.whatsAppMessage.findMany({
    where: {
      OR: [{ from: phone }, { to: phone }],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { direction: true, body: true, status: true },
  });

  const conversationHistory = history
    .reverse()
    .filter((m) => m.body && m.status !== "draft")
    .map((m) => ({
      role: (m.direction === "inbound" ? "user" : "assistant") as
        | "user"
        | "assistant",
      content: m.body!,
    }));

  const draft = await generateWhatsAppDraft(
    incomingMessage,
    contactName,
    conversationHistory,
  );

  if (!draft) return null;

  await prisma.whatsAppMessage.create({
    data: {
      waMessageId: `draft_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      from: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      to: phone,
      contactName,
      direction: "outbound",
      type: "text",
      body: draft,
      status: "draft",
    },
  });

  return draft;
}
