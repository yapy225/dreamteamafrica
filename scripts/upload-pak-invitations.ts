import "dotenv/config";
import fs from "fs";
import path from "path";
import { uploadBuffer } from "../src/lib/bunny";

const downloadsDir = path.join(process.env.HOME || "/tmp", "Downloads");

const files = [
  "Invitation-KABAMBA_KASONGO-Crispin-FoireAfrique2026.pdf",
  "Invitation-ILUNGA_MBIYA-Fran_ois-FoireAfrique2026.pdf",
  "Invitation-NSINGI_DIEZEKA-Didier-FoireAfrique2026.pdf",
  "Invitation-TSHOMBE_KAT-Kathy-FoireAfrique2026.pdf",
  "Invitation-WAWA_IBALE_KEYILA-Rubins-FoireAfrique2026.pdf",
  "Invitation-EBENGO_NGOVO-Grace-FoireAfrique2026.pdf",
  "Invitation-WAWA_KEKIELE-Henriette-FoireAfrique2026.pdf",
  "Invitation-MASSAMBA_NDEDI-Beverly-FoireAfrique2026.pdf",
  "Invitation-WAWA_LOKANGO-Justin-FoireAfrique2026.pdf",
  "Invitation-MABIALA_YENGO-Ad_lard-FoireAfrique2026.pdf",
  "Invitation-KITIKAHOUN-Senade-Hypolite-FoireAfrique2026.pdf",
];

async function main() {
  for (const fileName of files) {
    const filePath = path.join(downloadsDir, fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP ${fileName} (not found)`);
      continue;
    }
    const buffer = fs.readFileSync(filePath);
    const cdnPath = `invitations/${fileName}`;
    try {
      const { url } = await uploadBuffer(Buffer.from(buffer), cdnPath, "application/pdf");
      console.log(`OK ${fileName} → ${url}`);
    } catch (err) {
      console.error(`ERREUR ${fileName}:`, err);
    }
  }
}

main();
