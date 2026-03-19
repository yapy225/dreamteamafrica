import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./db";

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const SYSTEM_PROMPT = `Tu es l'assistant WhatsApp de Dream Team Africa, une plateforme culturelle africaine à Paris.

ÉVÉNEMENT PRINCIPAL : Foire d'Afrique Paris — 6ème édition
- Dates : 1er et 2 mai 2026
- Lieu : Espace MAS, 10 rue des Terres au Curé, Paris 13e
- Horaires : 12h – 22h
- Billets : Early Bird 5€, Standard 10€
- Site : dreamteamafrica.com

EXPOSANTS :
- Pack Entrepreneur 1 jour : 190€
- Pack Entrepreneur 2 jours : 320€
- Pack Restauration : 500€/jour
- Acompte de réservation : 50€
- Lien réservation : dreamteamafrica.com/exposants

POLITIQUE D'ANNULATION :
- Remboursement intégral jusqu'à 30 jours avant l'événement
- 50% de remboursement entre 30 et 7 jours avant
- Aucun remboursement dans les 7 derniers jours

RÈGLES DE RÉPONSE :
- Réponds en français, ton chaleureux et professionnel
- Sois concis (max 3-4 phrases)
- Si tu ne sais pas, dis que l'équipe reviendra vers eux rapidement
- Ne donne jamais d'informations inventées
- Termine par une formule de politesse courte
- N'utilise pas de markdown, juste du texte simple (c'est pour WhatsApp)
- Utilise des emojis avec parcimonie (1-2 max)`;

/**
 * Generate a WhatsApp auto-reply draft using Claude Haiku.
 * Returns the draft text, or null on failure.
 */
export async function generateWhatsAppDraft(
  incomingMessage: string,
  contactName: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string | null> {
  try {
    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history for context (last 5 messages)
    if (conversationHistory?.length) {
      const recent = conversationHistory.slice(-5);
      for (const msg of recent) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add the current incoming message
    messages.push({
      role: "user",
      content: `[Message de ${contactName}] ${incomingMessage}`,
    });

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
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
 * Generate a draft and store it in the database as an outbound message
 * with status "draft" (not sent yet).
 */
export async function generateAndStoreDraft(
  phone: string,
  incomingMessage: string,
  contactName: string,
): Promise<string | null> {
  // Get conversation history
  const history = await prisma.whatsAppMessage.findMany({
    where: { from: { in: [phone, process.env.WHATSAPP_PHONE_NUMBER_ID || ""] } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { direction: true, body: true },
  });

  const conversationHistory = history
    .reverse()
    .filter((m) => m.body)
    .map((m) => ({
      role: (m.direction === "inbound" ? "user" : "assistant") as "user" | "assistant",
      content: m.body!,
    }));

  const draft = await generateWhatsAppDraft(
    incomingMessage,
    contactName,
    conversationHistory,
  );

  if (!draft) return null;

  // Store as draft message (not sent)
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
