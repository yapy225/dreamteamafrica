import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const message = `Bonjour Fino,

Merci pour votre message. Pour reserver votre stand, vous pouvez payer votre acompte de 50 EUR directement en ligne ici :

https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris

Le paiement est securise par carte bancaire.

Concernant le visa, une fois votre acompte verse, nous pourrons vous fournir une lettre d'invitation officielle de l'association Dream Team pour appuyer votre demande de visa aupres du consulat de France.

N'hesitez pas si vous avez des questions.

L'equipe Dream Team Africa`;

async function main() {
  try {
    await sendWhatsAppText("+221775247915", message);
    console.log("OK - WhatsApp envoye a +221775247915");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
