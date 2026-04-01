import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Denana,

Merci pour votre interet pour la Foire d'Afrique Paris - 6eme Edition !

Voici nos offres exposant :

*Foire d'Afrique Paris - 6eme Edition*
Dates : 1er & 2 mai 2026
Horaires : 12h - 22h
Lieu : Espace MAS, 10 rue des Terres au Cure, 75013 Paris

---

*Pack Entrepreneur 1 jour - 190 EUR*
- Stand de 2 m2
- 1 table (1,50 m x 0,60 m)
- 2 chaises
- 2 badges exposants

*Pack Entrepreneur 2 jours - 320 EUR* (160 EUR/jour)
- Stand de 2 m2
- 1 table (1,50 m x 0,60 m)
- 2 chaises
- 2 badges exposants

*Modalites de paiement :*
- Acompte de 50 EUR pour confirmer
- Solde payable en mensualites (jusqu'a 10 fois)

Reservez en ligne : https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

N'hesitez pas si vous avez des questions !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33622819136", message);
    console.log("OK - WhatsApp envoye a +33622819136");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
