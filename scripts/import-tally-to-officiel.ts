import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  const csv = fs.readFileSync(
    "/Users/yaps225/Downloads/Saison Culturelle Africaine Paris-2026_Submissions_2026-03-21.csv",
    "utf-8",
  );

  const lines = csv.split("\n").filter((l) => l.trim());
  const header = parseCSVLine(lines[0]);

  const colIdx = (name: string) => {
    const idx = header.findIndex((h) =>
      h.toLowerCase().replace(/["\uFEFF]/g, "").includes(name.toLowerCase()),
    );
    return idx;
  };

  const iSociete = colIdx("Société");
  const iSecteur = colIdx("Secteur");
  const iFirstName = colIdx("First name");
  const iLastName = colIdx("Last name");
  const iPhone = colIdx("téléphone");
  const iFacebook = colIdx("Facebook");
  const iInstagram = colIdx("Instagram");
  const iEmail = colIdx("e-mail");
  const iDescription = colIdx("description");

  console.log("Colonnes trouvées:");
  console.log("  Société:", iSociete, "Secteur:", iSecteur);
  console.log("  FirstName:", iFirstName, "LastName:", iLastName);
  console.log("  Phone:", iPhone, "Email:", iEmail);
  console.log("  Facebook:", iFacebook, "Instagram:", iInstagram);
  console.log("  Description:", iDescription);
  console.log("");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const email = (cols[iEmail] || "").replace(/"/g, "").trim();
    const firstName = (cols[iFirstName] || "").replace(/"/g, "").trim();
    const lastName = (cols[iLastName] || "").replace(/"/g, "").trim();
    const company = (cols[iSociete] || "").replace(/"/g, "").trim();
    const sector = (cols[iSecteur] || "").replace(/"/g, "").trim();
    const phone = (cols[iPhone] || "").replace(/"/g, "").trim();
    const facebook = (cols[iFacebook] || "").replace(/"/g, "").trim();
    const instagram = (cols[iInstagram] || "").replace(/"/g, "").trim();
    const description = (cols[iDescription] || "").replace(/"/g, "").trim();
    const contactName = `${firstName} ${lastName}`.trim();

    if (!email || !contactName) continue;

    // Check duplicates
    const existing = await prisma.directoryEntry.findFirst({
      where: {
        OR: [
          { email },
          ...(company ? [{ companyName: company }] : []),
        ],
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    try {
      await prisma.directoryEntry.create({
        data: {
          companyName: company || null,
          contactName,
          category: sector || "Autre",
          city: "Paris",
          country: "France",
          phone: phone || null,
          email,
          facebook: facebook || null,
          instagram: instagram || null,
          description: description || sector || company || "",
          published: true,
        },
      });
      created++;
      console.log(`✓ ${company || contactName} — ${sector || "Autre"}`);
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      if (failed <= 5) console.error(`✗ ${contactName}: ${msg}`);
    }
  }

  console.log("");
  console.log(`Créés: ${created} | Déjà existants: ${skipped} | Échoués: ${failed}`);

  const total = await prisma.directoryEntry.count({ where: { published: true } });
  console.log(`Total annuaire: ${total} fiches`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
