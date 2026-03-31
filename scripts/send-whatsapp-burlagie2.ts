import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Burlagie,

Le tarif complet etait indique dans notre precedent message WhatsApp.

Pour rappel, le *Pack Entrepreneur 2 jours est a 320 EUR au total*. L'acompte de 50 EUR sert uniquement a confirmer votre reservation, le solde est payable en mensualites.

Vous pouvez retrouver tous les details et reserver ici : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

N'hesitez pas si vous avez d'autres questions !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33760886304", message);
    console.log("OK - WhatsApp envoye a +33760886304");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
