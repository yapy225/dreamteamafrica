import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const contacts = [
  { submittedAt: new Date("2026-03-11T11:56:00"), firstName: ".", lastName: "Plateforme des Artisans de Kinshasa/A.A.D", phone: "+243819997666", email: "apertusmind@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Nous souhaitons réserver actuellement deux stands pour des artisans venant de Kinshasa." },
  { submittedAt: new Date("2026-03-09T17:28:00"), firstName: "Nelly", lastName: "Possi", phone: "+32466170222", email: "possinelly@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Bonjour je suis intéressée à participer en tant qu'exposante." },
  { submittedAt: new Date("2026-02-28T11:37:00"), firstName: "Viviane", lastName: "LECHAT", phone: "+33688269861", email: "avenirtogo94@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Avenir Togo 94 soutient le CAST qui accompagne plus de 530 enfants et jeunes dans tout le Togo. Nous vendons, au profit du CAST, de l'artisanat rapporté lors de nos séjours au Togo." },
  { submittedAt: new Date("2026-02-26T19:15:00"), firstName: "Aminata", lastName: "Hagbalamou-Kolie", phone: "+33745024391", email: "maisonnimba@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Maison Nimba est une marque inspirée des traditions d'Afrique de l'Ouest, dédiée aux soins naturels et aux trésors bruts du quotidien. Savon noir, beurre de karité pur, miel pur de Guinée, plantes et matières végétales traditionnelles." },
  { submittedAt: new Date("2026-02-25T15:16:00"), firstName: "Joshua", lastName: "MOUZIKA", phone: "+33783632358", email: "joshuab_mb@rentavoyage.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "RentaVoyage, plateforme innovante de mise en relation entre voyageurs et expéditeurs. Facilite et sécurise l'envoi de petits colis via des voyageurs déjà en déplacement." },
  { submittedAt: new Date("2026-02-22T15:19:00"), firstName: "Mamadou", lastName: "Barry", phone: "+224628084004", email: "sogoregn@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "M Saidou Barry est un styliste-modéliste formateur en couture, fondateur de CFC Sogoré. Représente son savoir-faire à travers des défilés nationaux et internationaux." },
  { submittedAt: new Date("2026-02-21T14:29:00"), firstName: "Nelly", lastName: "POSSI", phone: "+32466170222", email: "yactchflore@yahoo.fr", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Je vends des sacs à mains africains. Je souhaiterais participer à la foire en tant qu'exposante." },
  { submittedAt: new Date("2026-02-17T20:58:00"), firstName: "Aminata", lastName: "Hagbalamou-Kolie", phone: "+33745024391", email: "maisonnimba@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Maison Nimba : savon noir, beurre de karité pur, miel pur de Guinée, plantes traditionnelles et accessoires. Le bien-être à l'état brut." },
  { submittedAt: new Date("2026-02-17T16:41:00"), firstName: "Gaelle", lastName: "Koumbou", phone: "+33611883711", email: "babyson@hotmail.fr", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Large variété de beurre de karité en provenance du Burkina Faso. Beurres artisanaux faits par des femmes de coopérative, aux multiples vertus et senteurs." },
  { submittedAt: new Date("2026-02-17T15:43:00"), firstName: "Gaelle", lastName: "Koumbou", phone: "+33611883711", email: "babyson@hotmail.fr", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "France" },
  { submittedAt: new Date("2026-02-14T15:47:00"), firstName: "félicite", lastName: "N diaye", phone: "+33644857171", email: "felicite_klock@hotmail.fr", category: "AUTRE", event: "Foire d'Afrique Paris", message: "Restauratrice ambulante sur les marchés, ventes de menus antillaises. Jeff food spécialiste caribéenne." },
  { submittedAt: new Date("2026-01-14T00:47:00"), firstName: "Diana", lastName: "Marc", phone: "+33769466046", email: "diana.marcaure@gmail.com", category: "MEDIA", event: "Fashion Week Africa", message: "Candidature pour le Fashion Week Afrika en tant que mannequin." },
  { submittedAt: new Date("2025-12-16T12:55:00"), firstName: "Amira", lastName: "Zran", phone: "+33627422218", email: "fattiben.amor@icloud.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Entrepreneuse de ventes de parfums et produits cosmétiques végane. Coffrets cadeaux à prix raisonnable." },
  { submittedAt: new Date("2025-12-15T16:27:00"), firstName: "Makonnen", lastName: "Eboukore", phone: "+33763672633", email: "onelovegstyle@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "OLGstyle est une marque de vêtements brodés qui allie mode contemporaine et héritage culturel." },
  { submittedAt: new Date("2025-12-10T16:26:00"), firstName: "Séloké", lastName: "BAMBA", phone: "+33620357771", email: "seloke.bamba@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Souhait de réserver un stand pour le 20 décembre à Paris 13ème." },
  { submittedAt: new Date("2025-12-09T00:21:00"), firstName: "FATOUMA", lastName: "CISSAKO", phone: "+33620904589", email: "f.cissako08@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Créatrice de produits capillaire artisanaux pour cheveux texturés. Marque : Renaissance Yinté." },
  { submittedAt: new Date("2025-12-07T01:19:00"), firstName: "Nina", lastName: "Fansi", phone: "+33625365527", email: "ninafansi@yahoo.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Intéressée par la journée du samedi 20 décembre." },
  { submittedAt: new Date("2025-12-01T14:44:00"), firstName: "Blandine", lastName: "KPESSOKRO", phone: "+33650401294", email: "kpess.amah@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Souhaite découvrir l'événement." },
  { submittedAt: new Date("2025-12-01T11:58:00"), firstName: "Mariam", lastName: "Justine", phone: "+33768574238", email: "samhatchad@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Exposante produit tchadienne." },
  { submittedAt: new Date("2025-11-30T23:09:00"), firstName: "Leila", lastName: "LINGOUPOU", phone: "+33769897101", email: "llingoupou.contact@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Caviar de piment." },
  { submittedAt: new Date("2025-11-29T11:44:00"), firstName: "Aminata", lastName: "Hagbalamou-Kolie", phone: "+33762234731", email: "amyhagbalamou@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Maison Nimba : bien-être, héritage africain. Beurre de karité brut, miel pur de Guinée, savon noir, plantes traditionnelles, bonnets satin premium, éponges africaines, bougies artisanales." },
  { submittedAt: new Date("2025-11-21T09:58:00"), firstName: "Françoise", lastName: "Sinang", phone: "+33643461156", email: "f.sinang@hotmail.fr", category: "EXPOSANT", event: "Salon Made In Africa", message: "Lah menoh saveur et tradition. Autoentrepreneur." },
  { submittedAt: new Date("2025-11-20T21:14:00"), firstName: "Julien", lastName: "Akra", phone: "+33613085126", email: "andynhills@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Tenter l'expérience pour la première fois, présenter une marque qui valorise nos pays." },
  { submittedAt: new Date("2025-11-20T15:19:00"), firstName: "Maimouna", lastName: "Sene", phone: "+33764794119", email: "maimouna.sene@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Marque déjà expliquée sur un autre formulaire." },
  { submittedAt: new Date("2025-11-20T14:06:00"), firstName: "DIALLO", lastName: "MICHELINE", phone: "+33782396064", email: "outremerracines@hotmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Confirmation de réception du lien de paiement pour les 2 jours." },
  { submittedAt: new Date("2025-11-13T02:37:00"), firstName: "Diana", lastName: "Marc", phone: "+33769466046", email: "diana.marcaure@gmail.com", category: "MEDIA", event: "Fashion Week Africa", message: "Candidature pour la Fashion Week Africa en tant que mannequin." },
  { submittedAt: new Date("2025-11-11T23:01:00"), firstName: "Aissatou", lastName: "Sy", phone: "+33755754540", email: "mami.sy91@gnail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Collection de bijoux et de sacs tendance. Bijoux en acier inoxydable, sacs élégants et pratiques. Univers nude, épuré et raffiné." },
  { submittedAt: new Date("2025-11-10T18:03:00"), firstName: "Olivia", lastName: "DE LA PANNETERIE", phone: "+33611436421", email: "revenirautrement@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Questions logistiques sur le parking, nombre d'exposants, possibilité de m² supplémentaires et d'accrocher un calico." },
  { submittedAt: new Date("2025-11-08T10:42:00"), firstName: "Mohamed", lastName: "Abda", phone: "+33758231345", email: "mohamedabda2014@gmail.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Bijoux traditionnels touaregs réalisés par des artisans d'un village près d'Agadez." },
  { submittedAt: new Date("2025-11-06T23:30:00"), firstName: "Aïssatou", lastName: "SY", phone: "+33755754540", email: "mami.sy91@gmail.comp", category: "EXPOSANT", event: "Salon Made In Africa", message: "Entrepreneuse dans la vente de produits cosmétiques naturels." },
  { submittedAt: new Date("2025-11-05T08:22:00"), firstName: "Bougouma", lastName: "Niang", phone: "+33768297251", email: "niangbougouma48@yahoo.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Créatrice de bijoux afro." },
  { submittedAt: new Date("2025-11-04T22:41:00"), firstName: "Sylvie", lastName: "JUMINER", phone: "+33661200405", email: "blakpenter@hotmail.fr", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "Souhaite réserver un stand pour exposer des articles customisés." },
  { submittedAt: new Date("2025-11-04T21:19:00"), firstName: "Genevieve", lastName: "Picot", phone: "+33664704626", email: "gencopi19@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "" },
  { submittedAt: new Date("2025-11-03T16:48:00"), firstName: "prescillia", lastName: "maria", phone: "+33635176513", email: "bymaria.creacouture@gmail.com", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "" },
  { submittedAt: new Date("2025-11-03T16:22:00"), firstName: "Marième", lastName: "Traore", phone: "+33669701545", email: "marieme.traore@free.fr", category: "EXPOSANT", event: "Salon Made In Africa", message: "Ravie de l'intérêt pour ses produits." },
  { submittedAt: new Date("2025-11-03T10:18:00"), firstName: "Olivia", lastName: "DE LA PANNETERIE", phone: "+33611436421", email: "revenirautrement@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Association REVENIR AUTREMENT souhaite tenir un stand le 11 novembre. Rogo Koffi Fiangor, membre de l'asso et conteur. Tarif préférentiel de 50 euros." },
  { submittedAt: new Date("2025-11-03T08:41:00"), firstName: "Sylvie", lastName: "JUMINER", phone: "+33661200405", email: "blakpenter@hotmail.fr", category: "EXPOSANT", event: "Fashion Week Africa", message: "Souhaite exposer des créations de Customisations." },
  { submittedAt: new Date("2025-11-02T14:43:00"), firstName: "Prescillia", lastName: "Maria", phone: "+33635176513", email: "maria.prescillia@yahoo.fr", category: "EXPOSANT", event: "Foire d'Afrique Paris", message: "" },
  { submittedAt: new Date("2025-11-02T12:58:00"), firstName: "Mohamed", lastName: "Moussa", phone: "+22792556954", email: "rbabouna@yahoo.fr", category: "EXPOSANT", event: "Salon Made In Africa", message: "Artisan touareg du Niger, président de la coopérative artisanale bouloumboukh. Bijoux traditionnels en argent : bagues, boucles d'oreilles, colliers, bracelets." },
  { submittedAt: new Date("2025-11-02T00:57:00"), firstName: "Bertine", lastName: "NGUIATEU KOUAM", phone: "+33769692816", email: "bk2lifestyle1@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Facture au nom de la société BKL LIFESTYLE." },
  { submittedAt: new Date("2025-11-02T00:05:00"), firstName: "Yasmine", lastName: "ASSANI", phone: "+33665024510", email: "contact@bi-joo.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Bi-joo stand." },
  { submittedAt: new Date("2025-11-01T22:11:00"), firstName: "Myriam", lastName: "Didi-Kouko", phone: "+33782975262", email: "myriam_cou@yahoo.fr", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "" },
  { submittedAt: new Date("2025-11-01T11:53:00"), firstName: "Khardiata", lastName: "Aw", phone: "+33669722657", email: "awkhardiata9@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Artiste peintre." },
  { submittedAt: new Date("2025-10-29T01:02:00"), firstName: "Hortense Melanie", lastName: "Ngo Nonga Ebang", phone: "+237656639210", email: "hortenseebang@yahoo.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Promotion de marque de vêtements femme et de boucles d'oreilles fantaisie faites main." },
  { submittedAt: new Date("2025-10-27T10:59:00"), firstName: "Oummou", lastName: "Doucoure", phone: "+33620282078", email: "doucou@hotmail.fr", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Souhaite connaître les conditions pour être exposant au festival du conte africain." },
  { submittedAt: new Date("2025-10-26T12:12:00"), firstName: "Olivia", lastName: "DE LA PANNETERIE", phone: "+33611436421", email: "revenirautrement@gmail.com", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Association Revenir Autrement, objectifs vers le Togo. Rogo Koffi Fiangor a sollicité un stand pour la journée du 11 nov." },
  { submittedAt: new Date("2025-10-25T11:44:00"), firstName: "Bougouma", lastName: "Niang", phone: "+33768297251", email: "niangbougouma48@yahoo.com", category: "EXPOSANT", event: "Salon Made In Africa", message: "Créatrice de bijoux ethnique chic." },
  { submittedAt: new Date("2025-10-25T11:41:00"), firstName: "Marieme", lastName: "Traore", phone: "+33669701545", email: "marieme.traore@free.fr", category: "EXPOSANT", event: "Salon Made In Africa", message: "Keur Alsine : décoration d'intérieur et accessoires de mode faits main en France." },
  { submittedAt: new Date("2025-10-23T20:15:00"), firstName: "Karine", lastName: "Meunier", phone: "+33671606295", email: "karin.meunier971@gmail.com", category: "MEDIA", event: "Fashion Week Africa", message: "Beaucoup de défilés de mode autour de la culture africaine. Métissée d'origine guadeloupéenne. Candidature mannequin." },
  { submittedAt: new Date("2025-10-23T17:32:00"), firstName: "Jawa", lastName: "Sow", phone: "+33695278408", email: "jawa.sow@live.fr", category: "EXPOSANT", event: "Festival Du Conte Africain", message: "Intérêt pour l'Afrique de manière générale." },
];

async function main() {
  console.log("Seeding ContactMessage from form submissions...");

  const result = await prisma.contactMessage.createMany({
    data: contacts.map((c) => ({
      category: c.category,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      company: c.event,
      message: c.message || "-",
    })),
  });

  console.log(`Inserted ${result.count} contact messages.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
