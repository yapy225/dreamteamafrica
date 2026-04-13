import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Cathy,

Merci pour votre candidature pour la Foire d'Afrique Paris 2026 !

Voici les modalites pour votre stand DELT'AF :

*Foire d'Afrique Paris - 6eme Edition*
Dates : 1er & 2 mai 2026
Horaires : 12h - 22h
Lieu : Espace MAS, 10 rue des Terres au Cure, 75013 Paris

---

*Pack Entrepreneur 2 jours - 320 EUR*
- Stand de 2 m2
- 1 table (1,50 m x 0,60 m)
- 2 chaises
- 2 badges exposants

*Modalites de paiement :*
- Acompte de 50 EUR pour confirmer
- Solde payable en mensualites (jusqu'a 10 fois)

Reservez en ligne : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

Un devis PDF vous a ete envoye par email a cathymare08@gmail.com

N'hesitez pas si vous avez des questions !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33667781855", message);
    console.log("OK - WhatsApp envoye a +33667781855");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
