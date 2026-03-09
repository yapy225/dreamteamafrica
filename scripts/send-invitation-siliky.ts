import "dotenv/config";
import { Resend } from "resend";
import QRCode from "qrcode";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Dream Team Africa <hello@dreamteamafrica.com>";

async function main() {
  const guestName = "SILIKY JEAN-JACQUES";
  const to = "slk17@live.fr";
  const eventTitle = "Foire D'Afrique Paris";
  const eventVenue = "Espace Mas";
  const eventAddress = "10 rue des terres au curé, Paris";
  const eventDate = new Date("2026-05-01T12:00:00");
  const guests = 4;
  const refCode = "INV-SILIKY";
  const coverImage = "https://dreamteamafricamedia.b-cdn.net/saisonculturelleafricaine/foiredafriqueparis/foiredafriqueparis.png";

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);

  // Generate QR code as data URL
  const qrData = `INVITE-FOIREDAFRIQUE-SILIKY-4PLACES`;
  const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:Georgia,serif;color:#1a1a1a;margin:0;padding:0;background:#f5f0ea;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="margin:0;font-size:20px;color:#8B6F4E;">Dream Team Africa</h1>
      <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;">Invitation personnelle</p>
    </div>

    <!-- Message d'excuse + invitation -->
    <p style="font-size:15px;margin-bottom:12px;">
      Bonjour <strong>${guestName}</strong>,
    </p>

    <p style="font-size:14px;line-height:1.7;color:#333;">
      Veuillez nous excuser pour notre manque de réactivité ces derniers jours — nous étions pleinement mobilisés sur le déploiement de notre nouveau site internet.
    </p>

    <p style="font-size:14px;line-height:1.7;color:#333;">
      Nous avons le plaisir de vous adresser <strong>4 billets d'invitation</strong> pour la <strong>Foire D'Afrique Paris</strong>. Vous êtes le bienvenu avec vos invités !
    </p>

    <p style="font-size:14px;line-height:1.7;color:#333;">
      Découvrez l'ensemble de notre programmation sur
      <a href="https://saisonculturelleafricaine.fr" style="color:#8B6F4E;font-weight:bold;">saisonculturelleafricaine.fr</a>
    </p>

    <!-- TICKET CARD -->
    <div style="background:#1A1A1A;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);margin-top:24px;">

      <!-- Cover image -->
      <div style="position:relative;border-radius:12px 12px 0 0;overflow:hidden;height:200px;background:#1A1A1A;">
        <img src="${coverImage}" alt="${eventTitle}" style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.8;" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,#1A1A1A 0%,rgba(26,26,26,0.3) 50%,transparent 100%);"></div>
        <div style="position:absolute;bottom:16px;left:20px;right:20px;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#d4af37;font-family:Arial,sans-serif;">Invitation — 4 places</p>
          <h2 style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#fff;line-height:1.2;">${eventTitle}</h2>
        </div>
      </div>

      <!-- Divider dots -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1A1A;">
        <tr>
          <td width="12" style="background:#f5f0ea;border-radius:0 50% 50% 0;height:20px;"></td>
          <td style="border-bottom:2px dashed rgba(255,255,255,0.15);"></td>
          <td width="12" style="background:#f5f0ea;border-radius:50% 0 0 50%;height:20px;"></td>
        </tr>
      </table>

      <!-- Ticket info -->
      <div style="padding:20px;background:#1A1A1A;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;padding-right:16px;">
              <p style="margin:0;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;">Invité</p>
              <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#fff;">${guestName}</p>

              <div style="margin-top:10px;">
                <span style="display:inline-block;background:#d4af37;color:#1A1A1A;padding:4px 12px;border-radius:4px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">
                  Invitation — 4 places
                </span>
              </div>

              <table style="margin-top:14px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Date</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#fff;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Lieu</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#fff;">${eventVenue}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Adresse</td>
                  <td style="padding:3px 0;font-size:12px;color:rgba(255,255,255,0.6);">${eventAddress}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Places</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#d4af37;">4 places</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Réf.</td>
                  <td style="padding:3px 0;font-size:11px;font-family:monospace;color:rgba(255,255,255,0.5);">${refCode}</td>
                </tr>
              </table>
            </td>

            <!-- QR Code -->
            <td style="vertical-align:top;text-align:center;width:200px;">
              <div style="background:#fff;border-radius:10px;padding:8px;display:inline-block;">
                <img src="${qrCodeUrl}" alt="QR Code" width="180" height="180" style="width:180px;height:180px;display:block;" />
              </div>
              <p style="margin:6px 0 0;font-size:8px;color:rgba(255,255,255,0.2);font-family:Arial,sans-serif;">Présentez ce code à l'entrée</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Footer ticket -->
      <div style="padding:8px 20px;background:rgba(255,255,255,0.03);">
        <table width="100%"><tr>
          <td style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.15);font-family:Arial,sans-serif;">Dream Team Africa — Saison 2026</td>
          <td style="text-align:right;font-size:8px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.15);font-family:Arial,sans-serif;">Billet non cessible</td>
        </tr></table>
      </div>

    </div>

    <!-- Instructions -->
    <div style="margin-top:24px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e8dfd3;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#1a1a1a;">Informations pratiques</h3>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#666;line-height:1.8;">
        <li>Présentez ce QR code (imprimé ou sur mobile) à l'entrée</li>
        <li>Ce billet est valable pour <strong>4 personnes</strong></li>
        <li>Adresse : <strong>${eventVenue}</strong>, ${eventAddress}</li>
        <li>Conservez cet email, il fait office de billet</li>
      </ul>
    </div>

    <!-- CTA Saison Culturelle -->
    <div style="margin-top:24px;text-align:center;">
      <a href="https://saisonculturelleafricaine.fr" style="display:inline-block;background:#8B6F4E;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;">
        Découvrir la Saison Culturelle Africaine 2026
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;text-align:center;font-size:11px;color:#999;">
      <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
      <p>contact@dreamteamafrica.com</p>
    </div>

  </div>
</body>
</html>`;

  console.log(`Sending invitation to ${to}...`);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Invitation — 4 places — Foire D'Afrique Paris 2026`,
    html,
  });

  if (error) {
    console.error("Error:", error);
    process.exit(1);
  }

  console.log(`✓ Email envoyé avec succès ! ID: ${data?.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
