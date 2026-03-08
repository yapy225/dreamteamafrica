// ============================================================
// GET /api/admin/social/linkedin/callback
// Callback OAuth LinkedIn — échange le code contre un token
// et le sauvegarde en base (permanent refresh)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/dashboard?linkedin_error=${error || "no_code"}`
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/api/admin/social/linkedin/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "LinkedIn credentials manquantes" }, { status: 500 });
  }

  try {
    // 1. Exchange code for token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[LinkedIn callback] Token error:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/dashboard?linkedin_error=token_failed`
      );
    }

    // 2. Get member ID
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    const memberId = profile.sub || null;

    // 3. Save to database (upsert)
    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 5184000) * 1000);

    await prisma.socialCredential.upsert({
      where: { platform: "LINKEDIN" },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt,
        memberId,
        metadata: { name: profile.name, scope: tokenData.scope },
      },
      create: {
        platform: "LINKEDIN",
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt,
        memberId,
        metadata: { name: profile.name, scope: tokenData.scope },
      },
    });

    console.log(`[LinkedIn callback] Token renewed, expires: ${expiresAt.toISOString()}`);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/dashboard?linkedin_success=true`
    );
  } catch (err: any) {
    console.error("[LinkedIn callback] Error:", err.message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com"}/dashboard?linkedin_error=exception`
    );
  }
}
