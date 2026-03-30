import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

async function main() {
  const email = "mafrikagalerie@gmail.com";
  const tempPassword = "MafrikaExpo2026!";
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      name: "Mafrika Galerie",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log(`OK — Compte cree/mis a jour: ${user.email} (id: ${user.id})`);
  console.log(`Mot de passe temporaire: ${tempPassword}`);

  await prisma.$disconnect();
}

main();
