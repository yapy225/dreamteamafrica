import "dotenv/config";
import fs from "fs";
import { prisma } from "../src/lib/db";

async function main() {
  const csv = fs.readFileSync("/Users/yaps225/Downloads/Leads_FoireAfrique_EarlyBird - Feuille 1 (1).csv", "utf-8");
  const lines = csv.trim().split("\n").slice(1);
  const csvEmails = new Set(
    lines.map(line => (line.split(",")[14] || "").trim().toLowerCase())
      .filter(e => e.includes("@") && !e.includes("test@"))
  );

  const subs = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });
  const dbEmails = new Set(subs.map(s => s.email.toLowerCase()));

  let inBoth = 0;
  let csvOnly = 0;
  for (const e of csvEmails) {
    if (dbEmails.has(e)) inBoth++;
    else csvOnly++;
  }

  console.log(`Prospects CSV: ${csvEmails.size}`);
  console.log(`Abonnes newsletter BDD: ${dbEmails.size}`);
  console.log(`Deja dans la BDD: ${inBoth}`);
  console.log(`Uniquement dans le CSV (pas en BDD): ${csvOnly}`);

  await prisma.$disconnect();
}

main();
