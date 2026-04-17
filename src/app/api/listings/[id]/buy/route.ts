import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { LISTING_CONFIG } from "@/lib/transfer-config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: listingId } = await params;
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));

    const rl = rateLimit(`listing-buy:${ip}`, { limit: 10, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const buyerEmail = typeof body.buyerEmail === "string" ? body.buyerEmail.trim().toLowerCase() : "";
    const buyerFirstName = typeof body.buyerFirstName === "string" ? body.buyerFirstName.trim().slice(0, 80) : "";
    const buyerLastName = typeof body.buyerLastName === "string" ? body.buyerLastName.trim().slice(0, 80) : "";
    const buyerPhone = typeof body.buyerPhone === "string" ? body.buyerPhone.trim().slice(0, 30) : "";

    if (!buyerEmail || !EMAIL_RE.test(buyerEmail) || buyerEmail.length > 254) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!buyerFirstName || !buyerLastName) {
      return NextResponse.json({ error: "Nom et prénom requis." }, { status: 400 });
    }

    const listing = await prisma.ticketTransfer.findUnique({
      where: { id: listingId },
      include: {
        ticket: {
          include: {
            event: { select: { id: true, title: true, slug: true, date: true, published: true } },
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }
    if (listing.status !== "LISTED") {
      return NextResponse.json({ error: "Cette annonce n'est plus disponible." }, { status: 400 });
    }
    if (listing.ticket.checkedInAt) {
      return NextResponse.json({ error: "Ce billet a été scanné : revente impossible." }, { status: 400 });
    }
    if (!listing.ticket.event.published) {
      return NextResponse.json({ error: "L'événement n'est plus publié." }, { status: 400 });
    }
    if (Date.now() > new Date(listing.ticket.event.date).getTime() - 24 * 3600 * 1000) {
      return NextResponse.json({ error: "Les reventes sont clôturées 24 h avant l'événement." }, { status: 400 });
    }
    // Anti-wash-trading : empêcher le vendeur de racheter son propre billet pour récupérer sa commission
    if (buyerEmail === listing.fromEmail.toLowerCase()) {
      return NextResponse.json({ error: "Vous ne pouvez pas acheter votre propre billet." }, { status: 400 });
    }

    const price = listing.publicPrice ? Number(listing.publicPrice) : Number(listing.ticket.price);
    const commission = Math.round(price * LISTING_CONFIG.COMMISSION_RATE * 100) / 100;
    const total = Math.round((price + commission) * 100) / 100;

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `Billet — ${listing.ticket.event.title}`,
              description: `${listing.ticket.tier} · Bourse officielle de billets DTA`,
            },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(commission * 100),
            product_data: { name: "Frais de service Bourse officielle (5 %)" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ticket_listing_purchase",
        transferId: listing.id,
        ticketId: listing.ticketId,
        buyerEmail,
        buyerFirstName,
        buyerLastName,
        buyerPhone,
      },
      success_url: `${appUrl}/bourse/${listing.id}?success=1`,
      cancel_url: `${appUrl}/bourse/${listing.id}`,
    });

    return NextResponse.json({ ok: true, url: checkoutSession.url, total });
  } catch (error) {
    console.error("[listing/buy] error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du paiement." }, { status: 500 });
  }
}
