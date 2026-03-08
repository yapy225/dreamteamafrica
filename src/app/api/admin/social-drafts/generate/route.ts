import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, articleId } = body;

  if (!type) {
    return NextResponse.json(
      { error: "type is required (engagement | officiel)" },
      { status: 400 }
    );
  }

  try {
    let result: any;

    if (type === "engagement") {
      if (!articleId) {
        return NextResponse.json(
          { error: "articleId is required for engagement type" },
          { status: 400 }
        );
      }
      const { generateEngagementDrafts } = await import("@/lib/social-drafts");
      result = await generateEngagementDrafts(articleId);
    } else if (type === "officiel") {
      const { generateOfficielPromoDrafts } = await import(
        "@/lib/social-drafts"
      );
      result = await generateOfficielPromoDrafts();
    } else {
      return NextResponse.json(
        { error: "type must be engagement or officiel" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
