/**
 * Exporte 3 CSV pour Meta Custom Audiences :
 *   - fb-audience-buyers-exclude.csv : acheteurs (tous événements) — à EXCLURE des pubs
 *   - fb-audience-prospects.csv       : leads+newsletter sans achat — à CIBLER
 *   - fb-audience-all.csv             : tous contacts — seed Lookalike
 *
 * Colonnes Meta standard (hashées côté plateforme) : email, phone, fn, ln
 *
 * Usage : npx tsx scripts/export-audiences-facebook.ts
 */
import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function csvSafe(v: string | null | undefined): string {
  const s = (v ?? "").replace(/[\r\n,]/g, " ").trim();
  return s;
}

function splitName(full: string | null | undefined): { fn: string; ln: string } {
  if (!full) return { fn: "", ln: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return { fn: parts[0] || "", ln: "" };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

async function main() {
  // 1. Acheteurs = tous les Tickets (tous événements confondus)
  const tickets = await prisma.ticket.findMany({
    select: { email: true, firstName: true, lastName: true, phone: true },
  });
  const buyersMap = new Map<string, { email: string; phone: string; fn: string; ln: string }>();
  for (const t of tickets) {
    if (!t.email) continue;
    const email = t.email.toLowerCase();
    if (buyersMap.has(email)) continue;
    buyersMap.set(email, {
      email,
      phone: t.phone || "",
      fn: t.firstName || "",
      ln: t.lastName || "",
    });
  }

  // 2. Leads (Meta Lead Ads) — on a name complet, à splitter
  const leads = await prisma.lead.findMany({
    select: { email: true, name: true, phone: true },
  });

  // 3. Newsletter subscribers — email uniquement
  const subs = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  // 4. Merge tous contacts (dedupe par email)
  const allMap = new Map<string, { email: string; phone: string; fn: string; ln: string }>();
  // Ordre : acheteurs d'abord (meilleures données), puis leads, puis subs
  for (const [email, v] of buyersMap) allMap.set(email, v);

  for (const l of leads) {
    const email = l.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (allMap.has(email)) continue;
    const { fn, ln } = splitName(l.name);
    allMap.set(email, { email, phone: l.phone || "", fn, ln });
  }

  for (const s of subs) {
    const email = s.email.trim().toLowerCase();
    if (allMap.has(email)) continue;
    allMap.set(email, { email, phone: "", fn: "", ln: "" });
  }

  // 5. Split
  const buyers = [...buyersMap.values()];
  const buyerEmails = new Set(buyersMap.keys());
  const prospects = [...allMap.values()].filter((c) => !buyerEmails.has(c.email));

  // 6. Formatter CSV avec header Meta conforme
  const header = "email,phone,fn,ln";
  const rowFmt = (c: { email: string; phone: string; fn: string; ln: string }) =>
    `${csvSafe(c.email)},${csvSafe(c.phone)},${csvSafe(c.fn)},${csvSafe(c.ln)}`;

  const outDir = "/Users/yaps225/Downloads";
  fs.writeFileSync(
    `${outDir}/fb-audience-buyers-exclude.csv`,
    [header, ...buyers.map(rowFmt)].join("\n"),
  );
  fs.writeFileSync(
    `${outDir}/fb-audience-prospects.csv`,
    [header, ...prospects.map(rowFmt)].join("\n"),
  );
  fs.writeFileSync(
    `${outDir}/fb-audience-all.csv`,
    [header, ...[...allMap.values()].map(rowFmt)].join("\n"),
  );

  console.log("=== Export Meta audiences ===");
  console.log(`Acheteurs (à EXCLURE)      : ${buyers.length} → fb-audience-buyers-exclude.csv`);
  console.log(`Prospects (à CIBLER)       : ${prospects.length} → fb-audience-prospects.csv`);
  console.log(`Seed Lookalike (tous)      : ${allMap.size} → fb-audience-all.csv`);
  console.log("");
  console.log("👉 Upload manuel dans Meta Ads Manager → Audiences :");
  console.log("   • Acheteurs — Exclure : remplacer le fichier par fb-audience-buyers-exclude.csv");
  console.log("   • Prospects          : remplacer par fb-audience-prospects.csv");
  console.log("Les Lookalike associés se recalculent automatiquement sous 24–48h.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
