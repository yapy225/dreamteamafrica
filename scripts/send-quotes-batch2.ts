import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

interface Exposant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  sector: string;
  description: string;
  eventId: string;
  eventTitle: string;
  pack: "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION";
  totalDays: number;
  totalPrice: number;
  installments: number;
  installmentAmount: number;
}

const exposants: Exposant[] = [
  // === FOIRE D'AFRIQUE PARIS 2026 — Nouveaux ===
  {
    firstName: "Rosilene", lastName: "Vilarinho",
    email: "rosedebelem@gmail.com", phone: "+33627892523",
    companyName: "Traiteur Brésilien Rosilene", sector: "Restauration",
    description: "Traiteur brésilien.",
    eventId: "foire-dafrique-paris", eventTitle: "Foire d'Afrique Paris 2026",
    pack: "RESTAURATION", totalDays: 2, totalPrice: 1000, installments: 5, installmentAmount: 200,
  },
  {
    firstName: "Louis Alberto", lastName: "Pierre Louis",
    email: "brownuniverse.com@gmail.com", phone: "+32471673039",
    companyName: "Brown Universe", sector: "Édition / Livres jeunesse",
    description: "Livres pour enfants avec des héros qui leur ressemblent. Histoires célébrant la diversité culturelle, les origines africaines et caribéennes.",
    eventId: "foire-dafrique-paris", eventTitle: "Foire d'Afrique Paris 2026",
    pack: "ENTREPRENEUR", totalDays: 2, totalPrice: 380, installments: 5, installmentAmount: 76,
  },
  {
    firstName: "Sidoine", lastName: "Hounye",
    email: "sshkosmetic@gmail.com", phone: "+4915218142292",
    companyName: "SSH Kosmetic", sector: "Cosmétique",
    description: "Marque de maquillage pour peau noire.",
    eventId: "foire-dafrique-paris", eventTitle: "Foire d'Afrique Paris 2026",
    pack: "ENTREPRENEUR", totalDays: 2, totalPrice: 380, installments: 5, installmentAmount: 76,
  },
  {
    firstName: "Mariam Dianké", lastName: "DRAME",
    email: "dramemariam29@gmail.com", phone: "+33605946530",
    companyName: "Warice Cook", sector: "Restauration afro-antillaise",
    description: "Traiteur afro-antillais.",
    eventId: "foire-dafrique-paris", eventTitle: "Foire d'Afrique Paris 2026",
    pack: "RESTAURATION", totalDays: 2, totalPrice: 1000, installments: 5, installmentAmount: 200,
  },

  // === SALON MADE IN AFRICA 2026 ===
  {
    firstName: "Amira", lastName: "Zran",
    email: "fattiben.amor@icloud.com", phone: "+33627422218",
    companyName: "Amira Cosmétiques", sector: "Parfums / Cosmétique végane",
    description: "Parfums et produits cosmétiques végane. Coffrets cadeaux à prix raisonnable.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Makonnen", lastName: "Eboukore",
    email: "onelovegstyle@gmail.com", phone: "+33763672633",
    companyName: "OLGstyle", sector: "Mode / Vêtements brodés",
    description: "Marque de vêtements brodés alliant mode contemporaine et héritage culturel. Motifs brodés inspirés de traditions ancestrales, revisités avec un design moderne et épuré.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Séloké", lastName: "BAMBA",
    email: "seloke.bamba@gmail.com", phone: "+33620357771",
    companyName: "Séloké BAMBA", sector: "Exposant",
    description: "Réservation d'un stand pour le Salon Made In Africa.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "FATOUMA", lastName: "CISSAKO",
    email: "f.cissako08@gmail.com", phone: "+33620904589",
    companyName: "Renaissance Yinté", sector: "Cosmétique capillaire",
    description: "Créatrice de produits capillaires artisanaux pour cheveux texturés.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Nina", lastName: "Fansi",
    email: "ninafansi@yahoo.com", phone: "+33625365527",
    companyName: "Nina Fansi", sector: "Exposant",
    description: "Exposante au Salon Made In Africa.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Mariam", lastName: "Justine",
    email: "samhatchad@gmail.com", phone: "+33768574238",
    companyName: "Produits Tchadiens", sector: "Produits africains",
    description: "Exposante produits tchadiennes.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Françoise", lastName: "Sinang",
    email: "f.sinang@hotmail.fr", phone: "+33643461156",
    companyName: "Lah Menoh Saveur et Tradition", sector: "Alimentaire",
    description: "Auto-entrepreneur, saveurs et traditions.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Julien", lastName: "Akra",
    email: "andynhills@gmail.com", phone: "+33613085126",
    companyName: "Julien Akra", sector: "Entrepreneuriat",
    description: "Jeune entrepreneur souhaitant présenter sa marque valorisant les pays africains.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Maimouna", lastName: "Sene",
    email: "maimouna.sene@gmail.com", phone: "+33764794119",
    companyName: "Maimouna Sene", sector: "Mode / Artisanat",
    description: "Marque de mode et artisanat africain.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "MICHELINE", lastName: "DIALLO",
    email: "outremerracines@hotmail.com", phone: "+33782396064",
    companyName: "Outre-Mer Racines", sector: "Artisanat",
    description: "Exposante au Salon Made In Africa.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Aissatou", lastName: "Sy",
    email: "mami.sy91@gmail.com", phone: "+33755754540",
    companyName: "Bijoux & Sacs Aissatou", sector: "Bijoux / Maroquinerie",
    description: "Collection de bijoux en acier inoxydable et sacs tendance. Élégance, qualité et accessibilité. Univers nude, épuré et raffiné.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Bougouma", lastName: "Niang",
    email: "niangbougouma48@yahoo.com", phone: "+33768297251",
    companyName: "Bijoux Ethniques Bougouma", sector: "Bijoux",
    description: "Créatrice de bijoux ethniques chic.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Marième", lastName: "Traore",
    email: "marieme.traore@free.fr", phone: "+33669701545",
    companyName: "Keur Alsine", sector: "Décoration / Mode",
    description: "Keur signifie maison en wolof. Décoration d'intérieur simples et vivantes, accessoires de mode faits main en France.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Mohamed", lastName: "Moussa",
    email: "rbabouna@yahoo.fr", phone: "+22792556954",
    companyName: "Coopérative Bouloumboukh", sector: "Bijoux artisanaux touaregs",
    description: "Artisan touareg du Niger, président de la coopérative artisanale Bouloumboukh. Fabrication de bijoux traditionnels en argent : bagues, boucles d'oreilles, colliers, bracelets.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Yasmine", lastName: "ASSANI",
    email: "contact@bi-joo.com", phone: "+33665024510",
    companyName: "Bi-joo", sector: "Bijoux / Mode",
    description: "Bi-joo stand au Salon Made In Africa.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Mohamed", lastName: "Abda",
    email: "mohamedabda2014@gmail.com", phone: "+33758231345",
    companyName: "Bijoux Touaregs Agadez", sector: "Bijoux artisanaux",
    description: "Bijoux traditionnels touaregs réalisés par des artisans d'un village près d'Agadez.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Hortense Melanie", lastName: "Ngo Nonga Ebang",
    email: "hortenseebang@yahoo.com", phone: "+237656639210",
    companyName: "Hortense Fashion", sector: "Mode / Bijoux",
    description: "Marque de vêtements femme et boucles d'oreilles fantaisie faites main.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Hulda Cécile", lastName: "Niouma",
    email: "huldamaniou@gmail.com", phone: "+242055501698",
    companyName: "Hulda Artisanat", sector: "Artisanat",
    description: "Valorisation de la créativité africaine, savoir-faire artisanal.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Louis Alberto", lastName: "Pierre Louis",
    email: "albertolouis98@gmail.com", phone: "+32471673039",
    companyName: "Brown Universe", sector: "Édition / Livres jeunesse",
    description: "Livres pour enfants avec des héros qui leur ressemblent, célébrant la diversité culturelle.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
  {
    firstName: "Jordan", lastName: "Kenne Dongoko",
    email: "jordankendonj@icloud.com", phone: "+237696846018",
    companyName: "Jordan Kenne Fashion", sector: "Mode / Stylisme",
    description: "Styliste souhaitant présenter et exposer son travail.",
    eventId: "salon-made-in-africa", eventTitle: "Salon Made In Africa 2026",
    pack: "ENTREPRENEUR_1J", totalDays: 1, totalPrice: 190, installments: 5, installmentAmount: 38,
  },
];

const packNames: Record<string, string> = {
  ENTREPRENEUR_1J: "Pack Entrepreneur 1 jour",
  ENTREPRENEUR: "Pack Entrepreneur 2 jours",
  RESTAURATION: "Pack Restauration 2 jours",
};

function buildQuoteHtml(exp: Exposant, bookingId: string) {
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  return `<!DOCTYPE html>
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
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${exp.eventTitle}</td>
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
  <p style="font-size: 14px; color: #666;">Référence : <strong>${bookingId.slice(0, 8).toUpperCase()}</strong></p>
  <p style="font-size: 14px; color: #666;">Ce devis est valable 15 jours. Pour confirmer votre réservation, vous pouvez procéder au paiement en répondant à cet email ou en nous contactant directement.</p>
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;
}

async function main() {
  let sent = 0, skipped = 0, errors = 0;

  for (const exp of exposants) {
    // Skip if booking already exists for this email + event
    const existing = await prisma.exhibitorBooking.findFirst({
      where: { email: exp.email, events: { has: exp.eventId } },
    });
    if (existing) {
      console.log(`SKIP: ${exp.companyName} (${exp.email}) — already has booking for ${exp.eventId}`);
      skipped++;
      continue;
    }

    // Find or create user
    let user = await prisma.user.findFirst({ where: { email: exp.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: randomUUID(), email: exp.email, name: `${exp.firstName} ${exp.lastName}`.trim(), role: "USER" },
      });
    }

    // Create booking
    const booking = await prisma.exhibitorBooking.create({
      data: {
        userId: user.id, companyName: exp.companyName,
        contactName: `${exp.firstName} ${exp.lastName}`.trim(),
        email: exp.email, phone: exp.phone, sector: exp.sector,
        pack: exp.pack, events: [exp.eventId],
        totalDays: exp.totalDays, totalPrice: exp.totalPrice,
        installments: exp.installments, installmentAmount: exp.installmentAmount,
        paidInstallments: 0, status: "PENDING",
      },
    });

    // Create profile
    const token = randomUUID();
    await prisma.exhibitorProfile.create({
      data: {
        bookingId: booking.id, userId: user.id, token,
        companyName: exp.companyName, sector: exp.sector,
        firstName: exp.firstName, lastName: exp.lastName,
        phone: exp.phone, email: exp.email, description: exp.description,
      },
    });

    // Send email
    try {
      await resend.emails.send({
        from: FROM_EMAIL, to: exp.email,
        subject: `Devis Exposant — ${packNames[exp.pack]} — ${exp.eventTitle}`,
        html: buildQuoteHtml(exp, booking.id),
      });
      console.log(`✓ ${exp.companyName} (${exp.email}) — ${exp.eventTitle}`);
      sent++;
    } catch (err: any) {
      console.error(`✗ ${exp.email}: ${err.message}`);
      errors++;
    }

    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nDone! Sent: ${sent}, Skipped: ${skipped}, Errors: ${errors}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
