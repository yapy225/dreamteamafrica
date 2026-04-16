import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Verified emails + websites from scraping (2026-04-16)
// Matched by normalized companyName (trim/case/suffix-insensitive)
const updates = [
  { match: "7sur7.cd", email: "infos7sur7@gmail.com", website: "https://7sur7.cd" },
  { match: "Actualite.cd", email: "sales@actualite.cd", website: "https://actualite.cd" },
  { match: "Abidjan.net", email: "info@weblogy.com", website: "https://www.abidjan.net" },
  { match: "Afrik.com", email: "contact@afrik.com", website: "https://www.afrik.com" },
  { match: "Africa Femme", email: "info@weblogy.com", website: "https://www.afriquefemme.com" },
  { match: "Africaguinée.com", email: "contact@africaguinee.com", website: "https://www.africaguinee.com" },
  { match: "Afrikarabia", email: "afrikarabia@gmail.com", website: "https://afrikarabia.com" },
  { match: "Afrique IT News", email: "contact@afriqueitnews.com", website: "https://afriqueitnews.com" },
  { match: "Banouto.bj", email: "redaction@banouto.bj", website: "https://banouto.bj" },
  { match: "Burkina24.com", email: "info@burkina24.com", website: "https://burkina24.com" },
  { match: "CIO Mag Afrique", email: "info@cio-mag.com", website: "https://www.cio-mag.com" },
  { match: "Camer.be", email: "webmaster@camer.be", website: "https://camer.be" },
  { match: "Connectionivoirienne.net", email: "info@connectionivoirienne.net", website: "https://connectionivoirienne.net" },
  { match: "Dakaractu.com", email: "pub.dakaractu@gmail.com", website: "https://dakaractu.com" },
  { match: "Ecofin Agency", email: "redaction@agenceecofin.com", website: "https://www.agenceecofin.com" },
  { match: "Gabonreview.com", email: "redaction.gabonreview@gmail.com", website: "https://gabonreview.com" },
  { match: "Grioo.com", email: "redaction@grioo.com", website: "https://www.grioo.com" },
  { match: "Guinéenews.org", email: "courrier@boubah.com", website: "https://guineenews.org" },
  { match: "Hespress (Maroc)", email: "contact@hespress.com", website: "https://www.hespress.com" },
  { match: "Journal du Cameroun", email: "info@journalducameroun.com", website: "https://journalducameroun.com" },
  { match: "Kewoulo.info", email: "kewoulonews@gmail.com", website: "https://kewoulo.info" },
  { match: "Koaci.com", email: "contact@koaci.com", website: "https://koaci.com" },
  { match: "La Nouvelle Tribune (Bénin)", email: "contact@lanouvelletribune.info", website: "https://lanouvelletribune.info" },
  { match: "Le Djély (Guinée)", email: "contact@ledjely.com", website: "https://ledjely.com" },
  { match: "Lefaso.net", email: "contact@lefaso.net", website: "https://lefaso.net" },
  { match: "Leral.net", email: "leral@leral.net", website: "https://leral.net" },
  { match: "Linfodrome.com", email: "contact@linfodrome.com", website: "https://linfodrome.com" },
  { match: "Madagascar-Tribune.com", email: "redaction@madagascar-tribune.com", website: "https://madagascar-tribune.com" },
  { match: "Malijet.com", email: "contact@malijet.com", website: "https://malijet.com" },
  { match: "Maliweb.net", email: "contact@maliweb.net", website: "https://www.maliweb.net" },
  { match: "Midi Madagasikara", email: "dokamidi@gmail.com", website: "https://midi-madagasikara.mg" },
  { match: "Mondafrique", email: "nicolasbeau7@gmail.com", website: "https://mondafrique.com" },
  { match: "Nofi — Noir & Fier", email: "hello@nofi.fr", website: "https://www.nofi.media" },
  // Extra: the following entries also in the original 46 from the public page but were classified differently in DB — no-op here, they live in Média — Presse (Afrique Magazine, Amina, Africa Vivre, Courrier International, Financial Afrik, Jeune Afrique, Le Monde Afrique, Le Point Afrique) — handled below.
];

// Same updates also applied to the "Média — Presse" sister entries (several of the 46 online-media
// from the public page are in Média — Presse in the DB).
const pressUpdates = [
  { match: "Afrique Magazine", email: "digital@afriquemagazine.com", website: "https://www.afriquemagazine.com" },
  { match: "Amina Magazine", email: "info@aminamag.com", website: "https://aminamag.com" },
  { match: "Africa Vivre Magazine", email: "contact@africavivre.com", website: "https://africavivre.com" },
  { match: "Courrier International — Afrique", email: "recrutement@courrierinternational.com", website: "https://www.courrierinternational.com/sujet/afrique" },
  { match: "Financial Afrik", email: "redaction@financialafrik.com", website: "https://www.financialafrik.com" },
  { match: "Jeune Afrique", email: "redaction@jeuneafrique.com", website: "https://www.jeuneafrique.com" },
  { match: "Le Monde Afrique", email: "courrier-des-lecteurs@lemonde.fr", website: "https://www.lemonde.fr/afrique" },
  { match: "Le Point Afrique", email: "beschapasse@lepoint.fr", website: "https://www.lepoint.fr/afrique" },
];

