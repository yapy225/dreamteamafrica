import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

const VERIFY_TOKEN = process.env.FB_LEADS_VERIFY_TOKEN ?? process.env.CRON_SECRET!;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

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

function extractMessageBody(msg: Record<string, unknown>): string {
  const type = msg.type as string;
  const text = msg.text as { body?: string } | undefined;
  const button = msg.button as { text?: string } | undefined;
  const image = msg.image as { caption?: string } | undefined;
  const document = msg.document as { filename?: string } | undefined;
  const location = msg.location as { latitude?: number; longitude?: number } | undefined;

  switch (type) {
    case "text": return text?.body ?? "";
    case "button": return button?.text ?? "";
    case "image": return image?.caption ?? "[Image]";
    case "document": return document?.filename ?? "[Document]";
    case "audio": return "[Audio]";
    case "video": return "[Video]";
    case "sticker": return "[Sticker]";
    case "location": return `[Location: ${location?.latitude}, ${location?.longitude}]`;
    default: return `[${type}]`;
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

  // Verify signature from Meta (skip if no signature header, e.g. test mode)
  const signature = request.headers.get("x-hub-signature-256");
  if (signature && APP_SECRET) {
    const expectedSig =
      "sha256=" +
      crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
    if (signature !== expectedSig) {
      console.error("WhatsApp webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
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
        const messageBody = extractMessageBody(msg);
        const msgId = msg.id as string;

        console.log(`[WhatsApp] Message from ${contactName} (${from}): ${messageBody}`);

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
              mediaUrl: null,
            },
          });
        } catch (dbErr) {
          console.error("WhatsApp message save error:", dbErr);
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
