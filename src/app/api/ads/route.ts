import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { title, format, plan, content, imageUrl, videoUrl, targetUrl } = await request.json();

    if (!title || !format || !plan || !content || !targetUrl) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const validFormats = ["SPONSORED_ARTICLE", "BANNER", "VIDEO"];
    const validPlans = ["STARTER", "PRO", "PREMIUM"];

    if (!validFormats.includes(format)) {
      return NextResponse.json({ error: "Format invalide." }, { status: 400 });
    }
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    const campaign = await prisma.adCampaign.create({
      data: {
        userId: session.user.id,
        title,
        format,
        plan,
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        targetUrl,
        active: false, // Activated after payment
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
