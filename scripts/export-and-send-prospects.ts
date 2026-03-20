import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const formEntries = await prisma.exhibitorFormEntry.findMany({
    select: { firstName: true, lastName: true, email: true, phone: true, societe: true },
  });
  const inscriptions = await prisma.inscription.findMany({
    select: { directeur: true, email: true, mobile: true, entreprise: true },
  });
  const contacts = await prisma.contactMessage.findMany({
    where: { category: "EXPOSANT" },
    select: { firstName: true, lastName: true, email: true, phone: true, company: true },
  });
  const leads = await prisma.exposantLead.findMany({
    select: { firstName: true, lastName: true, email: true, phone: true, brand: true },
  });
  const bookings = await prisma.exhibitorBooking.findMany({
    select: { contactName: true, email: true, phone: true, companyName: true },
  });

  // CSV
  const csvLines = fs.readFileSync("/Users/yaps225/Downloads/exposants 2.csv", "utf-8").trim().split("\n");

  // Deduplicate by email
  const map = new Map<string, { firstName: string; lastName: string; email: string; phone: string | null; company: string | null; source: string }>();

  for (const e of formEntries) {
    const key = e.email.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, { firstName: e.firstName, lastName: e.lastName, email: key, phone: e.phone, company: e.societe, source: "formulaire" });
    }
  }

  for (const e of inscriptions) {
    const key = e.email.trim().toLowerCase();
    if (!map.has(key)) {
      const parts = (e.directeur || "").split(" ");
      map.set(key, { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", email: key, phone: e.mobile, company: e.entreprise, source: "inscription" });
    }
  }

  for (const e of contacts) {
    const key = e.email.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, { firstName: e.firstName, lastName: e.lastName, email: key, phone: e.phone, company: e.company, source: "contact" });
    }
  }

  for (const e of leads) {
    const key = e.email.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, { firstName: e.firstName, lastName: e.lastName, email: key, phone: e.phone, company: e.brand, source: "lead_whatsapp" });
    }
  }

  for (const e of bookings) {
    const key = e.email.trim().toLowerCase();
    if (!map.has(key)) {
      const parts = (e.contactName || "").split(" ");
      map.set(key, { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", email: key, phone: e.phone, company: e.companyName, source: "reservation" });
    }
  }

  for (const line of csvLines) {
    const cols = line.split(";");
    const key = (cols[4] || "").trim().toLowerCase();
    if (key && !map.has(key)) {
      map.set(key, { firstName: (cols[2] || "").trim(), lastName: (cols[3] || "").trim(), email: key, phone: (cols[5] || "").trim(), company: "", source: "csv" });
    }
  }

  const prospects = Array.from(map.values());
  console.log(`Total prospects uniques: ${prospects.length}`);

  // Import into ContactMessage if not already there
  let imported = 0;
  for (const p of prospects) {
    const exists = await prisma.contactMessage.findFirst({
      where: { email: { equals: p.email, mode: "insensitive" } },
    });
    if (!exists) {
      await prisma.contactMessage.create({
        data: {
          category: "EXPOSANT",
          firstName: p.firstName || "—",
          lastName: p.lastName || "—",
          email: p.email,
          phone: p.phone || null,
          company: p.company || null,
          message: `Prospect exposant importé depuis: ${p.source}`,
          read: false,
          status: "NOUVEAU",
        },
      });
      imported++;
    }
  }

  console.log(`Importés dans Messages de contact: ${imported}`);
  console.log(`Déjà existants: ${prospects.length - imported}`);

  // Save JSON for email sending
  fs.writeFileSync("/tmp/all-prospects.json", JSON.stringify(prospects, null, 2));
  console.log("Saved to /tmp/all-prospects.json");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
