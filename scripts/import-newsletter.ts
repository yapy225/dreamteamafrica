import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  const dir = "/Users/yaps225/Downloads";
  const files = readdirSync(dir).filter(
    (f) => f.startsWith("contacts_2026_03_12_05_5") && f.endsWith(".csv")
  );

  console.log(`Found ${files.length} CSV files`);

  // Collect all unique emails with their data
  const contacts = new Map<string, { email: string; name: string; surname: string; subscribedAt: string }>();

  for (const file of files) {
    const content = readFileSync(`${dir}/${file}`, "utf-8");
    const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("Email,Name"));

    for (const line of lines) {
      // Parse CSV (handle quoted fields)
      const match = line.match(/^([^,]*),([^,]*),([^,]*),"?([^",]*)"?,(.*)$/);
      if (!match) continue;

      const [, email, name, surname, subscribedAt] = match;
      if (!email?.trim()) continue;

      const cleanEmail = email.trim().toLowerCase();
      if (!contacts.has(cleanEmail)) {
        contacts.set(cleanEmail, {
          email: cleanEmail,
          name: name?.trim() || "",
          surname: surname?.trim() || "",
          subscribedAt: subscribedAt?.trim() || "2025-10-19",
        });
      }
    }
  }

  console.log(`${contacts.size} unique contacts to import`);

  // Insert in batches of 50
  const entries = [...contacts.values()];
  let created = 0, skipped = 0;

  for (let i = 0; i < entries.length; i += 50) {
    const batch = entries.slice(i, i + 50);

    const results = await Promise.allSettled(
      batch.map((c) =>
        prisma.newsletterSubscriber.upsert({
          where: { email: c.email },
          create: {
            email: c.email,
            isActive: true,
            subscribedAt: new Date(c.subscribedAt || "2025-10-19"),
          },
          update: {}, // Don't overwrite if already exists
        })
      )
    );

    for (const r of results) {
      if (r.status === "fulfilled") created++;
      else skipped++;
    }

    process.stdout.write(`\r  Processed ${Math.min(i + 50, entries.length)}/${entries.length}`);
  }

  console.log(`\n\nDone! Upserted: ${created}, Errors: ${skipped}`);

  const total = await prisma.newsletterSubscriber.count();
  console.log(`Total subscribers in DB: ${total}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
