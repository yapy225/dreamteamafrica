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
    const campaign = await prisma.adCampaign.findUnique({ where: { id } });

    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 });
    }
    if (campaign.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const {
      title,
      supportType,
      mediaFormat,
      placements,
      pages,
      content,
      imageUrl,
      videoUrl,
      targetUrl,
      ctaText,
      advertiserName,
      satelliteKeywords,
      satelliteTargetUrl,
      active,
    } = await request.json();

    const updated = await prisma.adCampaign.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(supportType && { supportType }),
        ...(mediaFormat && { mediaFormat }),
        ...(placements && { placements }),
        ...(pages && { pages }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(targetUrl && { targetUrl }),
        ...(ctaText !== undefined && { ctaText }),
        ...(advertiserName !== undefined && { advertiserName }),
        ...(satelliteKeywords !== undefined && { satelliteKeywords }),
        ...(satelliteTargetUrl !== undefined && { satelliteTargetUrl }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update campaign error:", error);
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
    const campaign = await prisma.adCampaign.findUnique({ where: { id } });

    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 });
    }
    if (campaign.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    await prisma.adCampaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
