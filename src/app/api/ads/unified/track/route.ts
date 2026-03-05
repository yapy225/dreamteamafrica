import { NextResponse } from "next/server";
import { trackAd } from "@/lib/ads";

export async function POST(request: Request) {
  try {
    const { campaignId, type } = await request.json();

    if (!campaignId || !["impression", "click"].includes(type)) {
      return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
    }

    await trackAd(campaignId, type);
    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Unified ad track error:", error);
    return NextResponse.json({ error: "Erreur de tracking." }, { status: 500 });
  }
}
