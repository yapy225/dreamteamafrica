import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement");
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!placement) {
      return NextResponse.json({ error: "Placement requis." }, { status: 400 });
    }

    const now = new Date();

    const ads = await prisma.journalAd.findMany({
      where: {
        active: true,
        placement: placement as "BANNER" | "INLINE" | "VIDEO" | "SIDEBAR",
        campaignStart: { lte: now },
        OR: [
          { campaignEnd: null },
          { campaignEnd: { gte: now } },
        ],
      },
      take: Math.min(limit, 10),
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error("Journal ad serve error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
