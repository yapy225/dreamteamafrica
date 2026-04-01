import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Gaelle,

Nous comprenons la confusion et nous nous excusons pour le manque de clarte.

Pour clarifier :

*Pack Entrepreneur 1 jour : 190 EUR*
*Pack Entrepreneur 2 jours : 320 EUR* (soit 160 EUR/jour)

Le tarif de 160 EUR/jour s'applique uniquement si vous optez pour les 2 jours. C'est une reduction par rapport au tarif 1 jour (190 EUR).

Reservez en ligne : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

N'hesitez pas si vous avez d'autres questions !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33611883711", message);
    console.log("OK - WhatsApp envoye a +33611883711");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
