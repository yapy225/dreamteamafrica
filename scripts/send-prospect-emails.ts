import "dotenv/config";
import fs from "fs";

// Force production URL for images
process.env.NEXT_PUBLIC_APP_URL = "https://dreamteamafrica.com";

import { sendProspectEmail } from "../src/lib/email";

interface Prospect {
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
}

async function main() {
  const prospects: Prospect[] = JSON.parse(fs.readFileSync("/tmp/all-prospects.json", "utf-8"));

  console.log(`Sending prospect emails to ${prospects.length} contacts...`);

  let sent = 0;
  let errors = 0;

  for (const p of prospects) {
    try {
      await sendProspectEmail({
        to: p.email,
        firstName: p.firstName || "Cher(e) exposant(e)",
        lastName: p.lastName || "",
        company: p.company,
      });
      sent++;
      console.log(`[${sent}/${prospects.length}] ✓ ${p.email}`);

      // Rate limit: 2 emails/sec (Resend free plan)
      await new Promise((r) => setTimeout(r, 500));
    } catch (err: any) {
      errors++;
      console.error(`[ERROR] ${p.email}: ${err.message}`);
    }
  }

  console.log(`\nDone! Sent: ${sent}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
