import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAndPublishExhibitorPosts } from "@/lib/social-drafts";

// POST: generate posts + publish directly for one exhibitor profile
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { profileId } = await request.json();

  if (!profileId) {
    return NextResponse.json(
      { error: "profileId requis" },
      { status: 400 },
    );
  }

  try {
    const result = await generateAndPublishExhibitorPosts(profileId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
