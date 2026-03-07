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
      <td style="padding: 10px 0; color: #666;">Paiement</td>
      <td style="padding: 10px 0; text-align: right;">${opts.installments}x ${formatter.format(opts.installmentAmount)}/mois</td>
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
      <p style="margin: 0; font-size: 14px; color: #1e40af;">Premier versement reçu (1/${opts.installments})</p>
      <p style="margin: 8px 0 0; font-size: 14px; color: #1e40af;">Total : ${formatter.format(opts.totalPrice)}</p>
    </div>`
  }

  <p>Notre équipe vous contactera prochainement avec tous les détails pratiques pour votre installation.</p>

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
