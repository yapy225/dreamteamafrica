import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Récupérer tous les ExhibitorFormEntry
  const formEntries = await prisma.exhibitorFormEntry.findMany();
  console.log(`ExhibitorFormEntry: ${formEntries.length} entrées`);

  // 2. Récupérer les ContactMessage de type EXPOSANT
  const contacts = await prisma.contactMessage.findMany({
    where: { category: "EXPOSANT" },
  });
  console.log(`ContactMessage (EXPOSANT): ${contacts.length} entrées`);

  // 3. Récupérer les emails déjà dans Inscription et DirectoryEntry
  const existingInscriptions = await prisma.inscription.findMany({
    select: { email: true },
  });
  const existingDirectory = await prisma.directoryEntry.findMany({
    select: { email: true },
  });
  const existingEmails = new Set([
    ...existingInscriptions.map((i) => i.email.toLowerCase()),
    ...existingDirectory.filter((d) => d.email).map((d) => d.email!.toLowerCase()),
  ]);
  console.log(`Emails déjà en base: ${existingEmails.size}`);

  // 4. Construire la liste dédupliquée par email
  const seen = new Set<string>();
  const toInsert: Array<{
    entreprise: string;
    categorie: string;
    directeur: string;
    ville: string;
    pays: string;
    mobile: string;
    email: string;
    description: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  }> = [];

  // Mapper les secteurs vers les catégories de L'Officiel
  function mapCategorie(secteur?: string | null): string {
    if (!secteur) return "Magasins";
    const s = secteur.toLowerCase();
    if (s.includes("mode") || s.includes("beauté") || s.includes("beauty") || s.includes("cosmétique") || s.includes("cosmetic") || s.includes("capillaire") || s.includes("textile") || s.includes("vestimentaire") || s.includes("maroquinerie") || s.includes("bijoux") || s.includes("accessoire") || s.includes("parfum")) return "Magasins";
    if (s.includes("art") || s.includes("déco") || s.includes("décoration")) return "Artistes";
    if (s.includes("restauration") || s.includes("boisson") || s.includes("épicerie") || s.includes("epicerie")) return "Restaurants";
    if (s.includes("édition") || s.includes("edition") || s.includes("livre") || s.includes("littérature") || s.includes("jeux")) return "Médias";
    if (s.includes("service") || s.includes("coaching") || s.includes("immobilier") || s.includes("solaire")) return "Services";
    if (s.includes("solidarité") || s.includes("association") || s.includes("humanitaire")) return "Associations";
    return "Magasins";
  }

  // D'abord les ExhibitorFormEntry (données plus complètes)
  for (const e of formEntries) {
    const email = (e.email || "").toLowerCase().trim();
    if (!email || seen.has(email) || existingEmails.has(email)) continue;
    seen.add(email);

    toInsert.push({
      entreprise: e.societe,
      categorie: mapCategorie(e.secteur),
      directeur: [e.firstName, e.lastName].filter(Boolean).join(" ").trim() || e.societe,
      ville: "Paris",
      pays: "France",
      mobile: e.phone || "",
      email: email,
      description: e.description || e.societe,
      facebook: e.facebook || undefined,
      instagram: e.instagram || undefined,
      whatsapp: e.phone || undefined,
    });
  }

  // Puis les ContactMessage exposants (complément)
  for (const c of contacts) {
    const email = (c.email || "").toLowerCase().trim();
    if (!email || seen.has(email) || existingEmails.has(email)) continue;
    seen.add(email);

    toInsert.push({
      entreprise: c.company || `${c.firstName} ${c.lastName}`,
      categorie: "Magasins",
      directeur: `${c.firstName} ${c.lastName}`.trim(),
      ville: "Paris",
      pays: "France",
      mobile: c.phone || "",
      email: email,
      description: c.message || "-",
      whatsapp: c.phone || undefined,
    });
  }

  console.log(`\nÀ insérer (dédupliqué): ${toInsert.length} entrées`);

  // 5. Insérer dans Inscription (status VALIDATED)
  let inscriptionCount = 0;
  let directoryCount = 0;

  for (const entry of toInsert) {
    // Créer l'Inscription
    await prisma.inscription.create({
      data: {
        entreprise: entry.entreprise,
        categorie: entry.categorie,
        directeur: entry.directeur,
        ville: entry.ville,
        pays: entry.pays,
        mobile: entry.mobile,
        email: entry.email,
        description: entry.description,
        facebook: entry.facebook,
        instagram: entry.instagram,
        whatsapp: entry.whatsapp,
        status: "VALIDATED",
      },
    });
    inscriptionCount++;

    // Créer le DirectoryEntry correspondant
    await prisma.directoryEntry.create({
      data: {
        companyName: entry.entreprise,
        contactName: entry.directeur,
        category: entry.categorie,
        city: "Paris",
        country: "France",
        phone: entry.mobile,
        email: entry.email,
        description: entry.description,
        facebook: entry.facebook,
        instagram: entry.instagram,
        whatsapp: entry.whatsapp,
        published: true,
      },
    });
    directoryCount++;
  }

  console.log(`\nRésultats:`);
  console.log(`  Inscriptions créées: ${inscriptionCount}`);
  console.log(`  DirectoryEntry créées: ${directoryCount}`);
  console.log(`  Doublons évités: ${formEntries.length + contacts.length - toInsert.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
