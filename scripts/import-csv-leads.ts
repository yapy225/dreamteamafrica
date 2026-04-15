/**
 * Import Meta Ads Lead Forms CSV → Lead + NewsletterSubscriber (idempotent).
 *
 * Usage:
 *   npx tsx scripts/import-csv-leads.ts <csv-path> <formId> [phoneColumn]
 *
 * Colonne phone par défaut = "phone_number". Si la colonne s'appelle
 * différemment (ex. "whatsapp_number"), passer son nom en 3e argument.
 *
 * Dedup: Lead.fbLeadId (unique) en priorité, fallback email.
 * Crée/met à jour NewsletterSubscriber (isActive=true) pour chaque email valide.
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    header.forEach((h, i) => (row[h] = cols[i] ?? ""));
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function normalizePhone(raw: string): string {
  return raw.replace(/^p:/, "").replace(/\s+/g, "").trim();
}

function isTestLead(row: Record<string, string>): boolean {
  return (
    row.email === "test@meta.com" ||
    row.full_name?.startsWith("<test lead") ||
    (row.is_organic === "true" && row.ad_id === "")
  );
}

async function main() {
  const [csvPath, formId, phoneCol = "phone_number"] = process.argv.slice(2);
  if (!csvPath || !formId) {
    console.error("Usage: tsx scripts/import-csv-leads.ts <csv> <formId> [phoneCol]");
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  console.log(`[CSV] ${rows.length} lignes dans ${csvPath}`);

  const seenEmails = new Set<string>();
  let createdLeads = 0;
  let updatedLeads = 0;
  let createdSubs = 0;
  let reactivatedSubs = 0;
  let skippedTest = 0;
  let skippedBadEmail = 0;

  for (const row of rows) {
    if (isTestLead(row)) {
      skippedTest++;
      continue;
    }

    const fbLeadId = row.id?.replace(/^l:/, "").trim() || null;
    const email = row.email?.trim().toLowerCase();
    const name = row.full_name?.trim() || "Sans nom";
    const phone = normalizePhone(row[phoneCol] || "");
    const profile = row["vous_êtes_?"]?.trim() || "Visiteur";

    if (!email || !email.includes("@")) {
      skippedBadEmail++;
      continue;
    }
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);

    // Lead upsert (fbLeadId préféré, sinon create/update par email)
    let lead;
    if (fbLeadId) {
      lead = await prisma.lead.upsert({
        where: { fbLeadId },
        update: { formId, name, phone, profile, source: "facebook_leads" },
        create: {
          name,
          email,
          phone,
          source: "facebook_leads",
          profile,
          formId,
          fbLeadId,
        },
      });
    } else {
      const existing = await prisma.lead.findFirst({ where: { email, formId } });
      if (existing) {
        lead = await prisma.lead.update({
          where: { id: existing.id },
          data: { name, phone, profile },
        });
      } else {
        lead = await prisma.lead.create({
          data: { name, email, phone, source: "facebook_leads", profile, formId },
        });
      }
    }
    if (lead.createdAt.getTime() > Date.now() - 5_000) createdLeads++;
    else updatedLeads++;

    // NewsletterSubscriber upsert — consent implicite du formulaire Meta
    const sub = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true },
    });
    if (sub.subscribedAt.getTime() > Date.now() - 5_000) createdSubs++;
    else if (!sub.isActive) reactivatedSubs++;
  }

  console.log("");
  console.log(`[Lead] créés=${createdLeads} mis à jour=${updatedLeads}`);
  console.log(`[Newsletter] créés=${createdSubs} réactivés=${reactivatedSubs}`);
  console.log(`[Skip] tests=${skippedTest} emails invalides=${skippedBadEmail}`);
  console.log(`[Uniques] ${seenEmails.size} emails distincts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
