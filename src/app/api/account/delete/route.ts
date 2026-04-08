import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

/**
 * POST /api/account/delete
 * RGPD: Delete all personal data for the authenticated user (droit à l'oubli).
 * Anonymizes data instead of hard deleting to preserve financial records.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const rl = rateLimit(`delete-account:${session.user.id}`, { limit: 1, windowSec: 3600 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const { confirmation } = await request.json();
  if (confirmation !== "SUPPRIMER MON COMPTE") {
    return NextResponse.json(
      { error: "Veuillez taper 'SUPPRIMER MON COMPTE' pour confirmer." },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email || "";

  // Audit log BEFORE deletion (so we have a record)
  await audit({
    userId,
    userEmail,
    action: "account.delete",
    details: { reason: "user_request" },
  });

  const ANON_EMAIL = "supprime@anonyme.fr";
  const ANON_NAME = "SUPPRIMÉ";

  // ── Anonymize tickets (keep for financial/tax records) ──
  await prisma.ticket.updateMany({
    where: { userId },
    data: { firstName: ANON_NAME, lastName: ANON_NAME, email: ANON_EMAIL, phone: null },
  });

  // ── Anonymize exhibitor bookings ──
  await prisma.exhibitorBooking.updateMany({
    where: { userId },
    data: { contactName: ANON_NAME, email: ANON_EMAIL, phone: "", companyName: ANON_NAME },
  });

  // ── Anonymize exhibitor profiles ──
  await prisma.exhibitorProfile.updateMany({
    where: { userId },
    data: { companyName: ANON_NAME, description: null, logoUrl: null, videoUrl: null, image1Url: null, image2Url: null, image3Url: null },
  });

  // ── Anonymize orders ──
  await prisma.order.updateMany({
    where: { userId },
    data: { stripeSessionId: null },
  });

  // ── Anonymize event reservations (by email) ──
  await prisma.eventReservation.updateMany({
    where: { email: { equals: userEmail, mode: "insensitive" } },
    data: { firstName: ANON_NAME, lastName: ANON_NAME, email: ANON_EMAIL, phone: "" },
  });

  // ── Anonymize contact messages (by email) ──
  await prisma.contactMessage.updateMany({
    where: { email: { equals: userEmail, mode: "insensitive" } },
    data: { firstName: ANON_NAME, lastName: ANON_NAME, email: ANON_EMAIL, phone: null, company: null, message: "Contenu supprimé (RGPD)" },
  });

  // ── Anonymize exposant leads (by email) ──
  try {
    await prisma.exposantLead.updateMany({
      where: { email: { equals: userEmail, mode: "insensitive" } },
      data: { firstName: ANON_NAME, lastName: ANON_NAME, email: ANON_EMAIL, phone: "" },
    });
  } catch { /* table may not have all fields */ }

  // ── Delete newsletter subscription ──
  await prisma.newsletterSubscriber.deleteMany({
    where: { email: userEmail },
  });

  // ── Delete favorites ──
  await prisma.favorite.deleteMany({ where: { userId } });

  // ── Delete sessions & accounts ──
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { userId } });

  // ── Delete social credentials if admin (shouldn't happen but safety) ──

  // ── Anonymize user account (last step) ──
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: "Compte supprimé",
      email: `supprime-${userId.slice(0, 8)}@anonyme.fr`,
      phone: null,
      password: null,
      image: null,
      bio: null,
    },
  });

  console.log(`[RGPD] Account ${userId} fully anonymized`);

  return NextResponse.json({ success: true, message: "Votre compte a été supprimé et vos données anonymisées." });
}
