import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 100; // emails per cron run (Resend rate limit safe)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find active campaign
  const campaign = await prisma.newsletterCampaign.findFirst({
    where: { status: "SENDING" },
    orderBy: { createdAt: "asc" },
  });

  if (!campaign) {
    return NextResponse.json({ message: "No active campaign" });
  }

  // Get subscribers not yet emailed (using offset)
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { subscribedAt: "asc" },
    skip: campaign.sentEmails,
    take: BATCH_SIZE,
  });

  if (subscribers.length === 0) {
    // Campaign complete
    await prisma.newsletterCampaign.update({
      where: { id: campaign.id },
      data: { status: "COMPLETED", lastSentAt: new Date() },
    });
    return NextResponse.json({
      message: "Campaign completed",
      total: campaign.sentEmails,
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";
  let sent = 0;

  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: sub.email,
        subject: campaign.subject,
        html: campaign.htmlContent,
      });
      sent++;

      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`Newsletter send error for ${sub.email}:`, err);
    }
  }

  // Update campaign progress
  await prisma.newsletterCampaign.update({
    where: { id: campaign.id },
    data: {
      sentEmails: campaign.sentEmails + sent,
      lastSentAt: new Date(),
    },
  });

  return NextResponse.json({
    message: `Batch sent: ${sent}/${subscribers.length}`,
    progress: `${campaign.sentEmails + sent}/${campaign.totalEmails}`,
  });
}
