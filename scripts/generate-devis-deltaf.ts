/**
 * Génère le devis exposant pour DELT'AF (Cathy Mare)
 * Usage : npx tsx scripts/generate-devis-deltaf.ts
 */
import fs from "fs";
import path from "path";
import { generateDevisExposant } from "../src/lib/generate-devis-exposant";

const OUTPUT = path.join(__dirname, "..", "devis-deltaf.pdf");

async function main() {
  const buffer = await generateDevisExposant({
    name: "Cathy MARE",
    company: "DELT'AF",
    email: "cathymare08@gmail.com",
    phone: "+33 6 67 78 18 55",
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
