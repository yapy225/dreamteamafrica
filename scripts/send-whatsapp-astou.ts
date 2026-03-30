import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Astou,

Merci pour votre message. Nous avons bien note votre demande d'invitation pour la Foire d'Afrique Paris les 1er et 2 mai.

Nous la transmettons a la Presidente de l'association pour validation. Si vous n'avez pas de retour, n'hesitez pas a nous relancer 15 jours avant l'evenement.

Chaleureusement,
L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+19095181710", message);
    console.log("OK - WhatsApp envoye a +19095181710");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
