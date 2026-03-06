import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

// Simple CSV parser handling quoted fields with newlines
function parseCSV(text) {
  const rows = [];
  let i = 0;
  while (i < text.length) {
    const row = [];
    while (i < text.length) {
      if (text[i] === '"') {
        i++; // skip opening quote
        let val = "";
        while (i < text.length) {
          if (text[i] === '"' && text[i + 1] === '"') {
            val += '"';
            i += 2;
          } else if (text[i] === '"') {
            i++; // skip closing quote
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

// Infer country from phone prefix
function inferCountry(phone) {
  if (!phone) return null;
  const p = phone.replace(/\s/g, "");
  if (p.startsWith("+33")) return "France";
  if (p.startsWith("+32")) return "Belgique";
  if (p.startsWith("+237")) return "Cameroun";
  if (p.startsWith("+242")) return "Congo";
  if (p.startsWith("+228")) return "Togo";
  if (p.startsWith("+221")) return "Senegal";
  if (p.startsWith("+224")) return "Guinee";
  if (p.startsWith("+227")) return "Niger";
  if (p.startsWith("+225")) return "Cote d'Ivoire";
  if (p.startsWith("+49")) return "Allemagne";
  return null;
}

// Extract URLs from text
function extractUrl(text, domain) {
  if (!text) return null;
  const regex = new RegExp(`https?://[^\\s,)]*${domain}[^\\s,)]*`, "i");
  const match = text.match(regex);
  return match ? match[0] : null;
}

// Extract company name from presentation (look for known patterns)
function extractCompanyName(text, prenom, nom) {
  if (!text) return null;
  // Look for brand name patterns
  const patterns = [
    /(?:marque|société|entreprise|asso(?:ciation)?)\s+([A-ZÀ-Ü][A-Za-zÀ-ü\s&'-]+)/,
    /(?:Chez|chez)\s+([A-ZÀ-Ü][A-Za-zÀ-ü\s&'-]+)/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node scripts/import-directory.mjs <csv-file>");
    process.exit(1);
  }

  const raw = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(raw);
  const headers = rows[0];
  const data = rows.slice(1);

  console.log(`Found ${data.length} rows, headers: ${headers.length} cols`);

  // Deduplicate by email (keep most recent / longest presentation)
  const byEmail = new Map();
  for (const row of data) {
    const email = (row[6] || "").trim().toLowerCase();
    const prenom = (row[3] || "").trim();
    const nom = (row[4] || "").trim();
    const phone = (row[5] || "").trim();
    const event = (row[7] || "").trim();
    const profil = (row[8] || "").trim();
    const presentation = (row[9] || "").trim();

    if (!email || !prenom) continue;
    // Skip test/junk entries
    if (presentation.length < 10 && !["test", "ras", "RAS", ".", "..."].includes(presentation.toLowerCase())) {
      if (presentation.length < 3) continue;
    }

    const key = email;
    const existing = byEmail.get(key);
    if (!existing || presentation.length > existing.presentation.length) {
      byEmail.set(key, {
        prenom, nom, phone, email, event, profil, presentation,
      });
    }
  }

  console.log(`${byEmail.size} unique entries after dedup`);

  let created = 0;
  for (const [, entry] of byEmail) {
    const country = inferCountry(entry.phone);
    const companyName = extractCompanyName(entry.presentation, entry.prenom, entry.nom);
    const website = extractUrl(entry.presentation, ".");
    const instagram = extractUrl(entry.presentation, "instagram");
    const facebook = extractUrl(entry.presentation, "facebook");

    // Skip very short / junk presentations
    if (entry.presentation.length < 5) continue;

    await prisma.directoryEntry.create({
      data: {
        companyName,
        contactName: `${entry.prenom} ${entry.nom}`.trim(),
        category: entry.profil,
        city: country === "France" ? "Paris" : null,
        country,
        phone: entry.phone || null,
        email: entry.email,
        website: website && !instagram && !facebook ? website : null,
        facebook,
        instagram,
        whatsapp: entry.phone || null,
        description: entry.presentation,
        event: entry.event || null,
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
