import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "../src/lib/db";
import { uploadBuffer } from "../src/lib/bunny";
import { sendTicketConfirmationEmail } from "../src/lib/email";

const EVENT_ID = "cmm767c1m0005ti794z61tzux"; // Foire d'Afrique Paris
const USER_ID = "cmm767bwg0001ti79pm86ctyj";
const FIRST_NAME = "JEAN-JACQUES";
const LAST_NAME = "SILIKY";
const EMAIL = "slk17@live.fr";
const TIER = "EARLY_BIRD";
const PRICE = 5;
const QUANTITY = 2;
const VISIT_DATE = new Date("2026-05-02T12:00:00Z");

async function main() {
  const event = await prisma.event.findUniqueOrThrow({ where: { id: EVENT_ID } });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
  const createdTickets: Array<{ id: string; qrCode: string }> = [];

  for (let i = 0; i < QUANTITY; i++) {
    const ticketId = crypto.randomUUID();
    const qrUrl = `${baseUrl}/check/${ticketId}`;
    const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
    const { url: qrCdnUrl } = await uploadBuffer(
      Buffer.from(qrBuffer),
      `qrcodes/tickets/${ticketId}.png`,
    );

    await prisma.ticket.create({
      data: {
        id: ticketId,
        eventId: EVENT_ID,
        userId: USER_ID,
        tier: TIER,
        price: PRICE,
        qrCode: qrCdnUrl,
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
        email: EMAIL,
        visitDate: VISIT_DATE,
      },
    });

    createdTickets.push({ id: ticketId, qrCode: qrCdnUrl });
    console.log(`✓ Billet créé: ${ticketId}`);
  }

  // Resolve tier name
  const customTiers = event.tiers as Array<{ id: string; name: string }> | null;
  const matchedTier = Array.isArray(customTiers)
    ? customTiers.find((t) => t.id === TIER)
    : null;
  const tierName = matchedTier?.name || TIER;

  await sendTicketConfirmationEmail({
    to: EMAIL,
    guestName: `${FIRST_NAME} ${LAST_NAME}`,
    eventTitle: event.title,
    eventVenue: event.venue,
    eventAddress: event.address,
    eventDate: VISIT_DATE,
    eventCoverImage: event.coverImage,
    tier: tierName,
    price: PRICE,
    quantity: QUANTITY,
    tickets: createdTickets,
  });

  console.log(`\n✓ Email envoyé à ${EMAIL} avec ${QUANTITY} billets`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
