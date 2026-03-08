// ============================================================
// GET /api/admin/social/linkedin/authorize
// Redirige vers LinkedIn OAuth pour renouveler le token
// ============================================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/api/admin/social/linkedin/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "LINKEDIN_CLIENT_ID manquant" }, { status: 500 });
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "w_member_social openid profile",
    state: "linkedin_refresh_" + Date.now(),
  });

  return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
}
