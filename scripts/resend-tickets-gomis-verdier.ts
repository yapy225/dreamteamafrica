import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendTicketConfirmationEmail } from "../src/lib/email";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const prisma = new PrismaClient();

async function main() {
  // Resend Sam Gomis tickets
  const gomisTickets = await prisma.ticket.findMany({
    where: { email: "samgomis94@hotmail.fr" },
    include: { event: true },
    orderBy: { purchasedAt: "desc" },
  });

  if (gomisTickets.length > 0) {
    const first = gomisTickets[0];
    const event = first.event;
    await sendTicketConfirmationEmail({
      to: "samgomis94@hotmail.fr",
      guestName: `${first.firstName} ${first.lastName}`,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventAddress: event.address,
      eventDate: first.visitDate || event.date,
      eventCoverImage: event.coverImage,
      tier: "Early Bird",
      price: first.price,
      quantity: gomisTickets.length,
      tickets: gomisTickets.map((t) => ({ id: t.id, qrCode: t.qrCode })),
    });
    console.log(`✓ Email renvoyé à samgomis94@hotmail.fr (${gomisTickets.length} billets)`);
  }

  // Resend Verdier ticket
  const verdierTickets = await prisma.ticket.findMany({
    where: { email: "verdier_kafia@hotmail.fr" },
    include: { event: true },
  });

  if (verdierTickets.length > 0) {
    const first = verdierTickets[0];
    const event = first.event;
    await sendTicketConfirmationEmail({
      to: "verdier_kafia@hotmail.fr",
      guestName: `${first.firstName} ${first.lastName}`,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventAddress: event.address,
      eventDate: first.visitDate || event.date,
      eventCoverImage: event.coverImage,
      tier: "Early Bird",
      price: first.price,
      quantity: verdierTickets.length,
      tickets: verdierTickets.map((t) => ({ id: t.id, qrCode: t.qrCode })),
    });
    console.log(`✓ Email renvoyé à verdier_kafia@hotmail.fr (${verdierTickets.length} billet)`);
  }

  // WhatsApp notification
  await sendWhatsAppText("+33672052241", `Bonjour,

Nous venons de vous renvoyer vos billets par email :

- *Sam Gomis* : 3 billets envoyes a samgomis94@hotmail.fr
- *Kafia Verdier* : 1 billet envoye a verdier_kafia@hotmail.fr

Si vous ne les trouvez pas, pensez a verifier vos spams.

A tres bientot a la Foire d'Afrique Paris !

L'equipe Dream Team Africa`);
  console.log("✓ WhatsApp envoyé à +33672052241");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
