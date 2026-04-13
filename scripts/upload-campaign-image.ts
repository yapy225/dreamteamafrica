import "dotenv/config";
import { uploadBuffer } from "../src/lib/bunny";
import fs from "fs";

async function main() {
  const buf = fs.readFileSync("/Users/yaps225/Documents/Projets/foire-afrique-promo/public/images/foire-afrique.png");
  const r = await uploadBuffer(buf, "campaigns/foire-afrique-danseuse-j24.png");
  console.log(r.url);
}

main().catch(console.error);
