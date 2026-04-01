import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour,

Bonne nouvelle, il nous reste une derniere place pour un stand restauration !

Voici l'offre :

*Pack Restauration - Foire d'Afrique Paris 6eme Edition*
Dates : 1er & 2 mai 2026
Horaires : 12h - 22h
Lieu : Espace MAS, 10 rue des Terres au Cure, 75013 Paris

*Stand Restauration 2 jours - 1 000 EUR*
- Emplacement dedie cuisine/restauration
- Acces aux installations
- 2 badges exposants

Pour finaliser votre reservation, merci de contacter directement notre presidente Yvylee Koffi au *+33 7 43 53 75 51* des demain matin.

Les places etant tres limitees, nous vous conseillons de ne pas tarder.

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+33667790629", message);
    console.log("OK - WhatsApp envoye a +33667790629");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
