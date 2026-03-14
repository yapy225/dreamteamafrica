import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <onboarding@resend.dev>";

export async function sendQuoteEmail(opts: {
  to: string;
  contactName: string;
  companyName: string;
  eventTitle: string;
  packName: string;
  totalDays: number;
  totalPrice: number;
  installments: number;
  installmentAmount: number;
  bookingId: string;
  profileToken?: string;
}) {
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>

  <p>Bonjour <strong>${opts.contactName}</strong>,</p>

  <p>Merci pour votre demande de stand exposant. Voici votre devis :</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Entreprise</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.companyName}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.eventTitle}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Formule</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.packName}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Durée</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.totalDays} jour${opts.totalDays > 1 ? "s" : ""}</td>
    </tr>
    <tr style="border-bottom: 2px solid #8B6F4E;">
      <td style="padding: 10px 0; color: #666;">Total</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; font-size: 20px; color: #8B6F4E;">${formatter.format(opts.totalPrice)}</td>
    </tr>
    ${
      opts.installments > 1
        ? `<tr>
      <td style="padding: 10px 0; color: #666;">Acompte</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #8B6F4E;">${formatter.format(50)}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #666;">Solde</td>
      <td style="padding: 10px 0; text-align: right;">${opts.installments - 1}x ${formatter.format(opts.installmentAmount)}/mois</td>
    </tr>`
        : ""
    }
  </table>

  <p style="font-size: 14px; color: #666;">
    Référence : <strong>${opts.bookingId}</strong>
  </p>

  <p style="font-size: 14px; color: #666;">
    Ce devis est valable 15 jours. Pour confirmer votre réservation, vous pouvez procéder au paiement
    en répondant à cet email ou en nous contactant directement.
  </p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Devis Exposant — ${opts.packName} — ${opts.eventTitle}`,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendThankYouEmail(opts: {
  to: string;
  contactName: string;
  companyName: string;
  totalPrice: number;
  installments: number;
  isFullyPaid: boolean;
  profileToken?: string;
}) {
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Confirmation de paiement</p>
  </div>

  <p>Bonjour <strong>${opts.contactName}</strong>,</p>

  <p>Merci pour votre paiement ! Votre r${opts.isFullyPaid ? "éservation de stand pour <strong>" + opts.companyName + "</strong> est confirmée" : "éservation de stand pour <strong>" + opts.companyName + "</strong> est bien enregistrée. Votre premier versement a été reçu"}.</p>

  ${
    opts.isFullyPaid
      ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #166534;">Paiement complet reçu</p>
      <p style="margin: 8px 0 0; font-size: 24px; font-weight: bold; color: #166534;">${formatter.format(opts.totalPrice)}</p>
    </div>`
      : `<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">Acompte de ${formatter.format(50)} reçu</p>
      <p style="margin: 8px 0 0; font-size: 14px; color: #1e40af;">Solde restant : ${formatter.format(opts.totalPrice - 50)} en ${opts.installments - 1} mensualité${opts.installments - 1 > 1 ? "s" : ""}</p>
    </div>`
  }

  <div style="margin-top: 24px; padding: 20px; background: #fdf8f0; border: 1px solid #e8dfd3; border-radius: 8px;">
    <h3 style="margin: 0 0 8px; font-size: 16px; color: #8B6F4E;">Maximisez votre visibilité</h3>
    <p style="margin: 0 0 16px; font-size: 14px; color: #666;">
      Complétez votre fiche exposant depuis votre espace client pour bénéficier d'une visibilité
      sur nos réseaux sociaux et supports de communication : logo, photos produits, vidéo, description…
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/mon-stand"
       style="display: inline-block; background: #8B6F4E; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
      Compléter ma fiche exposant
    </a>
  </div>

  <p style="margin-top: 20px;">Notre équipe vous contactera prochainement avec tous les détails pratiques pour votre installation.</p>

  <p>À très bientôt !</p>

  <p style="margin-top: 8px;"><strong>L'équipe Dream Team Africa</strong></p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: opts.isFullyPaid
      ? `Merci ! Votre stand est confirmé — ${opts.companyName}`
      : `Merci pour votre paiement — ${opts.companyName}`,
    html,
  });

  if (error) {
    console.error("Thank you email error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendFreeTicketEmail(opts: {
  to: string;
  guestName: string;
  eventTitle: string;
  eventVenue: string;
  eventAddress: string;
  eventDate: Date;
  eventCoverImage: string | null;
  guests: number;
  reservationId: string;
  qrCodeUrl: string;
}) {
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(opts.eventDate));

  const refCode = opts.reservationId.slice(0, 8).toUpperCase();

  const coverSection = opts.eventCoverImage
    ? `<div style="position:relative;border-radius:12px 12px 0 0;overflow:hidden;height:200px;background:#1A1A1A;">
        <img src="${opts.eventCoverImage}" alt="${opts.eventTitle}" style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.8;" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,#1A1A1A 0%,rgba(26,26,26,0.3) 50%,transparent 100%);"></div>
        <div style="position:absolute;bottom:16px;left:20px;right:20px;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#d4af37;font-family:Arial,sans-serif;">Entrée gratuite</p>
          <h2 style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#fff;line-height:1.2;">${opts.eventTitle}</h2>
        </div>
      </div>`
    : `<div style="border-radius:12px 12px 0 0;background:linear-gradient(135deg,#8B6F4E,#6F5A3E);padding:30px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7);font-family:Arial,sans-serif;">Entrée gratuite</p>
        <h2 style="margin:8px 0 0;font-size:22px;font-weight:bold;color:#fff;line-height:1.2;">${opts.eventTitle}</h2>
      </div>`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:Georgia,serif;color:#1a1a1a;margin:0;padding:0;background:#f5f0ea;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="margin:0;font-size:20px;color:#8B6F4E;">Dream Team Africa</h1>
      <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;">Confirmation de réservation</p>
    </div>

    <!-- Greeting -->
    <p style="font-size:15px;margin-bottom:20px;">
      Bonjour <strong>${opts.guestName}</strong>,<br>
      Votre réservation est confirmée ! Voici votre billet d'entrée :
    </p>

    <!-- TICKET CARD -->
    <div style="background:#1A1A1A;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);">

      <!-- Cover image -->
      ${coverSection}

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
              <!-- Guest name -->
              <p style="margin:0;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;">Invité(e)</p>
              <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#fff;">${opts.guestName}</p>

              <!-- Badge -->
              <div style="margin-top:10px;">
                <span style="display:inline-block;background:#10b981;color:#fff;padding:4px 12px;border-radius:4px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">
                  Entrée gratuite${opts.guests > 1 ? ` — ${opts.guests} places` : ""}
                </span>
              </div>

              <!-- Details -->
              <table style="margin-top:14px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Date</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#fff;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Lieu</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#fff;">${opts.eventVenue}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Adresse</td>
                  <td style="padding:3px 0;font-size:12px;color:rgba(255,255,255,0.6);">${opts.eventAddress}</td>
                </tr>
                <tr>
                  <td style="padding:3px 16px 3px 0;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Places</td>
                  <td style="padding:3px 0;font-size:12px;font-weight:600;color:#d4af37;">${opts.guests} place${opts.guests > 1 ? "s" : ""}</td>
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
                <img src="${opts.qrCodeUrl}" alt="QR Code" width="180" height="180" style="width:180px;height:180px;display:block;" />
              </div>
              <p style="margin:6px 0 0;font-size:8px;color:rgba(255,255,255,0.2);font-family:Arial,sans-serif;">Présentez ce code à l'entrée</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
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
        <li>${opts.guests > 1 ? `Ce billet est valable pour <strong>${opts.guests} personnes</strong>` : "Ce billet est valable pour <strong>1 personne</strong>"}</li>
        <li>Adresse : <strong>${opts.eventVenue}</strong>, ${opts.eventAddress}</li>
        <li>Conservez cet email, il fait office de billet</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;font-size:11px;color:#999;">
      <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
      <p>contact@dreamteamafrica.com</p>
    </div>

  </div>
