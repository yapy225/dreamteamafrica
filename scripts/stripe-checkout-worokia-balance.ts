/**
 * Crée une session Stripe one-shot pour le solde de Worokia Samake (Rokias_bakery)
 * Booking: cmo3zwp940001l1043x2x01e8 — Foire d'Afrique Paris 2026
 * Budget total: 640 € — Déjà payé: 121,50 € — Solde: 518,50 €
 *
 * Usage: npx tsx scripts/stripe-checkout-worokia-balance.ts
 */
import "dotenv/config";
import Stripe from "stripe";

const BOOKING_ID = "cmo3zwp940001l1043x2x01e8";
const EMAIL = "worokia.samake@gmail.com";
const COMPANY = "Rokias_bakery";
const AMOUNT_EUR = 518.5;

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  const stripe = new Stripe(key);

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "paypal"],
    customer_email: EMAIL,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(AMOUNT_EUR * 100),
          product_data: {
            name: `Solde exposant — ${COMPANY}`,
            description:
              "Solde du pack Entrepreneur 2 jours x 2 stands — Foire d'Afrique Paris 2026 (1 & 2 mai)",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "exhibitor_manual_balance",
      bookingId: BOOKING_ID,
      email: EMAIL,
      company: COMPANY,
      amount: String(AMOUNT_EUR),
    },
    success_url: `${APP_URL}/exposants/confirmation/${BOOKING_ID}`,
    cancel_url: `${APP_URL}/exposants/confirmation/${BOOKING_ID}`,
  });

  console.log("✓ Session Stripe créée");
  console.log("ID:", session.id);
  console.log("URL:", session.url);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
