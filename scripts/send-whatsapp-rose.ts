import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Rose,

Nous confirmons la bonne reception de votre acompte de 50 EUR. Votre place est bien reservee !

Vous recevrez prochainement toutes les informations pratiques pour preparer votre stand.

A tres bientot a la Foire d'Afrique Paris !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33780191084", message);
    console.log("OK - WhatsApp envoye a +33780191084");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
