import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const {
      title,
      description,
      placement,
      ctaUrl,
      ctaText,
      imageUrl,
      gradientClass,
      campaignStart,
      campaignEnd,
      campaignWeeks,
    } = await request.json();

    if (!title || !description || !placement || !ctaUrl) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const validPlacements = ["BANNER", "INLINE", "VIDEO", "SIDEBAR"];
    if (!validPlacements.includes(placement)) {
      return NextResponse.json({ error: "Placement invalide." }, { status: 400 });
    }

    const journalAd = await prisma.journalAd.create({
      data: {
        title,
        description,
        placement,
        ctaUrl,
        ctaText: ctaText || null,
        imageUrl: imageUrl || null,
        gradientClass: gradientClass || null,
        campaignStart: campaignStart ? new Date(campaignStart) : new Date(),
        campaignEnd: campaignEnd ? new Date(campaignEnd) : null,
        campaignWeeks: campaignWeeks || 4,
      },
    });

    return NextResponse.json(journalAd, { status: 201 });
  } catch (error) {
    console.error("Create journal ad error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const journalAds = await prisma.journalAd.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(journalAds);
  } catch (error) {
    console.error("List journal ads error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
