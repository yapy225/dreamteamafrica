import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

// Prospects exposants filtrés depuis les mails (pas de booking existant, pas de spam/artistes/mannequins/médias)
const prospects = [
  { name: "JeSs L.", email: "j.lansse@gmail.com" },
  { name: "Naatsnawaar", email: "nawaarnaats@gmail.com" },
  { name: "Mireille Rouamba", email: "rouambamireille@yahoo.fr" },
  { name: "Sonnya Miatoudila", email: "africanbucketservices@gmail.com" },
  { name: "Angele Siriki", email: "angeles.busyness@gmail.com" },
  { name: "Salla Ndour", email: "famasalla@gmail.com" },
  { name: "Mountaga Thiam", email: "galerieadjilika@yahoo.com" },
  { name: "Mountaga Thiam", email: "mountagathiam86@gmail.com" },
  { name: "Traiteur KinBrazza", email: "traiteurkinbrazza@yahoo.com" },
  { name: "Fatimkania Bah", email: "fatimkaniabah@gmail.com" },
  { name: "Khadjatou Dia", email: "diasatura@gmail.com" },
  { name: "Raissa Paul Joseph", email: "slaviolette2710@hotmail.fr" },
  { name: "Aude Faignond", email: "contactsanaacreation@gmail.com" },
  { name: "SHYk Services", email: "shykservices@gmail.com" },
  { name: "Chancelvie Mak", email: "chancelviem6@gmail.com" },
  { name: "Kay Fritay", email: "kay-fritay@outlook.com" },
  { name: "Afrinity Déco", email: "afrinitydeco@gmail.com" },
  { name: "Fatou Seyni Faye", email: "fatseyni@gmail.com" },
  { name: "Mukoko Keller", email: "mukoko.keller@yahoo.fr" },
  { name: "Fabien", email: "fabkinshasa2024@gmail.com" },
  { name: "Ginette Ngeuleu", email: "gngeuleu@yahoo.fr" },
  { name: "Paty M Bokutani", email: "bokutanib@gmail.com" },
  { name: "Marie Meyo", email: "mariemeyo285@gmail.com" },
  { name: "Anchya", email: "anchya.16@gmail.com" },
  { name: "Mariam Seydi", email: "seydimariam@gmail.com" },
  { name: "ACRAA Distribution", email: "contact@acraa-distribution.com" },
  { name: "Fatoumata Kone", email: "kone2880.fk@gmail.com" },
  { name: "Consultant RPS", email: "epicureepicure86@gmail.com" },
  { name: "Yao Pretence Gbahy", email: "yaopretence00@gmail.com" },
  { name: "Geneviève Picot", email: "gencopi19@gmail.com" },
  { name: "Bintou Mariko", email: "bmariko@gmail.com" },
  { name: "Saphir Samba", email: "sambasaphir2019@hotmail.com" },
  { name: "Virginie Katenga", email: "contact@elglorious.com" },
  { name: "Bertine Nguiateu", email: "bk2lifestyle1@gmail.com" },
  { name: "Ngassakidila Africa", email: "ngassakidila.africa@outlook.com" },
  { name: "Nafyssa Cissé", email: "nafyssacisse@gmail.com" },
  { name: "Ines Diarra", email: "ineshalimadiarra@icloud.com" },
  { name: "Gaelle Choisy", email: "reignofbeauty@outlook.fr" },
  { name: "Anne Fleury", email: "annfleury@gmail.com" },
  { name: "Jessica Singa", email: "jessicasinga77@gmail.com" },
  { name: "Mia Dogo Traiteur", email: "traiteur@miadogo.com" },
  { name: "Makakreation Keita", email: "makacreation19@gmail.com" },
  { name: "Yemuna Queen", email: "naturellemineral97@gmail.com" },
  { name: "Oumar Fall", email: "oumarfall71@gmail.com" },
  { name: "Moussa Drame", email: "fierdemesoriginesmd@gmail.com" },
  { name: "Dieynaba Kante", email: "dieynissa95140@gmail.com" },
  { name: "Trung Truc Nguyen", email: "trnguyen68@yahoo.fr" },
  { name: "Leina Mpondo Akwa", email: "leinakwa@icloud.com" },
  { name: "Christian Kamtchueng", email: "christian.kamtchueng@gmail.com" },
  { name: "AD Mundo", email: "admundo04@gmail.com" },
  { name: "Chyldania", email: "kinouanichyldania@gmail.com" },
  { name: "Binkss Fabiano", email: "ombaingo@gmail.com" },
  { name: "Nomfundo Moeng", email: "nomfundo29@gmail.com" },
  { name: "Naturo Nissa", email: "naturo.nissa55@gmail.com" },
  { name: "Marinina", email: "marinina972@gmail.com" },
  { name: "Yaye Aidara", email: "bassonyfa@gmail.com" },
  { name: "Yohel Toys", email: "yoheltoys@gmail.com" },
  { name: "Laure Galiba", email: "lauregaliba@gmail.com" },
  { name: "ELLURE JATIE", email: "ellurejatie@gmail.com" },
];

function buildProposalHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Saison Culturelle Africaine 2026</p>
  </div>

  <p>Bonjour <strong>${name}</strong>,</p>

  <p>Suite à votre prise de contact, nous avons le plaisir de vous présenter nos prochains événements de la <strong>Saison Culturelle Africaine 2026</strong> à Paris.</p>

  <p>Nous proposons deux rendez-vous majeurs pour les exposants :</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 2px solid #8B6F4E;">
      <td colspan="2" style="padding: 12px 0; font-weight: bold; font-size: 16px; color: #8B6F4E;">Foire d'Afrique Paris 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Dates</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">14, 15 &amp; 16 mai 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Pack Entrepreneur 1 jour</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">190 € <span style="font-weight: normal; font-size: 12px; color: #999;">(ou 5x 38 €/mois)</span></td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Pack Entrepreneur 2 jours</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">380 € <span style="font-weight: normal; font-size: 12px; color: #999;">(ou 5x 76 €/mois)</span></td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Pack Restauration 2 jours</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">1 000 € <span style="font-weight: normal; font-size: 12px; color: #999;">(ou 5x 200 €/mois)</span></td>
    </tr>
  </table>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 2px solid #8B6F4E;">
      <td colspan="2" style="padding: 12px 0; font-weight: bold; font-size: 16px; color: #8B6F4E;">Salon Made In Africa 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Dates</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">Décembre 2026 (dates à confirmer)</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 8px 0; color: #666;">Pack Entrepreneur 1 jour</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">190 € <span style="font-weight: normal; font-size: 12px; color: #999;">(ou 5x 38 €/mois)</span></td>
    </tr>
  </table>

  <div style="background: #F9F6F2; border-radius: 8px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 8px; font-weight: bold; color: #8B6F4E;">Chaque stand comprend :</p>
    <ul style="margin: 0; padding-left: 20px; color: #444; font-size: 14px; line-height: 1.8;">
      <li>1 table + 2 chaises</li>
      <li>2 badges exposant</li>
      <li>Visibilité sur notre site et nos réseaux sociaux</li>
      <li>Référencement dans L'Officiel d'Afrique (notre annuaire professionnel)</li>
    </ul>
  </div>

  <p style="font-size: 14px;">
    <strong>Le paiement en plusieurs fois est possible</strong> — vous pouvez étaler sur 5 mensualités sans frais.
  </p>

  <p style="font-size: 14px;">
    Pour réserver votre stand, il vous suffit de <strong>répondre à cet email</strong> en précisant l'événement et le pack souhaité, ou de nous contacter directement.
  </p>

  <div style="text-align: center; margin: 32px 0;">
    <a href="https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris" style="display: inline-block; background: #8B6F4E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 14px;">Réserver mon stand</a>
  </div>

  <p style="font-size: 13px; color: #888;">
    Les places sont limitées et partent vite. N'hésitez pas à nous contacter pour toute question.
  </p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>hello@dreamteamafrica.com · dreamteamafrica.com</p>
  </div>
</body>
</html>`;
}

async function main() {
  // Get existing booking emails to skip
  const existingBookings = await prisma.exhibitorBooking.findMany({
    select: { email: true },
  });
  const existingEmails = new Set(existingBookings.map((b) => b.email.toLowerCase()));

  let sent = 0, skipped = 0, errors = 0;

  for (const p of prospects) {
    if (existingEmails.has(p.email.toLowerCase())) {
      console.log(`SKIP (already has booking): ${p.name} <${p.email}>`);
      skipped++;
      continue;
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: p.email,
        subject: "Proposition d'exposition — Saison Culturelle Africaine 2026 — Dream Team Africa",
        html: buildProposalHtml(p.name),
      });
      console.log(`✓ ${p.name} <${p.email}>`);
      sent++;
    } catch (err: any) {
      console.error(`✗ ${p.name} <${p.email}>: ${err.message}`);
      errors++;
    }

    // Rate limit: 1.1s between emails
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nDone! Sent: ${sent}, Skipped: ${skipped}, Errors: ${errors}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
