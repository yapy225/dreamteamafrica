import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Faty,

Merci pour votre interet !

Dream Team Africa propose *L'Annuaire Officiel d'Afrique*, une plateforme qui reference les entreprises et professionnels africains en France. Vous pouvez y creer votre fiche pour gagner en visibilite aupres de notre communaute.

Votre compte a ete cree. Voici vos identifiants :

*Email :* boubaasta@gmail.com
*Mot de passe temporaire :* 1b8249c2

Connectez-vous sur https://dreamteamafrica.com/connexion puis modifiez votre mot de passe et completez votre fiche.

N'hesitez pas si vous avez des questions !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33666883903", message);
    console.log("OK - WhatsApp envoye a +33666883903");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
