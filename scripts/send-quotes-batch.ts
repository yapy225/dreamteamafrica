import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

interface Exposant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  sector: string;
  description: string;
  event: string; // event id
  pack: "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION";
  totalDays: number;
  totalPrice: number;
  installments: number;
  installmentAmount: number;
}

// Foire d'Afrique Paris exposants (new ones not already in DB)
const exposants: Exposant[] = [
  {
    firstName: "A.A.D",
    lastName: "",
    email: "apertusmind@gmail.com",
    phone: "+243819997666",
    companyName: "Plateforme des Artisans de Kinshasa",
    sector: "Artisanat",
    description: "Réservation de deux stands pour des artisans venant de Kinshasa.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Viviane",
    lastName: "LECHAT",
    email: "avenirtogo94@gmail.com",
    phone: "+33688269861",
    companyName: "Avenir Togo 94",
    sector: "Association / Artisanat",
    description: "Vente d'artisanat rapporté du Togo au profit du CAST (Centre d'Action Sociale au Togo) qui accompagne plus de 530 enfants.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Mamadou",
    lastName: "Barry",
    email: "sogoregn@gmail.com",
    phone: "+224628084004",
    companyName: "CFC Sogoré",
    sector: "Mode / Couture",
    description: "Styliste-modéliste, fondateur du CFC Sogoré, centre de formation et de création. Mode africaine contemporaine, élégante et innovante.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Gaelle",
    lastName: "Koumbou",
    email: "babyson@hotmail.fr",
    phone: "+33611883711",
    companyName: "Beurre de Karité du Burkina",
    sector: "Cosmétique naturelle",
    description: "Large variété de beurres de karité artisanaux du Burkina Faso : aloe vera, cacao, miel, citron, curcuma, moringa... Savons à base de karité.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Félicité",
    lastName: "N'Diaye",
    email: "felicite_klock@hotmail.fr",
    phone: "+33644857171",
    companyName: "Jeff Food",
    sector: "Restauration caribéenne",
    description: "Restauratrice ambulante, menus antillais : colombo, accras, bokit, poulet boucané. Spécialiste caribéenne.",
    event: "foire-dafrique-paris",
    pack: "RESTAURATION",
    totalDays: 2,
    totalPrice: 1000,
    installments: 5,
    installmentAmount: 200,
  },
  {
    firstName: "Leila",
    lastName: "LINGOUPOU",
    email: "llingoupou.contact@gmail.com",
    phone: "+33769897101",
    companyName: "Caviar de Piment",
    sector: "Alimentaire",
    description: "Caviar de piment artisanal.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Sylvie",
    lastName: "JUMINER",
    email: "blakpenter@hotmail.fr",
    phone: "+33661200405",
    companyName: "Blakpenter Customisation",
    sector: "Mode / Customisation",
    description: "Créations et customisations d'articles de mode.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
  {
    firstName: "Prescillia",
    lastName: "Maria",
    email: "bymaria.creacouture@gmail.com",
    phone: "+33635176513",
    companyName: "By Maria Créa Couture",
    sector: "Mode / Couture",
    description: "Créations couture.",
    event: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    totalPrice: 380,
    installments: 5,
    installmentAmount: 76,
  },
];

const packNames: Record<string, string> = {
  ENTREPRENEUR_1J: "Pack Entrepreneur 1 jour",
  ENTREPRENEUR: "Pack Entrepreneur 2 jours",
  RESTAURATION: "Pack Restauration 2 jours",
};

function buildQuoteHtml(exp: Exposant, bookingId: string, profileToken: string) {
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>

  <p>Bonjour <strong>${exp.firstName} ${exp.lastName}</strong>,</p>

  <p>Merci pour votre demande de stand exposant. Voici votre devis :</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Entreprise</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${exp.companyName}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Foire d'Afrique Paris 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Formule</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${packNames[exp.pack]}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Durée</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${exp.totalDays} jour${exp.totalDays > 1 ? "s" : ""}</td>
    </tr>
    <tr style="border-bottom: 2px solid #8B6F4E;">
      <td style="padding: 10px 0; color: #666;">Total</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; font-size: 20px; color: #8B6F4E;">${formatter.format(exp.totalPrice)}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #666;">Paiement</td>
      <td style="padding: 10px 0; text-align: right;">${exp.installments}x ${formatter.format(exp.installmentAmount)}/mois</td>
    </tr>
  </table>

  <p style="font-size: 14px; color: #666;">
    Référence : <strong>${bookingId.slice(0, 8).toUpperCase()}</strong>
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
}

async function main() {
  let sent = 0;
  let skipped = 0;

  for (const exp of exposants) {
    // Check if booking already exists for this email
    const existing = await prisma.exhibitorBooking.findFirst({
      where: { email: exp.email },
    });

    if (existing) {
      console.log(`SKIP (already exists): ${exp.companyName} — ${exp.email}`);
      skipped++;
      continue;
    }

    // Find or create user
    let user = await prisma.user.findFirst({ where: { email: exp.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: randomUUID(),
          email: exp.email,
          name: `${exp.firstName} ${exp.lastName}`.trim(),
          role: "USER",
        },
      });
      console.log(`  Created user: ${user.name} (${user.email})`);
    }

    // Create booking
    const booking = await prisma.exhibitorBooking.create({
      data: {
        userId: user.id,
        companyName: exp.companyName,
        contactName: `${exp.firstName} ${exp.lastName}`.trim(),
        email: exp.email,
        phone: exp.phone,
        sector: exp.sector,
        pack: exp.pack,
        events: [exp.event],
        totalDays: exp.totalDays,
        totalPrice: exp.totalPrice,
        installments: exp.installments,
        installmentAmount: exp.installmentAmount,
        paidInstallments: 0,
        status: "PENDING",
      },
    });
    console.log(`  Created booking: ${booking.id} — ${exp.companyName}`);

    // Create profile
    const profileToken = randomUUID();
    await prisma.exhibitorProfile.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        token: profileToken,
        companyName: exp.companyName,
        sector: exp.sector,
        firstName: exp.firstName,
        lastName: exp.lastName,
        phone: exp.phone,
        email: exp.email,
        description: exp.description,
      },
    });
    console.log(`  Created profile with token: ${profileToken}`);

    // Send quote email
    const html = buildQuoteHtml(exp, booking.id, profileToken);
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: exp.email,
        subject: `Devis Exposant — ${packNames[exp.pack]} — Foire d'Afrique Paris 2026`,
        html,
      });
      console.log(`  ✓ Email sent to ${exp.email}`);
      sent++;
    } catch (err) {
      console.error(`  ✗ Email failed for ${exp.email}:`, err);
    }

    // Rate limit: wait 1.1s between emails
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nDone! Sent: ${sent}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
