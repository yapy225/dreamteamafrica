import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

async function main() {
  const email = "blakpenter@hotmail.fr";
  const tempPassword = "SylvieExpo2026!";
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      name: "Sylvie Juminnere",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log(`OK — Compte cree/mis a jour: ${user.email} (id: ${user.id})`);
  console.log(`Mot de passe temporaire: ${tempPassword}`);

  await prisma.$disconnect();
}

main();
