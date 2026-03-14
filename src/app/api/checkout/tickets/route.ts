import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import QRCode from "qrcode";
import { uploadBuffer } from "@/lib/bunny";
import { sendTicketConfirmationEmail } from "@/lib/email";
import { sendTicketConfirmationWhatsApp } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const { eventId, tier, quantity, sessionLabel, firstName, lastName, email, phone, visitDate } =
      await request.json();

    // Validate required nominative fields
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone) {
      return NextResponse.json(
        { error: "Nom, prénom, email et téléphone sont obligatoires." },
        { status: 400 },
      );
    }

    if (!eventId || !tier || !quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 },
      );
    }

    // Upsert user by email
    const user = await prisma.user.upsert({
      where: { email: trimmedEmail },
      update: {},
      create: {
        email: trimmedEmail,
        name: `${trimmedFirstName} ${trimmedLastName}`,
        phone: trimmedPhone,
      },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 },
      );
    }

    // Resolve price: custom tiers JSON > legacy price fields
    let unitPrice: number;
    let tierName: string;

    const customTiers = event.tiers as Array<{ id: string; name: string; price: number; quota?: number }> | null;
    const matchedTier = Array.isArray(customTiers)
      ? customTiers.find((t) => t.id === tier)
      : null;

    const legacyTiers = ["EARLY_BIRD", "STANDARD", "VIP"];

    if (matchedTier) {
      unitPrice = matchedTier.price;
      tierName = matchedTier.name;

      // Check tier-level quota
      if (matchedTier.quota != null) {
        const tierSold = await prisma.ticket.count({
          where: { eventId: event.id, tier },
        });
        const tierRemaining = matchedTier.quota - tierSold;
        if (tierRemaining < quantity) {
          return NextResponse.json(
            { error: tierRemaining <= 0
              ? `Plus de places disponibles pour "${tierName}".`
              : `Seulement ${tierRemaining} place(s) restante(s) pour "${tierName}".` },
            { status: 400 },
          );
        }
      }
    } else if (legacyTiers.includes(tier)) {
      const priceMap: Record<string, number> = {
        EARLY_BIRD: event.priceEarly,
        STANDARD: event.priceStd,
        VIP: event.priceVip,
      };
      const labelMap: Record<string, string> = {
        EARLY_BIRD: "Early Bird",
        STANDARD: "Standard",
        VIP: "VIP",
      };
      unitPrice = priceMap[tier];
      tierName = labelMap[tier];
    } else {
      return NextResponse.json(
        { error: "Tier invalide." },
        { status: 400 },
      );
    }

    const remaining = event.capacity - event._count.tickets;
    if (remaining < quantity) {
      return NextResponse.json(
        { error: `Seulement ${remaining} place(s) restante(s).` },
        { status: 400 },
      );
    }

    /* ── FREE TICKETS: create directly without Stripe ──────────── */
    if (unitPrice === 0) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
      const createdTickets: Array<{ id: string; qrCode: string }> = [];

      const ticketPromises = Array.from({ length: quantity }, async () => {
        const ticketId = crypto.randomUUID();
        const qrUrl = `${baseUrl}/check/${ticketId}`;
        const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
        const { url: qrCdnUrl } = await uploadBuffer(
          Buffer.from(qrBuffer),
          `qrcodes/tickets/${ticketId}.png`,
        );

        const ticket = await prisma.ticket.create({
          data: {
            id: ticketId,
            eventId: event.id,
            userId: user.id,
            tier,
            price: 0,
            qrCode: qrCdnUrl,
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            phone: trimmedPhone,
            visitDate: visitDate ? new Date(visitDate) : null,
          },
        });
        createdTickets.push({ id: ticket.id, qrCode: qrCdnUrl });
        return ticket;
      });

      await Promise.all(ticketPromises);

      // Send confirmation email
      try {
        await sendTicketConfirmationEmail({
          to: trimmedEmail,
          guestName: `${trimmedFirstName} ${trimmedLastName}`,
          eventTitle: event.title,
          eventVenue: event.venue,
          eventAddress: event.address,
          eventDate: visitDate ? new Date(visitDate) : event.date,
          eventCoverImage: event.coverImage,
          tier: tierName,
          price: 0,
          quantity,
          tickets: createdTickets,
        });
      } catch (emailErr) {
        console.error("Free ticket confirmation email failed:", emailErr);
      }

      // Send WhatsApp confirmation
      try {
        await sendTicketConfirmationWhatsApp({
          phone: trimmedPhone,
          customerName: `${trimmedFirstName} ${trimmedLastName}`,
          eventTitle: event.title,
          tier: tierName,
          quantity,
          totalPrice: 0,
          eventDate: new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(visitDate ? new Date(visitDate) : event.date),
          eventVenue: event.venue,
        });
      } catch (waErr) {
        console.error("WhatsApp free ticket confirmation failed:", waErr);
      }

      // Return first ticket ID for confirmation page
      return NextResponse.json({
        free: true,
        confirmationUrl: `${baseUrl}/saison-culturelle-africaine/confirmation/${createdTickets[0].id}`,
      });
    }

    /* ── PAID TICKETS: Stripe checkout ──────────────────────── */
    const productName = `${event.title} — ${tierName}`;

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: trimmedEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(unitPrice * 100),
            product_data: {
              name: productName,
              description: sessionLabel
                ? sessionLabel
                : `${event.venue} — ${new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
            },
          },
          quantity,
        },
      ],
      metadata: {
        type: "ticket",
        eventId: event.id,
        userId: user.id,
        tier,
        quantity: String(quantity),
        unitPrice: String(unitPrice),
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        ...(visitDate && { visitDate: String(visitDate) }),
        ...(sessionLabel && { sessionLabel }),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/${event.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", message, error);
    return NextResponse.json(
      { error: `Erreur: ${message}` },
      { status: 500 },
    );
  }
}
