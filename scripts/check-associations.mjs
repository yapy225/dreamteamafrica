import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const all = await prisma.directoryEntry.findMany({
    where: {
      published: true,
      OR: [
        { category: { equals: "Association", mode: "insensitive" } },
        { category: { contains: "Association", mode: "insensitive" } },
        { category: { contains: "ONG", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      category: true,
      country: true,
      city: true,
      email: true,
      phone: true,
      website: true,
      facebook: true,
      instagram: true,
    },
    orderBy: [{ category: "asc" }, { companyName: "asc" }],
  });

  console.log(`Total associations: ${all.length}\n`);

  const missing = { bothMissing: [], onlyEmail: [], onlyPhone: [], complete: [] };
  for (const e of all) {
    if (!e.email && !e.phone) missing.bothMissing.push(e);
    else if (!e.email) missing.onlyPhone.push(e);
    else if (!e.phone) missing.onlyEmail.push(e);
    else missing.complete.push(e);
  }

  const fmt = (e) =>
    `  ${e.companyName || e.contactName} | ${e.category} | ${e.country || "-"} | 📧 ${e.email || "∅"} | 📞 ${e.phone || "∅"} | 🌐 ${e.website || "-"}`;

  console.log(`❌ AUCUN contact (email ni phone) : ${missing.bothMissing.length}`);
  missing.bothMissing.forEach((e) => console.log(fmt(e)));

  console.log(`\n⚠ Email manquant (phone OK) : ${missing.onlyPhone.length}`);
  missing.onlyPhone.forEach((e) => console.log(fmt(e)));

  console.log(`\n⚠ Phone manquant (email OK) : ${missing.onlyEmail.length}`);
  missing.onlyEmail.forEach((e) => console.log(fmt(e)));

  console.log(`\n✅ Email + Phone présents : ${missing.complete.length}`);
  missing.complete.forEach((e) => console.log(fmt(e)));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
