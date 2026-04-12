import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { sendSurveyWelcome } from "@/lib/whatsapp-survey";
import { prisma } from "@/lib/db";

const VERIFY_TOKEN = process.env.FB_LEADS_VERIFY_TOKEN;
const FB_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

// Event slug mapping for lead follow-up URLs
const EVENT_URLS: Record<string, string> = {
  default: "https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris",
};

/**
 * GET — Facebook webhook verification (subscribe handshake).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && VERIFY_TOKEN && token) {
    try {
      const a = Buffer.from(token);
      const b = Buffer.from(VERIFY_TOKEN);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.log("Facebook Leads webhook verified");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST — Receive lead notifications from Facebook.
 */
export async function POST(request: Request) {
  try {
    // Verify Facebook webhook signature (X-Hub-Signature-256)
    const rawBody = await request.text();
    const fbSignature = request.headers.get("x-hub-signature-256");
    const appSecret = process.env.WHATSAPP_APP_SECRET || process.env.META_APP_SECRET;
    if (appSecret && fbSignature) {
      const { createHmac } = await import("crypto");
      const expectedSig = "sha256=" + createHmac("sha256", appSecret).update(rawBody).digest("hex");
      if (fbSignature !== expectedSig) {
        console.error("[Facebook Leads] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    console.log("Facebook lead webhook received");

    const entries = body.entry ?? [];

    for (const entry of entries) {
      const changes = entry.changes ?? [];

      for (const change of changes) {
        if (change.field !== "leadgen") continue;

        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        // Fetch full lead data from Facebook API
        const leadData = await fetchLeadData(leadgenId);
        if (!leadData) continue;

        const fields = parseLeadFields(leadData.field_data ?? []);
        const phone = fields.phone_number || fields.whatsapp_number;
        const name = fields.full_name || fields.first_name || "Client";
        const email = fields.email;
        const profile = fields["vous_êtes_?"] || fields["vous_etes"] || "Visiteur";

        console.log(`New lead: ${name}, ${email}, ${phone}, profile: ${profile}`);

        // Save lead to database
        try {
          await prisma.lead.create({
            data: {
              name,
              email: email ?? "",
              phone: phone ?? "",
              source: "facebook_leads",
              profile,
              formId: change.value?.form_id ?? "",
              fbLeadId: leadgenId,
            },
          });
        } catch (dbErr) {
          console.error("Lead save error (may be duplicate):", dbErr);
        }

        // Send WhatsApp survey (visiteur / exposant)
        if (phone) {
          try {
            const firstName = fields.first_name || (fields.full_name ? fields.full_name.split(" ")[0] : undefined);
            await sendSurveyWelcome(phone, firstName);
            console.log(`Survey sent to ${phone}`);
          } catch (waErr) {
            console.error(`Survey send failed for ${phone}:`, waErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Facebook leads webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * Fetch full lead data from Facebook Graph API.
 */
async function fetchLeadData(leadgenId: string) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/${leadgenId}?access_token=${FB_ACCESS_TOKEN}`,
    );
    if (!res.ok) {
      console.error("Facebook lead fetch error:", await res.text());
      return null;
    }
    return res.json();
  } catch (err) {
    console.error("Facebook lead fetch failed:", err);
    return null;
  }
}

/**
 * Parse Facebook lead field_data array into a simple key-value object.
 */
function parseLeadFields(
  fieldData: Array<{ name: string; values: string[] }>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of fieldData) {
    result[field.name] = field.values?.[0] ?? "";
  }
  return result;
}
