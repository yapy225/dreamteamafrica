import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Irma,

Pas de souci, voici votre billet pour la Foire d'Afrique Paris :

*Billet Last Chance - 7 EUR*
Nom : Irma Barbutsa
Ref : 791c7f83

Vous pouvez retrouver votre billet et votre QR code ici :
https://dreamteamafrica.com/saison-culturelle-africaine/confirmation/791c7f83-4b8a-4614-8427-e0bef76e8b80

Vous pouvez aussi retrouver tous vos billets a tout moment sur :
https://dreamteamafrica.com/mes-billets
(entrez votre email : irmpts@yahoo.fr)

Presentez le QR code a l'entree le jour J.

A bientot le 1er et 2 mai !

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33664485063", message);
    console.log("OK - WhatsApp envoye a +33664485063");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
