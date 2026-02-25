import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { campaignId, type } = await request.json();

    if (!campaignId || !["impression", "click"].includes(type)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const campaign = await prisma.adCampaign.findUnique({
      where: { id: campaignId },
      select: { id: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await prisma.adCampaign.update({
      where: { id: campaignId },
      data: type === "impression"
        ? { impressions: { increment: 1 } }
        : { clicks: { increment: 1 } },
    });

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Ad tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
