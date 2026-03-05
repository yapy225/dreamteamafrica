import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const limit = parseInt(searchParams.get("limit") || "3");

    const campaigns = await prisma.adCampaign.findMany({
      where: { active: true },
      take: Math.min(limit, 10),
      orderBy: [
        { plan: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        supportType: true,
        mediaFormat: true,
        content: true,
        imageUrl: true,
        videoUrl: true,
        targetUrl: true,
      },
    });

    // Map to legacy format for backward compatibility
    const mapped = campaigns.map((c) => ({
      ...c,
      format: format || c.supportType,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Ad serve error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
