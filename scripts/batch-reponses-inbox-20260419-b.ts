/**
 * Batch réponses inbox 2026-04-19 (vague 2) — 5 contacts.
 *
 * 1. David (PSH) — qualifier visiteur/exposant + rassurer sur accessibilité
 * 2. Nade Rnb — qualification exposante (direction devenir exposant)
 * 3. Ruth Azon (Azon Moukassa) — même template de qualification exposante
 * 4. Chibani Ahlem (suite nocturne fiscalité) — rediriger vers expert comptable
 * 5. Bidou — 2 places offertes, demander nom/prénom pour générer les billets
 *
 * Usage : npx tsx scripts/batch-reponses-inbox-20260419-b.ts
 */
import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

async function sendWa(to: string, text: string) {
  try {
    await sendWhatsAppText(to, text);
    console.log(`  ✓ WA ${to}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ⚠ WA ${to} KO :`, msg.substring(0, 160));
  }
}

async function main() {
  // 1) David — PSH + qualification visiteur/exposant
  console.log("\n[1/5] David — PSH + qualification");
  await sendWa(
    "+33767596098",
    `Bonjour David 👋

Merci de ton intérêt pour la *Foire d'Afrique Paris 2026* (1 & 2 mai à l'Espace MAS, Paris 13e) !

♿ *Accessibilité PMR* : l'Espace MAS est entièrement accessible aux personnes en situation de handicap (rampes, ascenseur, toilettes PMR). Nous garantissons l'accueil PMR pendant les deux journées.

Pour bien t'orienter, dis-moi stp :

• Tu souhaites venir en *visiteur* ? (billet d'entrée, accès gratuit sur réservation)
• Ou tenir un *stand exposant* ? (pack 320 € pour 2 jours)

👉 Infos complètes : https://dreamteamafrica.com/foire-paris-2026

À très vite !
— L'équipe Dream Team Africa`,
  );

  // 2) Nade Rnb — qualification exposante
  console.log("\n[2/5] Nade Rnb — qualification exposante");
  await sendWa(
    "+33650626798",
    `Bonjour Nade 👋

Merci d'avoir rempli notre formulaire !

Pour te préparer un devis exposant personnalisé pour la *Foire d'Afrique Paris 2026* (1 & 2 mai à l'Espace MAS, Paris 13e), j'aurais besoin de quelques infos :

• Nom de ta marque / entreprise
• Secteur d'activité (mode, cosmétique, alimentation, artisanat, bien-être...)
• Ton email (confirme bien Nadegoussard971@gmail.com ?)

*Pack Entrepreneur 2 jours* : 320 € (stand 2 m², 1 table, 2 chaises, 2 badges)
💳 Acompte de 50 € + solde en mensualités

👉 Réserver directement : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

— L'équipe Dream Team Africa`,
  );

  // 3) Ruth Azon — même template de qualification
  console.log("\n[3/5] Ruth Azon — qualification exposante");
  await sendWa(
    "+33616884658",
    `Bonjour Azon 👋

Merci d'avoir rempli notre formulaire !

Pour te préparer un devis exposant personnalisé pour la *Foire d'Afrique Paris 2026* (1 & 2 mai à l'Espace MAS, Paris 13e), j'aurais besoin de quelques infos :

• Nom de ta marque / entreprise
• Secteur d'activité (mode, cosmétique, alimentation, artisanat, bien-être...)
• Ton email (confirme bien ruthmavue2000@yahoo.fr ?)

*Pack Entrepreneur 2 jours* : 320 € (stand 2 m², 1 table, 2 chaises, 2 badges)
💳 Acompte de 50 € + solde en mensualités

👉 Réserver directement : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

— L'équipe Dream Team Africa`,
  );

  // 4) Chibani Ahlem — expert comptable
  console.log("\n[4/5] Chibani Ahlem — expert comptable");
  await sendWa(
    "+33780769139",
    `Bonjour Ahlem 👋

Merci pour tes précisions !

Concernant la fiscalité, c'est un sujet important et chaque situation est particulière. Je ne peux pas te conseiller personnellement, mais je t'invite vivement à *consulter un expert comptable* avant de te lancer. Il pourra :

• Évaluer quel statut est adapté à ton activité (micro-entreprise, auto-entrepreneur, etc.)
• T'expliquer les seuils de chiffre d'affaires sans charges
• Te guider sur les démarches si tu veux régulariser

Beaucoup de premiers rendez-vous sont gratuits, n'hésite pas à en consulter un.

De notre côté, ton *devis Foire d'Afrique Paris 2026* reste valable :
• Pack Entrepreneur 2 jours — 320 €
• 1er & 2 mai 2026 — Espace MAS, Paris 13e

👉 Dès que ta situation est clarifiée, tu peux réserver ici : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

— L'équipe Dream Team Africa`,
  );

  // 5) Bidou — 2 places offertes, demander identité
  console.log("\n[5/5] Bidou — 2 places offertes");
  await sendWa(
    "+33603376414",
    `Bonsoir Bidou 🙏

Merci pour ton message ! Je te confirme qu'on peut *t'offrir 2 places gratuites* pour la *Foire d'Afrique Paris 2026* (1 & 2 mai à l'Espace MAS, Paris 13e).

Pour préparer tes billets, peux-tu m'envoyer :

• *Prénom et nom* de la personne pour le 1er billet
• *Prénom et nom* pour le 2ème billet
• Ton *email* (pour t'envoyer les billets avec QR code)
• *Jour de visite* préféré : vendredi 1er mai, samedi 2 mai, ou les deux ?

Dès réception, je te génère tes invitations et tu les reçois direct.

Que Dieu te bénisse également 🙏
— L'équipe Dream Team Africa`,
  );

  console.log("\n✓ Terminé.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
