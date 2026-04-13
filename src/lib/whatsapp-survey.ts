import { Resend } from "resend";

const WA_API = "https://graph.facebook.com/v23.0";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

export const SURVEY_BUTTON_VISITEUR = "survey_visiteur";
export const SURVEY_BUTTON_EXPOSANT = "survey_exposant";

function normalizePhone(phone: string): string {
  let c = phone.replace(/[\s\-().+]/g, "");
  if (c.startsWith("0") && c.length === 10) c = "33" + c.slice(1);
  return c;
}

async function waFetch(body: unknown) {
  const res = await fetch(`${WA_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API ${res.status}: ${err}`);
  }
  return res.json();
}

export async function sendSurveyWelcome(phone: string, firstName?: string) {
  const greeting = firstName ? `Bonjour ${firstName}` : "Bonjour";
  return waFetch({
    messaging_product: "whatsapp",
    to: normalizePhone(phone),
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `${greeting} 😊\n\nMerci d'avoir rempli notre formulaire via Dream Team Africa !\n\nLa Foire d'Afrique Paris — 6ème Édition aura lieu les 1er & 2 mai 2026 à l'Espace MAS (Paris 13e) 🇫🇷🌍\n\nPour mieux vous orienter, dites-nous :\nÊtes-vous intéressé(e) pour venir en visiteur, ou pour exposer ?`,
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: SURVEY_BUTTON_VISITEUR, title: "🎟️ Je viens visiter" } },
          { type: "reply", reply: { id: SURVEY_BUTTON_EXPOSANT, title: "🛍️ Je veux exposer" } },
        ],
      },
    },
  });
}

const DEVIS_TEXT = `Super ! 🎉 Voici les infos exposant :

💼 Stand Exposant — 2 m² (1 table 1,50 m x 0,60 m + 2 chaises + 2 badges)
• 1 jour : 190 €
• 2 jours : 320 € (160 €/jour)

💳 Réservation avec 50 € d'acompte, solde en mensualités.
👉 https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

Pourriez-vous me préciser votre marque / secteur d'activité pour un devis personnalisé ?`;

const VISITEUR_TEXT = `Génial, on a hâte de vous accueillir ! 🎉

🗓️ Foire d'Afrique Paris — 1er & 2 mai 2026
📍 Espace MAS, 10 rue des Terres au Curé, Paris 13e
⏰ 12h — 22h

Au programme : +50 exposants (mode, cosmétiques, gastronomie, artisanat), défilés, concerts, ateliers, restauration africaine 🌍✨

🎟️ Billet Early Bird : 10 € (au lieu de 15 €)
👉 https://dreamteamafrica.com/billetterie/foire-dafrique-paris

🎭 Avec le programme Culture Pour Tous, réservez dès 5 € votre place et soutenez la Saison Culturelle Africaine :
👉 https://dreamteamafrica.com/saison-culturelle-africaine

À très vite !`;

export async function sendExposantResponse(phone: string, email?: string | null) {
  await waFetch({
    messaging_product: "whatsapp",
    to: normalizePhone(phone),
    type: "text",
    text: { preview_url: true, body: DEVIS_TEXT },
  });

  if (email) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre devis exposant — Foire d'Afrique Paris 2026",
      html: `<p>Super ! 🎉 Voici les infos exposant :</p>
<p>💼 <strong>Stand Exposant — 2 m²</strong> (1 table 1,50 m x 0,60 m + 2 chaises + 2 badges)<br>
• 1 jour : <strong>190 €</strong><br>
• 2 jours : <strong>320 €</strong> (160 €/jour)</p>
<p>💳 Réservation avec <strong>50 € d'acompte</strong>, solde en mensualités.<br>
👉 <a href="https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris">Réserver mon stand</a></p>
<p>Pourriez-vous me préciser votre <strong>marque / secteur d'activité</strong> pour un devis personnalisé ?</p>
<p>À très vite !<br>— L'équipe Dream Team Africa</p>`,
    });
  }
}

export async function sendVisiteurResponse(phone: string, email?: string | null) {
  await waFetch({
    messaging_product: "whatsapp",
    to: normalizePhone(phone),
    type: "text",
    text: { preview_url: true, body: VISITEUR_TEXT },
  });

  if (email) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Foire d'Afrique Paris 2026 — On a hâte de vous accueillir !",
      html: `<p>Génial, on a hâte de vous accueillir ! 🎉</p>
<p>🗓️ <strong>Foire d'Afrique Paris</strong> — 1er & 2 mai 2026<br>
📍 Espace MAS, 10 rue des Terres au Curé, Paris 13e<br>
⏰ 12h — 22h</p>
<p>Au programme : <strong>+50 exposants</strong> (mode, cosmétiques, gastronomie, artisanat), défilés, concerts, ateliers, restauration africaine 🌍✨</p>
<p>🎟️ <strong>Billet Early Bird : 10 €</strong> (au lieu de 15 €)<br>
👉 <a href="https://dreamteamafrica.com/billetterie/foire-dafrique-paris">Réserver mon billet</a></p>
<p>🎭 Avec le programme <strong>Culture Pour Tous</strong>, réservez <strong>dès 5 €</strong> votre place et soutenez la Saison Culturelle Africaine :<br>
👉 <a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir le programme</a></p>
<p>À très vite !<br>— L'équipe Dream Team Africa</p>`,
    });
  }
}
