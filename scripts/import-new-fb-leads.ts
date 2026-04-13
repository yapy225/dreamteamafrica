/**
 * Import des nouveaux leads Facebook (Évasion Paris, Conte Africain, Fashion Week Africa)
 * Usage : npx tsx scripts/import-new-fb-leads.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FbLead {
  name: string;
  email: string;
  phone: string;
  formId: string;
}

const EVASION_LEADS: FbLead[] = [
  { name: "Ludo Soulard", email: "ludovic.soulard@interieur.gouv.fr", phone: "+33619412784", formId: "LEADS_EvasionParis_2026" },
  { name: "Marie Afane", email: "marie.afane@outlook.fr", phone: "+33614628556", formId: "LEADS_EvasionParis_2026" },
  { name: "Jonathan Monsengo", email: "mudjona.dobbs@live.fr", phone: "+33761419199", formId: "LEADS_EvasionParis_2026" },
  { name: "Eve", email: "sindjelysaf@yahoo.fr", phone: "+33768435720", formId: "LEADS_EvasionParis_2026" },
  { name: "Carine Malossa", email: "Karinemalossa@gmail.com", phone: "+33635520983", formId: "LEADS_EvasionParis_2026" },
  { name: "Diamond Rose", email: "livylivylive@gmail.com", phone: "+33650731222", formId: "LEADS_EvasionParis_2026" },
  { name: "Edja Adoueni", email: "ross.adoueni@wellspect.com", phone: "+33661361856", formId: "LEADS_EvasionParis_2026" },
  { name: "Wyllis Lgd", email: "archipelsong92@gmail.com", phone: "+33646597957", formId: "LEADS_EvasionParis_2026" },
  { name: "Beatrice Rigueur", email: "beatricerigueur89@gmail.com", phone: "+33766588163", formId: "LEADS_EvasionParis_2026" },
  { name: "So'nice Sun", email: "jadeinayan95@gmail.com", phone: "+33660633827", formId: "LEADS_EvasionParis_2026" },
  { name: "Rhodes Maeva", email: "rhodesedimo@icloud.com", phone: "+33777130336", formId: "LEADS_EvasionParis_2026" },
  { name: "Ivan Athlet", email: "ivanelouga50@gmail.com", phone: "+33744262868", formId: "LEADS_EvasionParis_2026" },
  { name: "Katina Rimbon", email: "livety@hotmail.fr", phone: "+33629633287", formId: "LEADS_EvasionParis_2026" },
  { name: "Tania Pompuis", email: "tanya.pompuis@gmail.com", phone: "+33672628519", formId: "LEADS_EvasionParis_2026" },
  { name: "Kiz Abraham", email: "lisl.mngmt@gmail.com", phone: "+33753120875", formId: "LEADS_EvasionParis_2026" },
  { name: "Laetitia Prosper", email: "laetitiap88@gmail.com", phone: "+33760470145", formId: "LEADS_EvasionParis_2026" },
  { name: "Christian KALALA", email: "christian.pigaazh@gmail.com", phone: "+33650330709", formId: "LEADS_EvasionParis_2026" },
  { name: "Perbal", email: "souhir94320@yahoo.fr", phone: "+33603968331", formId: "LEADS_EvasionParis_2026" },
  { name: "Alice Kinion", email: "ayeleayika@yahoo.fr", phone: "+33627806076", formId: "LEADS_EvasionParis_2026" },
  { name: "Ntandou Noella", email: "noella.ntandou@gmail.com", phone: "+33751457183", formId: "LEADS_EvasionParis_2026" },
  { name: "Nelson", email: "Bastosnelson@yahoo.fr", phone: "+33744248600", formId: "LEADS_EvasionParis_2026" },
  { name: "Gandeboeuf", email: "edengandeboeuf@gmail.com", phone: "+33644812668", formId: "LEADS_EvasionParis_2026" },
  { name: "Ghazala", email: "ghizrami@hotmail.com", phone: "+33613705424", formId: "LEADS_EvasionParis_2026" },
  { name: "André Louis", email: "andre.ulrich.louis@gmail.com", phone: "+33615596226", formId: "LEADS_EvasionParis_2026" },
  { name: "Ogazie Emmanuel Nnaemeka", email: "nnaemekaogazie@gnail.com", phone: "+33758788202", formId: "LEADS_EvasionParis_2026" },
  { name: "Diane Abdoulaye", email: "d.abdoulaye@asso-acsa.fr", phone: "+33624551482", formId: "LEADS_EvasionParis_2026" },
  { name: "Ngn Anhhuy", email: "anhhuy130880@hotmail.fr", phone: "+33767540489", formId: "LEADS_EvasionParis_2026" },
  { name: "Gboya Soji Frank", email: "sojigboya@gmail.com", phone: "+33766587067", formId: "LEADS_EvasionParis_2026" },
  { name: "Ladji Dosso", email: "Ladjidosso37@gmail.com", phone: "+33758237558", formId: "LEADS_EvasionParis_2026" },
  { name: "Pascal Bienvenue", email: "pascal.endom@gmail.com", phone: "+33619034631", formId: "LEADS_EvasionParis_2026" },
  { name: "Joy Osarenren Egbeobawaye", email: "Joyosasegbeobawaye@yahoo.com", phone: "+33646613700", formId: "LEADS_EvasionParis_2026" },
  { name: "Josephine Diak", email: "diakitejosephine@yahoo.com", phone: "+33648620497", formId: "LEADS_EvasionParis_2026" },
  { name: "Gaëlle Argentine", email: "argentine2010@yaboo.fr", phone: "+33760621857", formId: "LEADS_EvasionParis_2026" },
];

const CONTE_LEADS: FbLead[] = [
  { name: "Laye Ndiaye", email: "djlaye80@gmail.com", phone: "+33664782130", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Michel Gallo Ndiaye", email: "nmichelgallo@gmail.com", phone: "+33767323993", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Fatou Pene", email: "raffette4@gmail.com", phone: "+33769632182", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Alleaume", email: "guenaelbroche@gmail.com", phone: "+33608483133", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Marie-Ange Dossou", email: "maldossou@yahoo.fr", phone: "+33609017111", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Elodie Ndje", email: "ndje.elodie@gmail.com", phone: "+33785417753", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Sira", email: "dembele.sira5@gmail.com", phone: "+33650494320", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Stéphanie Debord", email: "stedebord@gmail.com", phone: "+33664307227", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Compan", email: "myrcom.mc@gmail.com", phone: "+33695351519", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Emmanuellengassa", email: "emmanuellengassa@gmail.com", phone: "+33664285337", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Gilgamesh Mampassi Tsama", email: "gmamssitsama@gmil.com", phone: "+33614438956", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Lallement Anne Marie", email: "amlallement75@gmail.com", phone: "+33678115830", formId: "LEADS_FestivalConteAfricain_2026" },
  { name: "Richard Ossoma Lesmois", email: "ossomarichardauteur@gmail.com", phone: "+33771330719", formId: "LEADS_FestivalConteAfricain_2026" },
];

const FWA_LEADS: FbLead[] = [
  { name: "Maso Lengna", email: "mariesonia.nadot@sfr.fr", phone: "+33616520925", formId: "FashionWeekAfrica_2026" },
  { name: "Faty Asta Bouba Kaélé", email: "boubaasta@gmail.com", phone: "+33666883903", formId: "FashionWeekAfrica_2026" },
  { name: "Olivier Baboulat", email: "obaboulat@yahoo.com", phone: "+33785272293", formId: "FashionWeekAfrica_2026" },
  { name: "Jean Jacques Leandri", email: "bilaonode@hotmail.com", phone: "+33661570884", formId: "FashionWeekAfrica_2026" },
  { name: "Clarence Nganzadi", email: "daddynganzadi@yahoo.com", phone: "+33632829284", formId: "FashionWeekAfrica_2026" },
  { name: "Fulberte Pierre", email: "pierrefulberte0@gmail.com", phone: "+33635247903", formId: "FashionWeekAfrica_2026" },
  { name: "Didith Couture", email: "diane.nganga.33310@gmail.com", phone: "+33753257642", formId: "FashionWeekAfrica_2026" },
  { name: "BIZAMBA Théodora", email: "bizambatheodora@yahoo.fr", phone: "+33766651413", formId: "FashionWeekAfrica_2026" },
  { name: "Namba Wax", email: "alina.diassy@gmail.com", phone: "+33634677254", formId: "FashionWeekAfrica_2026" },
  { name: "Badia Assa Sissoko", email: "badia.simion@gmail.com", phone: "+33624441729", formId: "FashionWeekAfrica_2026" },
  { name: "Alice MAYEMBE", email: "mailicia75@gmail.com", phone: "+33652472722", formId: "FashionWeekAfrica_2026" },
  { name: "Christian KALALA", email: "christian.pigaazh@gmail.com", phone: "+33650330709", formId: "FashionWeekAfrica_2026" },
  { name: "Annie Rose", email: "annierosebalucy2@gmail.com", phone: "+33672225660", formId: "FashionWeekAfrica_2026" },
  { name: "Eva Gloria", email: "gloria.k@hotmail.fr", phone: "+33745161355", formId: "FashionWeekAfrica_2026" },
  { name: "M Es Esthy", email: "estellematsoa@yahoo.com", phone: "+33635245579", formId: "FashionWeekAfrica_2026" },
  { name: "Misouline Abianda", email: "cdouala_fr@yahoo.fr", phone: "+33611304195", formId: "FashionWeekAfrica_2026" },
];

const ALL_LEADS = [...EVASION_LEADS, ...CONTE_LEADS, ...FWA_LEADS];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const lead of ALL_LEADS) {
    const emailLower = lead.email.toLowerCase();
    const existing = await prisma.lead.findFirst({ where: { email: emailLower } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.lead.create({
      data: {
        name: lead.name,
        email: emailLower,
        phone: lead.phone,
        source: "facebook_leads",
        profile: "Visiteur",
        formId: lead.formId,
        fbLeadId: emailLower,
        converted: false,
      },
    });
    created++;
  }

  console.log(`✓ Import terminé — Créés: ${created}, Ignorés (doublons): ${skipped}`);
  console.log(`  Évasion Paris: ${EVASION_LEADS.length}`);
  console.log(`  Festival Conte Africain: ${CONTE_LEADS.length}`);
  console.log(`  Fashion Week Africa: ${FWA_LEADS.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
