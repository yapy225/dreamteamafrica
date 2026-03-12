import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { readFileSync } from "fs";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

// Step 1: Import Stripe customer emails into newsletter
async function importStripeEmails() {
  const csv = readFileSync("/Users/yaps225/Downloads/unified_payments.csv", "utf-8");
  const lines = csv.split("\n");

  const emails = new Set<string>();
  for (const line of lines) {
    if (!line.includes(",Paid,")) continue;
    // Extract all emails from the line
    const matches = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (matches) {
      for (const email of matches) {
        const clean = email.toLowerCase().trim();
        if (!clean.includes("yapy.mambo")) {
          emails.add(clean);
        }
      }
    }
  }

  console.log(`Found ${emails.size} unique Stripe customer emails`);

  let added = 0;
  const batch = [...emails];
  for (let i = 0; i < batch.length; i += 50) {
    const chunk = batch.slice(i, i + 50);
    await Promise.allSettled(
      chunk.map((email) =>
        prisma.newsletterSubscriber.upsert({
          where: { email },
          create: { email, isActive: true },
          update: {},
        })
      )
    );
    added += chunk.length;
    process.stdout.write(`\r  Stripe import: ${added}/${batch.length}`);
  }
  console.log();

  const total = await prisma.newsletterSubscriber.count({ where: { isActive: true } });
  console.log(`Total active subscribers: ${total}`);
  return total;
}

// Step 2: Send newsletter in batches
async function sendNewsletter() {
  const htmlTemplate = readFileSync(
    "/Users/yaps225/Documents/Projets/dreamteamafrica/scripts/newsletter-saison2026.html",
    "utf-8"
  );

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
    orderBy: { subscribedAt: "asc" },
  });

  console.log(`\nSending newsletter to ${subscribers.length} subscribers...`);

  let sent = 0, errors = 0;

  for (let i = 0; i < subscribers.length; i++) {
    const sub = subscribers[i];
    const html = htmlTemplate.replace("{{email}}", encodeURIComponent(sub.email));

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: sub.email,
        subject: "Saison Culturelle Africaine 2026 — 7 événements à Paris, d'avril à décembre",
        html,
      });
      sent++;
    } catch (err: any) {
      console.error(`\n  ✗ ${sub.email}: ${err.message}`);
      errors++;
    }

    // Progress every 50
    if ((i + 1) % 50 === 0 || i === subscribers.length - 1) {
      process.stdout.write(`\r  Sent: ${sent} | Errors: ${errors} | Progress: ${i + 1}/${subscribers.length}`);
    }

    // Rate limit: ~2 emails/sec (Resend limit)
    await new Promise((r) => setTimeout(r, 550));
  }

  console.log(`\n\nDone! Sent: ${sent}, Errors: ${errors}`);
}

async function main() {
  console.log("=== IMPORT STRIPE EMAILS ===");
  await importStripeEmails();

  console.log("\n=== SEND NEWSLETTER ===");
  await sendNewsletter();

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