</body>
</html>`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Votre billet — ${opts.eventTitle}`,
    html,
  });

  if (error) {
    console.error("Free ticket email error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendExhibitorProfileNotification(opts: {
  companyName: string;
  contactName: string;
  profileId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "hello@dreamteamafrica.com";
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/exposants`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Notification Admin</p>
  </div>

  <p>Nouvelle fiche exposant soumise !</p>

  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #166534;">${opts.companyName}</p>
    <p style="margin: 8px 0 0; font-size: 14px; color: #166534;">Soumise par ${opts.contactName}</p>
  </div>

  <p>Connectez-vous au dashboard pour consulter, modifier et valider la fiche :</p>

  <a href="${dashboardUrl}"
     style="display: inline-block; background: #8B6F4E; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
    Voir dans le dashboard
  </a>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Notification automatique</p>
  </div>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `Fiche exposant soumise — ${opts.companyName}`,
      html,
    });
  } catch (err) {
    console.error("Admin notification email failed:", err);
  }
}

export async function sendSurveyEmail(opts: { to: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const surveyUrl = `${baseUrl}/sondage/foire-afrique`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f0ea;">
  <div style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B6F4E, #6F5A3E); padding: 30px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; color: #fff;">Dream Team Africa</h1>
      <p style="margin: 8px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.7);">Foire d'Afrique Paris — 6ème édition</p>
    </div>

    <div style="padding: 30px 24px;">
      <p style="font-size: 15px; line-height: 1.6;">Bonjour,</p>

      <p style="font-size: 15px; line-height: 1.6;">
        La <strong>6ème édition de la Foire d'Afrique Paris</strong> se tiendra les
        <strong>1er et 2 mai 2026</strong> à l'<strong>Espace MAS</strong> (Paris 13e).
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        Seriez-vous prêt(e) à exposer cette année ?
      </p>

      <!-- Boutons Oui / Non -->
      <div style="margin: 28px 0; text-align: center;">
        <a href="${surveyUrl}"
           style="display: inline-block; background: #22c55e; color: #fff; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-right: 12px;">
          ✓ Oui, je suis intéressé(e)
        </a>
        <a href="${surveyUrl}"
           style="display: inline-block; background: #ef4444; color: #fff; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          ✗ Non merci
        </a>
      </div>

      <div style="background: #fdf8f0; border: 1px solid #e8dfd3; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold; color: #8B6F4E;">Infos pratiques</p>
        <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #666; line-height: 1.8;">
          <li><strong>Dates :</strong> 1er & 2 mai 2026</li>
          <li><strong>Lieu :</strong> Espace MAS — 10 rue des terres au curé, Paris 13e</li>
          <li><strong>Horaires :</strong> 12h – 22h</li>
          <li><strong>Stand à partir de :</strong> 190 €</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #666; line-height: 1.6;">
        Répondez en 30 secondes et nous vous recontacterons par <strong>WhatsApp</strong> avec notre proposition personnalisée.
      </p>

      <p style="margin-top: 24px;">À très bientôt !</p>
      <p><strong>L'équipe Dream Team Africa</strong></p>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background: #f9f6f2; border-top: 1px solid #e8dfd3; font-size: 11px; color: #999; text-align: center;">
      <p style="margin: 0;">Dream Team Africa — Saison Culturelle Africaine 2026</p>
      <p style="margin: 4px 0 0;">contact@dreamteamafrica.com</p>
    </div>

  </div>
</body>
</html>`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: "Foire d'Afrique Paris 2026 — Seriez-vous prêt(e) à exposer ?",
    html,
  });

  if (error) {
    console.error("Survey email error:", error);
    throw new Error(`Failed to send survey email: ${error.message}`);
  }
}
