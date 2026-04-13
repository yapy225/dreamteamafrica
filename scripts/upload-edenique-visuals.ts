import "dotenv/config";
import { uploadBuffer } from "../src/lib/bunny";
import fs from "fs";

async function main() {
  const files = [
    { src: "/Users/yaps225/Downloads/foiredafriqueparis#6 (2) copie.png", dest: "campaigns/edenique-coffee-sachet-yirgacheffe.png" },
    { src: "/Users/yaps225/Downloads/foiredafriqueparis#6 (1) copie.png", dest: "campaigns/edenique-coffee-tasse-ethiopie.png" },
  ];
  for (const f of files) {
    const buf = fs.readFileSync(f.src);
    const r = await uploadBuffer(buf, f.dest);
    console.log(r.url);
  }
}

main().catch(console.error);