// Entries to unpublish (dead / parked domains)
const toUnpublish = [
  { match: "Atabula — Gastronomie Africaine", reason: "Média fermé en janvier 2023" },
  { match: "Cameroon-info.net", reason: "HTTP 522 — origin serveur inaccessible" },
  { match: "Cas-info.ca", reason: "Domaine parqué GoDaddy — média mort" },
];

// Africajournal: may not exist in DB — add it if missing
const addIfMissing = [
  {
    companyName: "Africajournal (Le Journal Africa)",
    contactName: "Le Journal Africa",
    category: "Média — En ligne",
    country: "Burundi",
    email: "info@lejournal.africa",
    website: "https://lejournal.africa",
    description: "Média privé spécialisé sur l'Afrique, basé à Bujumbura (Burundi).",
    published: true,
  },
];

async function applyUpdate(update, dryRun) {
  const entry = await prisma.directoryEntry.findFirst({
    where: {
      OR: [
        { companyName: { equals: update.match, mode: "insensitive" } },
        { companyName: { contains: update.match, mode: "insensitive" } },
      ],
    },
  });
  if (!entry) {
    console.log(`  ⚠ NOT FOUND: ${update.match}`);
    return "not_found";
  }
  const changes = {};
  if (update.email && entry.email !== update.email) changes.email = update.email;
  if (update.website && entry.website !== update.website) changes.website = update.website;
  if (Object.keys(changes).length === 0) {
    console.log(`  = no change: ${entry.companyName}`);
    return "no_change";
  }
  const prev = `email=${entry.email || "-"} | website=${entry.website || "-"}`;
  const next = Object.entries(changes).map(([k, v]) => `${k}=${v}`).join(" | ");
  console.log(`  ✎ ${entry.companyName}`);
  console.log(`     from: ${prev}`);
  console.log(`     to  : ${next}`);
  if (!dryRun) {
    await prisma.directoryEntry.update({ where: { id: entry.id }, data: changes });
  }
  return "updated";
}

async function applyUnpublish(item, dryRun) {
  const entry = await prisma.directoryEntry.findFirst({
    where: { companyName: { contains: item.match, mode: "insensitive" } },
  });
  if (!entry) {
    console.log(`  ⚠ NOT FOUND: ${item.match}`);
    return "not_found";
  }
  if (!entry.published) {
    console.log(`  = already unpublished: ${entry.companyName}`);
    return "no_change";
  }
  console.log(`  ✗ UNPUBLISH: ${entry.companyName} (${item.reason})`);
  if (!dryRun) {
    await prisma.directoryEntry.update({ where: { id: entry.id }, data: { published: false } });
  }
  return "updated";
}

async function applyAddMissing(item, dryRun) {
  const existing = await prisma.directoryEntry.findFirst({
    where: {
      OR: [
        { companyName: { contains: "Africajournal", mode: "insensitive" } },
        { companyName: { contains: "Le Journal Africa", mode: "insensitive" } },
        { website: { contains: "lejournal.africa", mode: "insensitive" } },
      ],
    },
  });
  if (existing) {
    console.log(`  = already exists: ${existing.companyName}`);
    return "no_change";
  }
  console.log(`  + ADD: ${item.companyName}`);
  if (!dryRun) {
    await prisma.directoryEntry.create({ data: item });
  }
  return "created";
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const mode = dryRun ? "DRY RUN (no writes)" : "LIVE UPDATE";
  console.log(`\n=== ${mode} ===\n`);

  console.log("--- 1/4: Update Média — En ligne ---");
  let upd = 0, nop = 0, miss = 0;
  for (const u of updates) {
    const r = await applyUpdate(u, dryRun);
    if (r === "updated") upd++;
    else if (r === "no_change") nop++;
    else miss++;
  }
  console.log(`  → updated=${upd} unchanged=${nop} not_found=${miss}`);

  console.log("\n--- 2/4: Update Média — Presse (sister entries) ---");
  let upd2 = 0, nop2 = 0, miss2 = 0;
  for (const u of pressUpdates) {
    const r = await applyUpdate(u, dryRun);
    if (r === "updated") upd2++;
    else if (r === "no_change") nop2++;
    else miss2++;
  }
  console.log(`  → updated=${upd2} unchanged=${nop2} not_found=${miss2}`);

  console.log("\n--- 3/4: Unpublish dead media ---");
  for (const item of toUnpublish) await applyUnpublish(item, dryRun);

  console.log("\n--- 4/4: Add missing entries ---");
  for (const item of addIfMissing) await applyAddMissing(item, dryRun);

  console.log(`\n=== ${mode} done ===\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
