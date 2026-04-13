import "dotenv/config";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { prisma } from "../src/lib/db";

async function main() {
  const email = "visiteur.test@dreamteamafrica.com";
  const password = "TestVisiteur2026!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "USER", name: "Visiteur Test" },
    create: {
      email,
      name: "Visiteur Test",
      password: hashedPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  const events = [
    {
      slug: "test-cpt-concert-afro",
      title: "[TEST] Concert Afro — Culture pour Tous",
      description: "Événement de test pour valider le parcours visiteur CPT (acomptes & recharges).",
      venue: "Salle de test",
      address: "10 rue du Test, 75000 Paris",
      date: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      capacity: 300,
      priceEarly: 20,
      priceStd: 30,
      priceVip: 60,
    },
    {
      slug: "test-cpt-soiree-gala",
      title: "[TEST] Soirée Gala — Culture pour Tous",
      description: "Deuxième événement de test (billet soldé).",
      venue: "Salon test",
      address: "5 avenue du Test, 75000 Paris",
      date: new Date(Date.now() + 60 * 24 * 3600 * 1000),
      capacity: 200,
      priceEarly: 40,
      priceStd: 55,
      priceVip: 100,
    },
  ];

  const createdEvents = [] as { id: string; title: string; slug: string }[];
  for (const ev of events) {
    const e = await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {},
      create: {
        ...ev,
        published: true,
      },
    });
    createdEvents.push({ id: e.id, title: e.title, slug: e.slug });
  }

  // Delete previous test tickets for this user
  await prisma.ticket.deleteMany({ where: { userId: user.id } });

  // Ticket 1 — partiellement payé (acompte + recharge partielle)
  const price1 = 60; // VIP
  const ticket1 = await prisma.ticket.create({
    data: {
      eventId: createdEvents[0].id,
      userId: user.id,
      tier: "VIP",
      price: price1,
      firstName: "Visiteur",
      lastName: "Test",
      email,
      installments: 3,
      totalPaid: 35,
      payments: {
        create: [
          { amount: 20, type: "cpt_deposit", label: "Acompte CPT (ouverture)", paidAt: new Date(Date.now() - 10 * 24 * 3600 * 1000) },
          { amount: 15, type: "recharge", label: "Recharge partielle", paidAt: new Date(Date.now() - 3 * 24 * 3600 * 1000) },
        ],
      },
    },
  });

  // Ticket 2 — soldé + QR code
  const price2 = 55; // STD
  const qrPayload = `DTA-TICKET-${createdEvents[1].slug}-${user.id}`;
  const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 300, margin: 1 });
  const ticket2 = await prisma.ticket.create({
    data: {
      eventId: createdEvents[1].id,
      userId: user.id,
      tier: "STANDARD",
      price: price2,
      firstName: "Visiteur",
      lastName: "Test",
      email,
      installments: 1,
      totalPaid: 55,
      qrCode: qrDataUrl,
      payments: {
        create: [
          { amount: 25, type: "cpt_deposit", label: "Acompte CPT", paidAt: new Date(Date.now() - 20 * 24 * 3600 * 1000) },
          { amount: 30, type: "recharge", label: "Solde final", paidAt: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
        ],
      },
    },
  });

  console.log("OK — Compte visiteur de test creé");
  console.log(`  Email:     ${email}`);
  console.log(`  Password:  ${password}`);
  console.log(`  User ID:   ${user.id}`);
  console.log(`  Evenements:`);
  for (const e of createdEvents) console.log(`    - ${e.title} (/${e.slug})`);
  console.log(`  Billets:`);
  console.log(`    - Ticket ${ticket1.id.slice(0, 8)} VIP 60€ — payé 35€, reste 25€ (2 versements)`);
  console.log(`    - Ticket ${ticket2.id.slice(0, 8)} STD 55€ — SOLDÉ (QR actif)`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
