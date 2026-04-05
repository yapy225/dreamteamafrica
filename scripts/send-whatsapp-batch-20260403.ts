import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const messages = [
  {
    name: "Djamanati",
    phone: "+33614906730",
    message: `Bonjour et merci pour votre interet pour Dream Team Africa ! 🙏

Comment pouvons-nous vous aider ? Souhaitez-vous des *places visiteurs* ou etes-vous interesse(e) par un *stand exposant* pour la Foire d'Afrique Paris - 6eme Edition (1er & 2 mai 2026) ?

L'equipe Dream Team Africa`,
  },
  {
    name: "Mireille",
    phone: "+33623131558",
    message: `Bonjour Mireille et merci pour votre interet pour Dream Team Africa ! 🙏

Comment pouvons-nous vous aider ? Souhaitez-vous des *places visiteurs* ou etes-vous interessee par un *stand exposant* pour la Foire d'Afrique Paris - 6eme Edition (1er & 2 mai 2026) ?

L'equipe Dream Team Africa`,
  },
  {
    name: "Zola Tenisman",
    phone: "+33635520983",
    message: `Bonjour Zola ! Merci pour votre interet 🙏

Pour la Foire d'Afrique Paris - 6eme Edition (1er & 2 mai 2026, Espace MAS, Paris 13e), voici nos tarifs visiteurs :

- *Early Bird* : 5 EUR (100 premieres places)
- *Prevente en ligne* : 10 EUR
- *Sur place le jour J* : 15 EUR

Reservez ici : https://dreamteamafrica.com

A bientot !
L'equipe Dream Team Africa`,
  },
  {
    name: "Lea Yobo9",
    phone: "+33636071359",
    message: `Bonjour Lea ! Merci de nous avoir contactes 🙏

Nous n'avons pas pu ecouter votre message audio. Pourriez-vous nous ecrire votre demande par message texte svp ?

Merci !
L'equipe Dream Team Africa`,
  },
  {
    name: "kdd traiteur",
    phone: "+33667790629",
    message: `Bonjour ! Merci de nous avoir contactes 🙏

Nous n'avons pas pu ecouter votre message audio. Pourriez-vous nous ecrire votre demande par message texte svp ?

Merci !
L'equipe Dream Team Africa`,
  },
  {
    name: "OSO (Onesime Ossey)",
    phone: "+33745079498",
    message: `Bonjour Onesime,

Merci pour votre interet pour la Foire d'Afrique Paris - 6eme Edition !

Voici notre offre exposant pour OSO :

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

N'hesitez pas si vous avez des questions !

L'equipe Dream Team Africa`,
  },
  {
    name: "NDIAYE Michel Gallo",
    phone: "+33767323993",
    message: `Bonjour Michel,

Merci pour votre interet pour Dream Team Africa ! 🙏

Dream Team Africa est une plateforme qui met en lumiere la culture africaine a travers des evenements comme la *Foire d'Afrique Paris - 6eme Edition* (1er & 2 mai 2026, Espace MAS, Paris 13e) : artisanat, gastronomie, mode et culture avec plus de 60 exposants.

Souhaitez-vous des *places visiteurs* ou etes-vous interesse par un *stand exposant* ?

L'equipe Dream Team Africa`,
  },
];

async function main() {
  for (const { name, phone, message } of messages) {
    try {
      await sendWhatsAppText(phone, message);
      console.log(`OK - ${name} (${phone})`);
    } catch (err) {
      console.error(`ERREUR - ${name} (${phone}):`, err);
    }
  }
}

main();
