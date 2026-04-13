import "dotenv/config";
import { uploadBuffer } from "../src/lib/bunny";
import fs from "fs";

async function main() {
  const buf = fs.readFileSync("/Users/yaps225/Desktop/DTA_Devis/images/Logo_Saison_culturelle_africaine_paris-2026.jpeg");
  const r = await uploadBuffer(buf, "logo/logo-saison-culturelle-africaine-2026.jpg");
  console.log(r.url);
}

main().catch(console.error);
