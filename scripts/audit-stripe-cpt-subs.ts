import "dotenv/config";
import Stripe from "stripe";

const EMAILS = ["ledoux.samuel@orange.fr", "glopa331@gmail.com"];

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const stripe = new Stripe(key);

  for (const email of EMAILS) {
    console.log(`\n=== ${email} ===`);
    const customers = await stripe.customers.list({ email, limit: 10 });
    if (customers.data.length === 0) {
      console.log("  aucun customer Stripe");
      continue;
    }
    for (const c of customers.data) {
      console.log(`  customer ${c.id} (created ${new Date(c.created * 1000).toISOString()})`);
      const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 20 });
      if (subs.data.length === 0) {
        console.log("    aucune subscription");
        continue;
      }
      for (const s of subs.data) {
        console.log(`    sub ${s.id} status=${s.status} created=${new Date(s.created * 1000).toISOString()} items=${s.items.data.map(i => `${i.price.unit_amount! / 100}€/${i.price.recurring?.interval}`).join(", ")}`);
      }
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
