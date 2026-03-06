import { NextResponse } from "next/server";
import { serveAds } from "@/lib/ads";
import type { AdPage, AdPlacement } from "@prisma/client";

const VALID_PAGES: AdPage[] = ["ACCUEIL", "JOURNAL", "OFFICIEL", "MARKETPLACE", "EVENEMENTS"];
const VALID_PLACEMENTS: AdPlacement[] = ["HERO", "BANNER_TOP", "INLINE", "SIDEBAR", "VIDEO_SLOT", "IN_GRID", "INTERSTITIAL"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") as AdPage | null;
    const placement = searchParams.get("placement") as AdPlacement | null;
    const limit = parseInt(searchParams.get("limit") || "3");
    const exclude = searchParams.get("exclude");
    const excludeIds = exclude ? exclude.split(",").filter(Boolean) : [];

    if (!page || !VALID_PAGES.includes(page)) {
      return NextResponse.json({ error: "Page invalide." }, { status: 400 });
    }
    if (!placement || !VALID_PLACEMENTS.includes(placement)) {
      return NextResponse.json({ error: "Placement invalide." }, { status: 400 });
    }

    const ads = await serveAds(page, placement, Math.min(limit, 10), excludeIds);
    return NextResponse.json(ads);
  } catch (error) {
    console.error("Unified ad serve error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
