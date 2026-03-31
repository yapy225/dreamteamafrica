import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Alioune,

Suite a votre demande, nous avons bien modifie votre reservation. Votre billet est desormais enregistre pour le *samedi 2 mai 2026*.

Vous pouvez vous presenter a l'Espace MAS, 10 rue des Terres au Cure, 75013 Paris, a partir de 12h.

A tres bientot !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33753803077", message);
    console.log("OK - WhatsApp envoye a +33753803077");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
