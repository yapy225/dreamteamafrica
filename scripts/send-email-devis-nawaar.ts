import "dotenv/config";
import { sendQuoteEmail } from "../src/lib/email";

async function main() {
  try {
    await sendQuoteEmail({
      to: "nawaarnaats@gmail.com",
      contactName: "Nawaar",
      companyName: "—",
      eventTitle: "Foire d'Afrique Paris — 6ème Édition",
      packName: "Pack Entrepreneur 2 jours",
      totalDays: 2,
      totalPrice: 320,
      installments: 10,
      installmentAmount: 27,
      bookingId: `DEVIS-${Date.now()}`,
    });
    console.log("OK - Email devis envoyé à nawaarnaats@gmail.com");
  } catch (err) {
    console.error("ERREUR:", err);
  }
}

main();
