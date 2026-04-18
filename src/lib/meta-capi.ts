import crypto from "crypto";

const PIXEL_ID = "502775309263991";
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

function getAccessToken(): string | null {
  return (
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.META_LONG_LIVED_TOKEN ||
    process.env.WHATSAPP_ACCESS_TOKEN ||
    null
  );
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

type PurchaseInput = {
  eventId: string;
  value: number;
  currency?: string;
  contentName: string;
  contentIds?: string[];
  numItems?: number;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  sourceUrl?: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

export async function sendMetaPurchaseEvent(input: PurchaseInput): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    console.warn("[meta-capi] No access token configured, skipping CAPI event");
    return;
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(normalizePhone(input.phone))];
  if (input.firstName) userData.fn = [sha256(input.firstName)];
  if (input.lastName) userData.ln = [sha256(input.lastName)];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url:
          input.sourceUrl || "https://dreamteamafrica.com/billetterie/foire-dafrique-paris",
        user_data: userData,
        custom_data: {
          currency: input.currency || "EUR",
          value: input.value,
          content_name: input.contentName,
          content_type: "product",
          content_ids: input.contentIds || [input.eventId],
          num_items: input.numItems || 1,
        },
      },
    ],
  };

  try {
    const res = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[meta-capi] Purchase event failed ${res.status}: ${errText}`);
      return;
    }

    const json = await res.json();
    console.log(
      `[meta-capi] Purchase event sent: ${input.eventId} (value=${input.value}€, received=${json.events_received || 0})`
    );
  } catch (err) {
    console.error("[meta-capi] Purchase event error:", err);
  }
}
