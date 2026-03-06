import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

// CSV parser handling quoted fields with newlines
function parseCSV(text) {
  const rows = [];
  let i = 0;
  while (i < text.length) {
    const row = [];
    while (i < text.length) {
      if (text[i] === '"') {
        i++;
        let val = "";
        while (i < text.length) {
          if (text[i] === '"' && text[i + 1] === '"') {
            val += '"';
            i += 2;
          } else if (text[i] === '"') {
            i++;
            break;
          } else {
            val += text[i];
            i++;
          }
        }
        row.push(val);
        if (text[i] === ",") i++;
        else if (text[i] === "\n" || text[i] === "\r") {
          if (text[i] === "\r" && text[i + 1] === "\n") i += 2;
          else i++;
          break;
        } else if (i >= text.length) break;
      } else {
        const nextComma = text.indexOf(",", i);
        const nextNL = text.indexOf("\n", i);
        const nextCR = text.indexOf("\r", i);
        const nextLine = nextCR >= 0 && nextNL >= 0 ? Math.min(nextCR, nextNL) : nextCR >= 0 ? nextCR : nextNL;
        if (nextComma >= 0 && (nextLine < 0 || nextComma < nextLine)) {
          row.push(text.slice(i, nextComma));
          i = nextComma + 1;
        } else if (nextLine >= 0) {
          row.push(text.slice(i, nextLine));
          i = nextLine;
          if (text[i] === "\r" && text[i + 1] === "\n") i += 2;
          else i++;
          break;
        } else {
          row.push(text.slice(i));
          i = text.length;
          break;
        }
      }
    }
    if (row.length > 0) rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node scripts/import-directory-v2.mjs <csv-file>");
    process.exit(1);
  }

  const raw = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(raw);
  const headers = rows[0];
  const data = rows.slice(1);

  console.log(`Headers (${headers.length}):`, headers.map((h, i) => `${i}:${h}`).join(" | "));
  console.log(`Found ${data.length} data rows`);

  // Column mapping for this CSV:
  // 0: Submission ID
  // 1: Respondent ID
  // 2: Submitted at
  // 3: Société
  // 4: Secteur d'activité
  // 5: First name
  // 6: Last name
  // 7: Numéro de téléphone
  // 8: Facebook
  // 9: Instagram
  // 10: e-mail
  // 11: Description
  // 12: Logo
  // 13: Image Un
  // 14: Image Deux
  // 15: Vidéo Promo
  // 16-18: Master class
  // 19: Image trois
  // 20: Jours de présence

  // Clear existing entries
  const deleted = await prisma.directoryEntry.deleteMany();
  console.log(`Cleared ${deleted.count} existing entries`);

  // Deduplicate by email
  const byEmail = new Map();
  for (const row of data) {
    const societe = (row[3] || "").trim();
    const secteur = (row[4] || "").trim();
    const prenom = (row[5] || "").trim();
    const nom = (row[6] || "").trim();
    const phone = (row[7] || "").trim();
    const facebook = (row[8] || "").trim();
    const instagram = (row[9] || "").trim();
    const email = (row[10] || "").trim().toLowerCase();
    const description = (row[11] || "").trim();

    if (!email || !description || description.length < 5) continue;

    const key = email;
    const existing = byEmail.get(key);
    if (!existing || description.length > existing.description.length) {
      byEmail.set(key, {
        societe, secteur, prenom, nom, phone, facebook, instagram, email, description,
      });
    }
  }

  console.log(`${byEmail.size} unique entries after dedup`);

  let created = 0;
  for (const [, e] of byEmail) {
    // Normalize phone
    let phone = e.phone.replace(/\s/g, "");
    if (phone.startsWith("0") && !phone.startsWith("+")) {
      phone = "+33" + phone.slice(1);
    }

    // Determine category from secteur or default to Exposant
    const category = e.secteur || "Autre";

    // Normalize Facebook URL
    let facebook = e.facebook;
    if (facebook && !facebook.startsWith("http")) {
      facebook = facebook.startsWith("@") ? `https://facebook.com/${facebook.slice(1)}` : `https://facebook.com/${facebook}`;
    }

    // Normalize Instagram
    let instagram = e.instagram;
    if (instagram && !instagram.startsWith("http")) {
      instagram = instagram.startsWith("@") ? `https://instagram.com/${instagram.slice(1)}` : `https://instagram.com/${instagram}`;
    }

    await prisma.directoryEntry.create({
      data: {
        companyName: e.societe || null,
        contactName: `${e.prenom} ${e.nom}`.trim(),
        category,
        country: "France",
        phone: phone || null,
        email: e.email,
        facebook: facebook || null,
        instagram: instagram || null,
        whatsapp: phone || null,
        description: e.description,
        published: true,
      },
    });
    created++;
  }

  console.log(`Created ${created} directory entries`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
