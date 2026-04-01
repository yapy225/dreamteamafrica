import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour,

Merci pour votre interet pour la Foire d'Afrique Paris - 6eme Edition !

Il ne nous reste plus qu'un seul stand disponible. Pour reserver, nous vous invitons a contacter directement notre presidente Yvylee Koffi par telephone au *+33 7 43 53 75 51* afin de finaliser votre inscription au plus vite.

N'hesitez pas, les places partent tres vite !

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
