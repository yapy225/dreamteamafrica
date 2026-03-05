import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const VALID_SUPPORT_TYPES = ["IMAGE", "VIDEO", "ARTICLE", "SATELLITE"];
const VALID_MEDIA_FORMATS = ["SQUARE_1080", "LANDSCAPE_1920", "PORTRAIT_1080"];
const VALID_PLANS = ["ESSENTIEL", "BUSINESS", "ELITE"];
const VALID_PAGES = ["ACCUEIL", "JOURNAL", "OFFICIEL", "MARKETPLACE", "EVENEMENTS"];
const VALID_PLACEMENTS = ["HERO", "BANNER_TOP", "INLINE", "SIDEBAR", "VIDEO_SLOT", "IN_GRID", "INTERSTITIAL"];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      supportType,
      mediaFormat,
      plan,
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
    } = body;

    if (!title || !content || !targetUrl) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }
    if (!VALID_SUPPORT_TYPES.includes(supportType)) {
      return NextResponse.json({ error: "Type de support invalide." }, { status: 400 });
    }
    if (!VALID_MEDIA_FORMATS.includes(mediaFormat)) {
      return NextResponse.json({ error: "Format media invalide." }, { status: 400 });
    }
    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    // Validate arrays
    const validPages = (pages || []).filter((p: string) => VALID_PAGES.includes(p));
    const validPlacements = (placements || []).filter((p: string) => VALID_PLACEMENTS.includes(p));

    const campaign = await prisma.adCampaign.create({
      data: {
        userId: session.user.id,
        title,
        supportType: supportType as never,
        mediaFormat: mediaFormat as never,
        plan: plan as never,
        placements: validPlacements as never[],
        pages: validPages as never[],
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        targetUrl,
        ctaText: ctaText || null,
        advertiserName: advertiserName || null,
        satelliteKeywords: satelliteKeywords || [],
        satelliteTargetUrl: satelliteTargetUrl || null,
        active: false,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
