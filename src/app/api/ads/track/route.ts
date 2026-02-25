import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { campaignId, type } = await request.json();

    if (!campaignId || !["impression", "click"].includes(type)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    if (type === "impression") {
      await prisma.adCampaign.update({
        where: { id: campaignId },
        data: { impressions: { increment: 1 } },
      });
    } else {
      await prisma.adCampaign.update({
        where: { id: campaignId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Ad tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
