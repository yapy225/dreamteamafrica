import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { generateAndStoreDraft } from "@/lib/whatsapp-ai";
import { SURVEY_BUTTON_EXPOSANT, SURVEY_BUTTON_VISITEUR, sendExposantResponse, sendVisiteurResponse } from "@/lib/whatsapp-survey";

const VERIFY_TOKEN = process.env.FB_LEADS_VERIFY_TOKEN ?? process.env.CRON_SECRET!;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

/**
 * Download media from WhatsApp API and return a public URL.
 * 1. Get the media URL from Meta
 * 2. Download the binary
 * 3. Upload to Bunny CDN
 */
async function downloadMedia(mediaId: string): Promise<string | null> {
  try {
    // Step 1: Get media URL from Meta
    const metaRes = await fetch(`https://graph.facebook.com/v23.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    if (!metaRes.ok) return null;
    const metaData = await metaRes.json();
    const mediaUrl = metaData.url as string;
    const mimeType = metaData.mime_type as string;

    // Step 2: Download the binary from Meta
    const downloadRes = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    if (!downloadRes.ok) return null;
    const buffer = Buffer.from(await downloadRes.arrayBuffer());

    // Step 3: Upload to Bunny CDN
    const ext = mimeType?.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
    const filename = `whatsapp/${mediaId}.${ext}`;
    const bunnyApiKey = process.env.BUNNY_STORAGE_API_KEY;
    const bunnyZone = process.env.BUNNY_STORAGE_ZONE;
    const bunnyHost = process.env.BUNNY_STORAGE_HOSTNAME ?? "storage.bunnycdn.com";
    const cdnBase = process.env.NEXT_PUBLIC_BUNNY_CDN_URL;

    if (!bunnyApiKey || !bunnyZone || !cdnBase) return null;

    const uploadRes = await fetch(
      `https://${bunnyHost}/${bunnyZone}/${filename}`,
      {
        method: "PUT",
        headers: {
          AccessKey: bunnyApiKey,
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      console.error("Bunny upload failed:", uploadRes.status);
      return null;
    }

    return `${cdnBase}/${filename}`;
  } catch (err) {
    console.error("Media download error:", err);
    return null;
  }
}

/**
 * GET — WhatsApp webhook verification handshake.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function extractMessageInfo(msg: Record<string, unknown>): { body: string; mediaId: string | null } {
  const type = msg.type as string;
  const text = msg.text as { body?: string } | undefined;
  const button = msg.button as { text?: string } | undefined;
  const interactive = msg.interactive as { type?: string; button_reply?: { id?: string; title?: string }; list_reply?: { id?: string; title?: string } } | undefined;
  const image = msg.image as { id?: string; caption?: string } | undefined;
  const video = msg.video as { id?: string; caption?: string } | undefined;
  const audio = msg.audio as { id?: string } | undefined;
  const document = msg.document as { id?: string; filename?: string } | undefined;
  const sticker = msg.sticker as { id?: string } | undefined;
  const location = msg.location as { latitude?: number; longitude?: number } | undefined;

  switch (type) {
    case "text": return { body: text?.body ?? "", mediaId: null };
    case "button": return { body: button?.text ?? "", mediaId: null };
    case "interactive": return { body: interactive?.button_reply?.title || interactive?.list_reply?.title || "Quick Reply", mediaId: null };
    case "image": return { body: image?.caption ?? "[Image]", mediaId: image?.id ?? null };
    case "video": return { body: video?.caption ?? "[Video]", mediaId: video?.id ?? null };
    case "audio": return { body: "[Audio]", mediaId: audio?.id ?? null };
    case "document": return { body: document?.filename ?? "[Document]", mediaId: document?.id ?? null };
    case "sticker": return { body: "[Sticker]", mediaId: sticker?.id ?? null };
    case "location": return { body: `[Location: ${location?.latitude}, ${location?.longitude}]`, mediaId: null };
    default: return { body: `[${type}]`, mediaId: null };
  }
}

/**
 * POST — Receive incoming WhatsApp messages and status updates.
 */
export async function POST(request: Request) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Verify signature from Meta (REQUIRED in production)
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature || !APP_SECRET) {
    console.error("WhatsApp webhook: missing signature or app secret");
    return NextResponse.json({ error: "Missing signature" }, { status: 403 });
  }
  const expectedSig =
    "sha256=" +
    crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      console.error("WhatsApp webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const entries = (payload.entry as Array<Record<string, unknown>>) ?? [];

  for (const entry of entries) {
    const changes = (entry.changes as Array<Record<string, unknown>>) ?? [];

    for (const change of changes) {
      if (change.field !== "messages") continue;

      const value = change.value as Record<string, unknown> | undefined;
      if (!value) continue;

      const metadata = value.metadata as { phone_number_id?: string } | undefined;
      const phoneNumberId = metadata?.phone_number_id;
      const contacts = value.contacts as Array<{ profile?: { name?: string } }> | undefined;

      // Handle incoming messages
      const messages = (value.messages as Array<Record<string, unknown>>) ?? [];
      for (const msg of messages) {
        const from = msg.from as string;
        const contactName = contacts?.[0]?.profile?.name ?? "Inconnu";
        const type = msg.type as string;
        const { body: messageBody, mediaId } = extractMessageInfo(msg);
        const msgId = msg.id as string;

        console.log(`[WhatsApp] Message from ${contactName} (${from}): ${messageBody}`);

        // Download media if present
        let mediaUrl: string | null = null;
        if (mediaId) {
          mediaUrl = await downloadMedia(mediaId);
          console.log(`[WhatsApp] Media ${mediaId} → ${mediaUrl ?? "download failed"}`);
        }

        try {
          await prisma.whatsAppMessage.upsert({
            where: { waMessageId: msgId },
            update: {},
            create: {
              waMessageId: msgId,
              from,
              to: phoneNumberId ?? PHONE_NUMBER_ID,
              contactName,
              direction: "inbound",
              type,
              body: messageBody,
              mediaUrl,
            },
          });
        } catch (dbErr) {
          console.error("WhatsApp message save error:", dbErr);
        }

        // Survey button reply routing (exposant / visiteur)
        if (type === "interactive") {
          const interactive = msg.interactive as { button_reply?: { id?: string } } | undefined;
          const buttonId = interactive?.button_reply?.id;
          if (buttonId === SURVEY_BUTTON_EXPOSANT || buttonId === SURVEY_BUTTON_VISITEUR) {
            try {
              const phoneSuffix = from.replace(/^33/, "");
              const lead = await prisma.lead.findFirst({
                where: { phone: { contains: phoneSuffix }, source: "facebook_leads" },
                orderBy: { createdAt: "desc" },
              });
              const email = lead?.email || null;
              if (buttonId === SURVEY_BUTTON_EXPOSANT) {
                await sendExposantResponse(from, email);
              } else {
                await sendVisiteurResponse(from, email);
              }
              if (lead) {
                await prisma.lead.update({
                  where: { id: lead.id },
                  data: { profile: buttonId === SURVEY_BUTTON_EXPOSANT ? "Exposant" : "Visiteur" },
                });
              }
              console.log(`[Survey] ${buttonId} sent to ${from}`);
            } catch (surveyErr) {
              console.error("[Survey] Response error:", surveyErr);
            }
          }
        }

        // AI auto-reply drafts — DISABLED
        // if (messageBody && messageBody.length > 1) {
        //   generateAndStoreDraft(from, messageBody, contactName).catch((err) =>
        //     console.error("[WhatsApp AI] Draft error:", err),
        //   );
        // }

        // Auto-reply for exposant leads
        if (messageBody.toLowerCase().includes("devenir exposant")) {
          try {
            // Normalize phone: "from" is like "33782801852", we search with variations
            const phoneSuffix = from.replace(/^33/, "");
            const lead = await prisma.exposantLead.findFirst({
              where: {
                phone: { contains: phoneSuffix },
                status: "SENT",
              },
              orderBy: { createdAt: "desc" },
            });

            if (lead) {
              const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
              const depositUrl = `${appUrl}/exposants/devis/${lead.id}?t=${Date.now()}`;

              const reply = [
                `Bonjour ${lead.firstName} !`,
                ``,
                `Merci pour votre intérêt à exposer à ${lead.eventName}.`,
                ``,
                `Cliquez sur le lien ci-dessous pour accéder à votre devis personnalisé et sécurisé.`,
                ``,
                `👉 ${depositUrl}`,
                ``,
                `À très vite !`,
                `L'équipe Dream Team Africa`,
              ].join("\n");

              await sendWhatsAppText(from, reply);
              console.log(`[WhatsApp] Auto-reply sent to ${from} for lead ${lead.id}`);
            }
          } catch (autoErr) {
            console.error("[WhatsApp] Auto-reply error:", autoErr);
          }
        }
      }

      // Handle status updates (sent, delivered, read)
      const statuses = (value.statuses as Array<Record<string, unknown>>) ?? [];
      for (const st of statuses) {
        const stId = st.id as string;
        const stStatus = st.status as string;
        console.log(`[WhatsApp] Status: ${stStatus} for ${stId}`);

        try {
          await prisma.whatsAppMessage.updateMany({
            where: { waMessageId: stId },
            data: { status: stStatus },
          });
        } catch {
          // Message might not exist in DB
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
