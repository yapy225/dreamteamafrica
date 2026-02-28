import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { adId, type } = await request.json();

    if (!adId || !["impression", "click"].includes(type)) {
      return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
    }

    const journalAd = await prisma.journalAd.findUnique({
      where: { id: adId },
      select: { id: true },
    });

    if (!journalAd) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    await prisma.journalAd.update({
      where: { id: adId },
      data: type === "impression"
        ? { impressions: { increment: 1 } }
        : { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Journal ad tracking error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
