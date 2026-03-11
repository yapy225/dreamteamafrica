import { NextResponse } from "next/server";
import crypto from "crypto";

const VERIFY_TOKEN = process.env.FB_LEADS_VERIFY_TOKEN ?? process.env.CRON_SECRET!;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET!;

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

/**
 * POST — Receive incoming WhatsApp messages and status updates.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify signature from Meta
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

    const body = JSON.parse(rawBody);
    const entries = body.entry ?? [];

    for (const entry of entries) {
      const changes = entry.changes ?? [];

      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value;

        // Handle incoming messages
        const messages = value?.messages ?? [];
        for (const msg of messages) {
          const from = msg.from; // sender phone number
          const timestamp = msg.timestamp;
          const type = msg.type;
          const contactName =
            value.contacts?.[0]?.profile?.name ?? "Inconnu";

          if (type === "text") {
            console.log(
              `[WhatsApp] Message from ${contactName} (${from}): ${msg.text?.body}`
            );
          } else if (type === "image") {
            console.log(
              `[WhatsApp] Image from ${contactName} (${from}): ${msg.image?.id}`
            );
          } else if (type === "button") {
            console.log(
              `[WhatsApp] Button from ${contactName} (${from}): ${msg.button?.text}`
            );
          } else {
            console.log(
              `[WhatsApp] ${type} from ${contactName} (${from}) at ${timestamp}`
            );
          }
        }

        // Handle status updates (sent, delivered, read)
        const statuses = value?.statuses ?? [];
        for (const status of statuses) {
          console.log(
            `[WhatsApp] Status: ${status.status} for message ${status.id} to ${status.recipient_id}`
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
