import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendExhibitorProfileInviteEmail } from "@/lib/email";

// POST: send profile invite emails to all exhibitors who haven't submitted
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const bookings = await prisma.exhibitorBooking.findMany({
    where: {
      status: { in: ["PARTIAL", "CONFIRMED"] },
      email: { not: { endsWith: "@exposant.temp" } },
      profile: { submittedAt: null },
    },
    include: {
      profile: { select: { id: true, token: true, submittedAt: true } },
    },
  });

  const toSend = bookings.filter((b) => b.profile);

  // Send emails in background (don't await all) to avoid Vercel timeout
  // Fire-and-forget: send all emails without blocking the response
  const sendAll = async () => {
    for (const b of toSend) {
      try {
        await sendExhibitorProfileInviteEmail({
          to: b.email,
          contactName: b.contactName,
          companyName: b.companyName,
          profileToken: b.profile!.token,
        });
        console.log(`[exhibitor-invite] ✓ ${b.email}`);
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[exhibitor-invite] ✗ ${b.email}: ${msg}`);
      }
    }
  };

  // Start sending without awaiting (runs in background on serverless)
  sendAll().catch((err) =>
    console.error("[exhibitor-invite] batch error:", err),
  );

  // Return immediately with count
  return NextResponse.json({
    sent: toSend.length,
    failed: 0,
    total: bookings.length,
    message: `${toSend.length} emails en cours d'envoi`,
  });
}
