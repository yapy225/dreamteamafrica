import "dotenv/config";
import fs from "fs";
import { prisma } from "../src/lib/db";

async function main() {
  // 1. Get all newsletter subscribers + CSV leads
  const subs = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  // Parse CSV leads
  const csvPath = "/Users/yaps225/Downloads/Leads_FoireAfrique_EarlyBird - Feuille 1.csv";
  const csv = fs.readFileSync(csvPath, "utf-8");
  const csvLines = csv.trim().split("\n").slice(1);
  const csvLeads = csvLines
    .map((line) => {
      const cols = line.split(",");
      return {
        email: (cols[14] || "").trim().toLowerCase(),
        phone: (cols[15] || "").trim(),
        name: (cols[13] || "").trim(),
      };
    })
    .filter((l) => l.email && l.email.includes("@") && !l.email.includes("test@"));

  // 2. Get existing buyers
  const tickets = await prisma.ticket.findMany({
    where: { eventId: "cmm767c1m0005ti794z61tzux" },
    select: { email: true, firstName: true, lastName: true, phone: true },
  });
  const buyerEmails = new Set(tickets.map((t) => t.email.toLowerCase()));

  // 3. Merge all contacts, dedupe
  const allEmails = new Set<string>();
  const allContacts: { email: string; phone?: string; name?: string }[] = [];

  for (const sub of subs) {
    const email = sub.email.toLowerCase();
    if (!allEmails.has(email)) {
      allEmails.add(email);
      allContacts.push({ email });
    }
  }
  for (const lead of csvLeads) {
    if (!allEmails.has(lead.email)) {
      allEmails.add(lead.email);
      allContacts.push({ email: lead.email, phone: lead.phone, name: lead.name });
    }
  }

  // 4. Split into audiences
  const prospects = allContacts.filter((c) => !buyerEmails.has(c.email));
  const buyers = tickets.map((t) => ({
    email: t.email.toLowerCase(),
    phone: t.phone || "",
    name: `${t.firstName || ""} ${t.lastName || ""}`.trim(),
  }));

  // 5. Export CSV — Audience to retarget (prospects, non-buyers)
  const prospectsCsv = "email,phone,fn\n" + prospects
    .map((c) => `${c.email},${c.phone || ""},${c.name || ""}`)
    .join("\n");
  fs.writeFileSync("/Users/yaps225/Downloads/fb-audience-prospects.csv", prospectsCsv);

  // 6. Export CSV — Buyers to exclude
  const buyersCsv = "email,phone,fn\n" + buyers
    .map((c) => `${c.email},${c.phone || ""},${c.name || ""}`)
    .join("\n");
  fs.writeFileSync("/Users/yaps225/Downloads/fb-audience-buyers-exclude.csv", buyersCsv);

  // 7. Export CSV — All contacts for Lookalike seed
  const allCsv = "email,phone,fn\n" + allContacts
    .map((c) => `${c.email},${c.phone || ""},${c.name || ""}`)
    .join("\n");
  fs.writeFileSync("/Users/yaps225/Downloads/fb-audience-all.csv", allCsv);

  console.log("=== Export terminé ===");
  console.log(`Prospects (à recibler) : ${prospects.length} → fb-audience-prospects.csv`);
  console.log(`Acheteurs (à exclure)  : ${buyers.length} → fb-audience-buyers-exclude.csv`);
  console.log(`Tous contacts (Lookalike) : ${allContacts.length} → fb-audience-all.csv`);

  await prisma.$disconnect();
}

main();
