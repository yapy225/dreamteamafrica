import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Sabrina,

Suite a votre message, nous vous confirmons que votre reservation est bien enregistree pour le *2 mai 2026*.

Vous pouvez vous presenter le jour choisi a l'Espace MAS, 10 rue des Terres au Cure, 75013 Paris, a partir de 12h.

A tres bientot !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33620184579", message);
    console.log("OK - WhatsApp envoye a +33620184579");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
