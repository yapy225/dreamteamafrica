import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Pala-Beh,

Merci pour votre interet pour la Foire d'Afrique Paris - 6eme Edition !

Pour repondre a vos questions :
- Concernant les doublons : nous veillons a diversifier les secteurs representes pour garantir une bonne visibilite a chaque exposant. Nous n'avons pas encore d'exposant en gestion de patrimoine, vous seriez donc la seule sur ce creneau.
- Concernant le pitch : oui, nous prevoyons des temps de prise de parole pour les exposants qui souhaitent presenter leur projet. Nous vous donnerons plus de details a ce sujet apres votre inscription.

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
    await sendWhatsAppText("+33758412406", message);
    console.log("OK - WhatsApp envoye a +33758412406");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
