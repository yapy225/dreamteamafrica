import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const mode = dryRun ? "DRY RUN (no writes)" : "LIVE UPDATE";
  console.log(`\n=== ${mode} ===\n`);

  // Find all associations/NGOs that lack email OR phone (i.e. don't meet minimum "email + phone")
  const toUnpublish = await prisma.directoryEntry.findMany({
    where: {
      published: true,
      OR: [
        { category: { equals: "Association", mode: "insensitive" } },
        { category: { contains: "Association", mode: "insensitive" } },
        { category: { contains: "ONG", mode: "insensitive" } },
      ],
      AND: [
        {
          OR: [
            { email: null },
            { email: "" },
            { phone: null },
            { phone: "" },
          ],
        },
      ],
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      category: true,
      email: true,
      phone: true,
    },
    orderBy: [{ category: "asc" }, { companyName: "asc" }],
  });

  console.log(`Associations/ONG à dépublier (manque email ou phone) : ${toUnpublish.length}\n`);

  for (const e of toUnpublish) {
    const reason = [];
    if (!e.email) reason.push("email manquant");
    if (!e.phone) reason.push("phone manquant");
    console.log(`  ✗ ${e.companyName || e.contactName} [${e.category}] — ${reason.join(" + ")}`);
  }

  if (!dryRun && toUnpublish.length > 0) {
    const result = await prisma.directoryEntry.updateMany({
      where: { id: { in: toUnpublish.map((e) => e.id) } },
      data: { published: false },
    });
    console.log(`\n→ ${result.count} fiches dépubliées.`);
  } else if (dryRun) {
    console.log(`\n(dry-run — aucune écriture)`);
  }

  // Summary
  const remaining = await prisma.directoryEntry.count({
    where: {
      published: true,
      OR: [
        { category: { contains: "Association", mode: "insensitive" } },
        { category: { contains: "ONG", mode: "insensitive" } },
      ],
    },
  });
  console.log(`\nReste publié dans Association/ONG : ${remaining}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
