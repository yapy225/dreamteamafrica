import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Achille,

Votre modification a bien ete prise en compte. Votre billet est desormais valable pour le 2 mai.

Presentez-vous a l'entree de l'Espace MAS le 2 mai avec votre QR code. Bonne journee !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33608668029", message);
    console.log("OK - WhatsApp envoye a +33608668029");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
