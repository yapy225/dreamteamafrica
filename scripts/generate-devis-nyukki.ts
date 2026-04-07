/**
 * Génère le devis exposant pour Nyukki Miels (Farida Kibout)
 * Usage : npx tsx scripts/generate-devis-nyukki.ts
 */
import fs from "fs";
import path from "path";
import { generateDevisExposant } from "../src/lib/generate-devis-exposant";

const OUTPUT = path.join(__dirname, "..", "devis-nyukki-miels.pdf");

async function main() {
  const buffer = await generateDevisExposant({
    name: "Farida KIBOUT",
    company: "Nyukki Miels",
    email: "farida.kibout@hotmail.fr",
    phone: "+33 6 20 46 21 43",
    eventSlug: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    pricePerDay: 160,
    totalPrice: 320,
  });

  fs.writeFileSync(OUTPUT, buffer);
  console.log(`✓ Devis généré : ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
