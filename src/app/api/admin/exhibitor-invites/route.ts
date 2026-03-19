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

  let sent = 0;
  let failed = 0;
  const results: Array<{ email: string; status: string }> = [];

  for (const b of bookings) {
    if (!b.profile) continue;

    try {
      await sendExhibitorProfileInviteEmail({
        to: b.email,
        contactName: b.contactName,
        companyName: b.companyName,
        profileToken: b.profile.token,
      });
      sent++;
      results.push({ email: b.email, status: "sent" });

      // Rate limit
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ email: b.email, status: `error: ${msg}` });
    }
  }

  return NextResponse.json({ sent, failed, total: bookings.length, results });
}
