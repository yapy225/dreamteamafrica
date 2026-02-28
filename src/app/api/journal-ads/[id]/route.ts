import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const journalAd = await prisma.journalAd.findUnique({ where: { id } });

    if (!journalAd) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    const {
      title,
      description,
      placement,
      ctaText,
      ctaUrl,
      imageUrl,
      gradientClass,
      campaignStart,
      campaignEnd,
      campaignWeeks,
      active,
    } = await request.json();

    if (placement) {
      const validPlacements = ["BANNER", "INLINE", "VIDEO", "SIDEBAR"];
      if (!validPlacements.includes(placement)) {
        return NextResponse.json({ error: "Placement invalide." }, { status: 400 });
      }
    }

    const updated = await prisma.journalAd.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(placement && { placement }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaUrl && { ctaUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(gradientClass !== undefined && { gradientClass }),
        ...(campaignStart !== undefined && { campaignStart: campaignStart ? new Date(campaignStart) : undefined }),
        ...(campaignEnd !== undefined && { campaignEnd: campaignEnd ? new Date(campaignEnd) : null }),
        ...(campaignWeeks !== undefined && { campaignWeeks }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update journal ad error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const journalAd = await prisma.journalAd.findUnique({ where: { id } });

    if (!journalAd) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    await prisma.journalAd.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete journal ad error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
