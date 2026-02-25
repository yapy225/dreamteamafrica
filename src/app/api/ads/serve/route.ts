import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const limit = parseInt(searchParams.get("limit") || "3");

    const where: Record<string, unknown> = { active: true };
    if (format) where.format = format;

    const campaigns = await prisma.adCampaign.findMany({
      where,
      take: Math.min(limit, 10),
      orderBy: [
        { plan: "desc" }, // Premium first
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        format: true,
        content: true,
        imageUrl: true,
        videoUrl: true,
        targetUrl: true,
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Ad serve error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
