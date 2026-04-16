import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // All existing media-related entries
  const all = await prisma.directoryEntry.findMany({
    where: {
      OR: [
        { category: { contains: "Média", mode: "insensitive" } },
        { category: { contains: "Media", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      category: true,
      country: true,
      email: true,
      website: true,
      published: true,
    },
    orderBy: [{ category: "asc" }, { companyName: "asc" }],
  });

  // Group by exact category
  const byCat = new Map();
  for (const e of all) {
    if (!byCat.has(e.category)) byCat.set(e.category, []);
    byCat.get(e.category).push(e);
  }

  for (const [cat, entries] of byCat) {
    console.log(`\n=== ${cat} (${entries.length}) ===`);
    for (const e of entries) {
      console.log(
        `  ${e.published ? "✓" : "✗"} ${e.companyName || e.contactName} | ${e.country || "-"} | ${e.website || "-"} | ${e.email || "-"}`
      );
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
