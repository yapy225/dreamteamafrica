const WHATSAPP_API_URL = "https://graph.facebook.com/v23.0";

function getPhoneNumberId() {
  return process.env.WHATSAPP_PHONE_NUMBER_ID!;
}

function getAccessToken() {
  return process.env.WHATSAPP_ACCESS_TOKEN!;
}

/**
 * Send a WhatsApp template message.
 * Templates must be pre-approved in the Meta Business Manager.
 */
export async function sendWhatsAppTemplate(opts: {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: Array<{
    type: "header" | "body" | "button";
    parameters: Array<{ type: "text"; text: string } | { type: "image"; image: { link: string } }>;
  }>;
}) {
  const phoneNumberId = getPhoneNumberId();
  const accessToken = getAccessToken();

  const body: Record<string, unknown> = {
    messaging_product: "whatsapp",
    to: normalizePhone(opts.to),
    type: "template",
    template: {
      name: opts.templateName,
      language: { code: opts.languageCode ?? "fr" },
      ...(opts.components && { components: opts.components }),
    },
  };

  const res = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("WhatsApp API error:", JSON.stringify(error));
    throw new Error(`WhatsApp send failed: ${res.status} ${JSON.stringify(error)}`);
  }

  const data = await res.json();
  console.log(`WhatsApp message sent to ${opts.to}:`, data.messages?.[0]?.id);
  return data;
}

/**
 * Send a free-form text message (only within 24h customer service window).
 */
export async function sendWhatsAppText(to: string, text: string) {
  const phoneNumberId = getPhoneNumberId();
  const accessToken = getAccessToken();

  const res = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhone(to),
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("WhatsApp text error:", JSON.stringify(error));
    throw new Error(`WhatsApp text failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Send ticket confirmation via WhatsApp.
 */
export async function sendTicketConfirmationWhatsApp(opts: {
  phone: string;
  customerName: string;
  eventTitle: string;
  tier: string;
  quantity: number;
  totalPrice: number;
  eventDate: string;
  eventVenue: string;
}) {
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return sendWhatsAppTemplate({
    to: opts.phone,
    templateName: "ticket_confirmation",
    languageCode: "fr",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: opts.customerName },
          { type: "text", text: `${opts.quantity}x ${opts.tier}` },
          { type: "text", text: opts.eventTitle },
          { type: "text", text: opts.eventDate },
          { type: "text", text: opts.eventVenue },
          { type: "text", text: formatter.format(opts.totalPrice) },
        ],
      },
    ],
  });
}

/**
 * Send event reminder (J-1) via WhatsApp.
 */
export async function sendEventReminderWhatsApp(opts: {
  phone: string;
  customerName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventAddress: string;
}) {
  return sendWhatsAppTemplate({
    to: opts.phone,
    templateName: "event_reminder",
    languageCode: "fr",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: opts.customerName },
          { type: "text", text: opts.eventTitle },
          { type: "text", text: opts.eventDate },
          { type: "text", text: opts.eventVenue },
          { type: "text", text: opts.eventAddress },
        ],
      },
    ],
  });
}

/**
 * Normalize phone to international format (remove spaces, dashes, ensure +).
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, "");
  // French number without country code
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "33" + cleaned.slice(1);
  }
  // Remove leading +
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}
