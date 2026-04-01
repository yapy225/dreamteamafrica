import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

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

  // Anonymize tickets (keep for financial records)
  await prisma.ticket.updateMany({
    where: { userId },
    data: {
      firstName: "SUPPRIMÉ",
      lastName: "SUPPRIMÉ",
      email: "supprime@anonyme.fr",
      phone: null,
    },
  });

  // Anonymize exhibitor bookings
  await prisma.exhibitorBooking.updateMany({
    where: { userId },
    data: {
      contactName: "SUPPRIMÉ",
      email: "supprime@anonyme.fr",
      phone: "",
    },
  });

  // Delete newsletter subscription
  await prisma.newsletterSubscriber.deleteMany({
    where: { email: session.user.email || "" },
  });

  // Delete favorites
  await prisma.favorite.deleteMany({ where: { userId } });

  // Anonymize user account
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

  console.log(`[RGPD] Account ${userId} anonymized (${session.user.email})`);

  return NextResponse.json({ success: true, message: "Votre compte a été supprimé et vos données anonymisées." });
}
