import "dotenv/config";
import { uploadBuffer } from "../src/lib/bunny";
import fs from "fs";

async function main() {
  const buf = fs.readFileSync("/Users/yaps225/Desktop/Capture d'écran 2026-04-07 à 23.52.46.png");
  const r = await uploadBuffer(buf, "logo/logo-foire-dafrique-paris-2026.png");
  console.log(r.url);
}

main().catch(console.error);
