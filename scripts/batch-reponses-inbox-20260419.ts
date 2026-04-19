/**
 * Batch réponses inbox 2026-04-19 — 9 contacts.
 *
 * A) Devis directs (4) : Niouma, Farid, Ahlem, Adjia
 * B) Qualification (4) : Sylviekania, Bidú, Me, Claudia
 * C) Redirect intervenante (1) : Yen
 *
 * Usage : npx tsx scripts/batch-reponses-inbox-20260419.ts
 */
import "dotenv/config";
import { Resend } from "resend";
import { generateDevisExposant } from "../src/lib/generate-devis-exposant";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

async function sendDevisEmail(opts: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.toEmail,
    subject: opts.subject,
    html: opts.html,
    attachments: [{ filename: opts.pdfFilename, content: opts.pdfBuffer }],
  });
  if (error) {
    console.error(`  ✗ Email ${opts.toEmail} :`, error);
  } else {
    console.log(`  ✓ Email ${opts.toEmail} (id=${data?.id})`);
  }
}

async function sendWa(to: string, text: string) {
  try {
    await sendWhatsAppText(to, text);
    console.log(`  ✓ WA ${to}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ⚠ WA ${to} KO :`, msg.substring(0, 160));
  }
}

// ── Templates emails ──
function devisEmailHtml(opts: {
  firstName: string;
  company: string;
  sector: string;
  eventName: string;
  eventSubtitle: string;
  dates: string;
  pack: string;
  total: string;
  reservationUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>
  <p>Bonjour <strong>${opts.firstName}</strong>,</p>
  <p>Merci pour votre candidature ! <strong>${opts.company}</strong> dans le secteur ${opts.sector.toLowerCase()}, c'est exactement le type de marque que nos visiteurs adorent découvrir au <strong>${opts.eventName}</strong>${opts.eventSubtitle ? " — " + opts.eventSubtitle : ""}.</p>
  <p>Veuillez trouver ci-joint votre devis.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;"><td style="padding: 10px 0; color: #666;">Événement</td><td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.eventName}</td></tr>
    <tr style="border-bottom: 1px solid #e5e5e5;"><td style="padding: 10px 0; color: #666;">Formule</td><td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.pack}</td></tr>
    <tr style="border-bottom: 1px solid #e5e5e5;"><td style="padding: 10px 0; color: #666;">Dates</td><td style="padding: 10px 0; font-weight: bold; text-align: right;">${opts.dates}</td></tr>
    <tr style="border-bottom: 1px solid #e5e5e5;"><td style="padding: 10px 0; color: #666;">Lieu</td><td style="padding: 10px 0; font-weight: bold; text-align: right;">Espace MAS — 10 rue des Terres au Curé, 75013 Paris</td></tr>
    <tr style="border-bottom: 2px solid #8B6F4E;"><td style="padding: 10px 0; color: #666;">Total</td><td style="padding: 10px 0; font-weight: bold; text-align: right; font-size: 20px; color: #8B6F4E;">${opts.total}</td></tr>
    <tr><td style="padding: 10px 0; color: #666;">Paiement</td><td style="padding: 10px 0; text-align: right;">Acompte de 50 € — solde en mensualités</td></tr>
  </table>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${opts.reservationUrl}" style="display: inline-block; background: #8B6F4E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 14px;">Réserver mon stand</a>
  </div>
  <p style="font-size: 14px;">Vous pouvez aussi réserver par WhatsApp : <a href="https://wa.me/33782801852" style="color: #8B6F4E; font-weight: bold;">+33 7 82 80 18 52</a></p>
  <p style="font-size: 14px;">Une fois votre réservation confirmée, remplissez ce <a href="https://tally.so/r/31GKbl" style="color: #8B6F4E;">formulaire</a> pour créer votre capsule vidéo promotionnelle (diffusée sur +28 pages réseaux sociaux).</p>
  <p style="font-size: 13px; color: #888;">Les places sont limitées — réservez rapidement !</p>
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>Yvylee KOFFI — hello@dreamteamafrica.com — dreamteamafrica.com</p>
  </div>
</body></html>`;
}

async function main() {
  // ══════ A) DEVIS DIRECTS ══════

  // 1) Niouma SACKO — Nioumiart — Salon Made In Africa
  console.log("\n[1/9] Niouma SACKO (Nioumiart) — Salon Made In Africa");
  {
    const pdf = await generateDevisExposant({
      name: "Niouma SACKO",
      company: "Nioumiart",
      email: "nioumiart@gmail.com",
      phone: "+33 7 81 26 06 06",
      eventSlug: "salon-made-in-africa",
      pack: "ENTREPRENEUR",
      totalDays: 2,
      pricePerDay: 160,
      totalPrice: 320,
    });
    await sendDevisEmail({
      toEmail: "nioumiart@gmail.com",
      toName: "Niouma",
      subject: "Devis Exposant — Salon Made In Africa 2026 — Nioumiart",
      html: devisEmailHtml({
        firstName: "Niouma",
        company: "Nioumiart",
        sector: "de l'art déco",
        eventName: "Salon Made In Africa 2026",
        eventSubtitle: "l'artisanat africain à l'honneur",
        dates: "11 & 12 Décembre 2026 — 12h à 22h",
        pack: "Pack Entrepreneur 2 jours",
        total: "320 €",
        reservationUrl: "https://dreamteamafrica.com/resa-exposants/salon-made-in-africa",
      }),
      pdfBuffer: pdf,
      pdfFilename: "Devis-Nioumiart-Salon-Made-In-Africa-2026.pdf",
    });
    await sendWa(
      "+33781260606",
      `Bonjour Niouma 👋

Merci pour ta demande d'exposer avec *Nioumiart* au *Salon Made In Africa 2026* — l'artisanat africain à l'honneur !

📅 *Dates* : 11 & 12 décembre 2026 (12h–22h)
📍 *Lieu* : Espace MAS, 10 rue des Terres au Curé, 75013 Paris

*Pack Entrepreneur 2 jours*
• Stand 2 m² • 1 table (1,50 m × 0,60 m)
• 2 chaises • 2 badges exposants
• Tarif : *320 €* (160 €/jour)

💳 Paiement : acompte de 50 € + solde en mensualités

Ton devis détaillé t'arrive par email à nioumiart@gmail.com (PDF joint).

👉 Réserver ton stand : https://dreamteamafrica.com/resa-exposants/salon-made-in-africa

Les places sont limitées — à très vite !
— L'équipe Dream Team Africa`,
    );
  }

  // 2) Farid Nait Makhlouf — NM créations — Foire d'Afrique
  console.log("\n[2/9] Farid Nait Makhlouf (NM créations) — Foire d'Afrique");
  {
    const pdf = await generateDevisExposant({
      name: "Farid Nait Makhlouf",
      company: "NM créations",
      email: "naitmakhlouffarid@gmail.com",
      phone: "+33 6 13 48 62 92",
      eventSlug: "foire-dafrique-paris",
      pack: "ENTREPRENEUR",
      totalDays: 2,
      pricePerDay: 160,
      totalPrice: 320,
    });
    await sendDevisEmail({
      toEmail: "naitmakhlouffarid@gmail.com",
      toName: "Farid",
      subject: "Devis Exposant — Foire d'Afrique Paris 2026 — NM créations",
      html: devisEmailHtml({
        firstName: "Farid",
        company: "NM créations",
        sector: "de la mode",
        eventName: "Foire d'Afrique Paris 2026",
        eventSubtitle: "",
        dates: "1er & 2 Mai 2026 — 12h à 22h",
        pack: "Pack Entrepreneur 2 jours",
        total: "320 €",
        reservationUrl: "https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris",
      }),
      pdfBuffer: pdf,
      pdfFilename: "Devis-NMcreations-Foire-Afrique-2026.pdf",
    });
    await sendWa(
      "+33613486292",
      `Bonjour Farid 👋

Merci pour ta candidature avec *NM créations* (Mode) à la *Foire d'Afrique Paris 2026* — 6ème Édition !

📅 *Dates* : 1er & 2 mai 2026 (12h–22h)
📍 *Lieu* : Espace MAS, 10 rue des Terres au Curé, 75013 Paris

*Pack Entrepreneur 2 jours*
• Stand 2 m² • 1 table (1,50 m × 0,60 m)
• 2 chaises • 2 badges exposants
• Tarif : *320 €* (160 €/jour)

💳 Paiement : acompte de 50 € + solde en mensualités

Ton devis détaillé t'arrive par email à naitmakhlouffarid@gmail.com (PDF joint).

👉 Réserver ton stand : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

J-13 avant l'événement — les places partent vite !
— L'équipe Dream Team Africa`,
    );
  }

  // 3) Ahlem Chibani — Création hallouma — Foire d'Afrique
  console.log("\n[3/9] Ahlem Chibani (Création hallouma) — Foire d'Afrique");
  {
    const pdf = await generateDevisExposant({
      name: "Ahlem Chibani",
      company: "Création hallouma",
      email: "chibaniahlem25@gmail.com",
      phone: "+33 7 80 76 91 39",
      eventSlug: "foire-dafrique-paris",
      pack: "ENTREPRENEUR",
      totalDays: 2,
      pricePerDay: 160,
      totalPrice: 320,
    });
    await sendDevisEmail({
      toEmail: "chibaniahlem25@gmail.com",
      toName: "Ahlem",
      subject: "Devis Exposant — Foire d'Afrique Paris 2026 — Création hallouma",
      html: devisEmailHtml({
        firstName: "Ahlem",
        company: "Création hallouma",
        sector: "de la création artisanale",
        eventName: "Foire d'Afrique Paris 2026",
        eventSubtitle: "",
        dates: "1er & 2 Mai 2026 — 12h à 22h",
        pack: "Pack Entrepreneur 2 jours",
        total: "320 €",
        reservationUrl: "https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris",
      }),
      pdfBuffer: pdf,
      pdfFilename: "Devis-CreationHallouma-Foire-Afrique-2026.pdf",
    });
    await sendWa(
      "+33780769139",
      `Bonjour Ahlem 👋

Merci pour ta candidature avec *Création hallouma* à la *Foire d'Afrique Paris 2026* — 6ème Édition !

📅 *Dates* : 1er & 2 mai 2026 (12h–22h)
📍 *Lieu* : Espace MAS, 10 rue des Terres au Curé, 75013 Paris

*Pack Entrepreneur 2 jours*
• Stand 2 m² • 1 table (1,50 m × 0,60 m)
• 2 chaises • 2 badges exposants
• Tarif : *320 €* (160 €/jour)

💳 Paiement : acompte de 50 € + solde en mensualités

Ton devis détaillé t'arrive par email à chibaniahlem25@gmail.com (PDF joint).

👉 Réserver ton stand : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

J-13 avant l'événement — les places partent vite !
— L'équipe Dream Team Africa`,
    );
  }

  // 4) Adjia — pastels — Foire d'Afrique SAMEDI 2 MAI (1 jour)
  console.log("\n[4/9] Adjia (pastels) — Foire d'Afrique 1 jour");
  await sendWa(
    "+33641829815",
    `Bonjour Adjia 👋

Merci pour ta demande ! Oui, c'est tout à fait possible de tenir un stand pastels à la *Foire d'Afrique Paris 2026* le *samedi 2 mai uniquement*.

📅 *Date* : samedi 2 mai 2026 (12h–22h)
📍 *Lieu* : Espace MAS, 10 rue des Terres au Curé, 75013 Paris

*Pack Entrepreneur 1 jour* (samedi)
• Stand 2 m² • 1 table (1,50 m × 0,60 m)
• 2 chaises • 2 badges exposants
• Tarif : *190 €* pour la journée du samedi

💳 Paiement : acompte de 50 € + solde en mensualités

⚠️ Pour la *restauration* (vente d'aliments préparés), merci de confirmer que tu as bien une *déclaration sanitaire* et une *attestation de formation hygiène alimentaire HACCP* — indispensables pour la vente sur place.

👉 Réserver ton stand : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

Peux-tu m'envoyer ton email pour que je t'envoie le devis détaillé en PDF ?

— L'équipe Dream Team Africa`,
  );

  // ══════ B) QUALIFICATION ══════

  // 5) Sylviekania
  console.log("\n[5/9] Sylviekania — qualification");
  await sendWa(
    "+33682291633",
    `Bonjour 👋

Merci de ton intérêt pour la *Foire d'Afrique Paris 2026* (1 & 2 mai à l'Espace MAS, Paris 13e) !

Pour te préparer un devis exposant personnalisé, j'aurais besoin de quelques infos :

• Ton prénom et nom
• Nom de ta marque / entreprise
• Secteur d'activité (mode, cosmétique, alimentation, artisanat...)
• Ton email

Tu peux aussi remplir le formulaire rapide ici : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

À très vite !
— L'équipe Dream Team Africa`,
  );

  // 6) Bidú (Portugal)
  console.log("\n[6/9] Bidú (Portugal) — qualification");
  await sendWa(
    "+351913382392",
    `Bonjour 👋

Merci de ton message depuis le site Dream Team Africa !

Pour t'orienter au mieux, peux-tu me dire :

• Tu souhaites exposer à un événement (stand) ou participer en tant que visiteur/partenaire ?
• Si tu veux un stand : ton prénom/nom, marque/entreprise, secteur d'activité, email
• À quel événement tu penses ? (Foire d'Afrique Paris 1-2 mai, Fashion Week Africa, Salon Made In Africa...)

Programme complet : https://dreamteamafrica.com/saison-culturelle-africaine

À très vite !
— L'équipe Dream Team Africa`,
  );

  // 7) "Me" — mandataire assurance emprunteur
  console.log("\n[7/9] Me (assurance emprunteur) — qualification");
  await sendWa(
    "+33660509109",
    `Bonjour 👋

Merci de ton intérêt pour la *Foire d'Afrique Paris 2026* !

Oui, c'est possible d'avoir un stand en tant que mandataire en assurance emprunteur — nos visiteurs sont souvent intéressés par les services financiers (crédit immobilier, protection familiale, etc.).

Pour te préparer un devis, j'ai besoin de :

• Ton prénom et nom
• Nom de ton entreprise/marque (ou ton nom commercial)
• Ton email

*Pack Entrepreneur 2 jours* : 320 € (stand 2 m², 1 table, 2 chaises, 2 badges) — 1er & 2 mai 2026 à l'Espace MAS, Paris 13e.

👉 Réserver : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

— L'équipe Dream Team Africa`,
  );

  // 9) Claudia Baptista
  console.log("\n[8/9] Claudia Baptista — qualification");
  await sendWa(
    "+33761529749",
    `Bonjour Claudia 👋

Merci d'avoir rempli notre formulaire !

Pour mieux te répondre, peux-tu me préciser :

• Souhaites-tu *exposer* à l'un de nos événements (stand avec produits/services) ou juste avoir plus d'infos sur Dream Team Africa ?
• Si exposer : quelle est ta marque/entreprise et ton secteur d'activité ?

Prochain événement : *Foire d'Afrique Paris 2026* — 1 & 2 mai à l'Espace MAS, Paris 13e.
Programme complet : https://dreamteamafrica.com/saison-culturelle-africaine

À très vite !
— L'équipe Dream Team Africa`,
  );

  // ══════ C) REDIRECT INTERVENANTE ══════

  // 8) Yen — intervenante
  console.log("\n[9/9] Yen — redirect intervenante");
  await sendWa(
    "+33753252212",
    `Bonjour Yen 👋

Désolée pour le délai de réponse ! Tu souhaites intervenir à la *Foire d'Afrique Paris 2026* — merci pour l'intérêt.

Pour qu'on puisse étudier ta candidature d'intervenante, j'ai besoin de quelques précisions :

• Ton prénom et nom
• Nature de ton intervention (conférence, atelier, performance artistique, table ronde...)
• Thématique / sujet proposé
• Durée souhaitée
• Ton email

Les candidatures intervenants sont revues par notre équipe programmation. Je reviens vers toi dès qu'on a étudié ton profil.

📅 Événement : 1 & 2 mai 2026 — Espace MAS, Paris 13e

Merci et à très vite !
— L'équipe Dream Team Africa`,
  );

  console.log("\n✓ Terminé.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
