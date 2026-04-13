import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

async function main() {
  const email = "exposant.test@dreamteamafrica.com";
  const password = "TestExposant2026!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "EXPOSANT", name: "Exposant Test" },
    create: {
      email,
      name: "Exposant Test",
      password: hashedPassword,
      role: "EXPOSANT",
      emailVerified: new Date(),
    },
  });

  await prisma.exhibitorBooking.deleteMany({ where: { userId: user.id } });

  const totalPrice = 1200;
  const installments = 4;
  const installmentAmount = totalPrice / installments;

  const booking = await prisma.exhibitorBooking.create({
    data: {
      userId: user.id,
      companyName: "Boutique Test Afrik",
      contactName: "Exposant Test",
      email,
      phone: "+33600000000",
      sector: "Mode & Accessoires",
      pack: "ENTREPRENEUR",
      events: ["foire-dafrique-paris"],
      totalDays: 3,
      totalPrice,
      installments,
      installmentAmount,
      paidInstallments: 2,
      status: "PARTIAL",
      stands: 1,
      payments: {
        create: [
          { amount: installmentAmount, type: "deposit", label: "Acompte", paidAt: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
          { amount: installmentAmount, type: "installment", label: "Mensualité 1/3", paidAt: new Date(Date.now() - 5 * 24 * 3600 * 1000) },
        ],
      },
    },
  });

  console.log("OK — Compte exposant de test creé");
  console.log(`  Email:     ${email}`);
  console.log(`  Password:  ${password}`);
  console.log(`  Booking:   ${booking.id}`);
  console.log(`  Pack:      ENTREPRENEUR — 1200€ en 4x, 2 mensualités payées (600€), reste 600€`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
