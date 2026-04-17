import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";
import { rateLimitStrict, getClientIp } from "@/lib/rate-limit";

const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Dream Team Africa <onboarding@resend.dev>";

export async function POST(request: Request) {
  try {
    // Rate limit: 3 requests per 15 minutes per IP (DB-backed strict)
    const ip = getClientIp(request);
    const rl = await rateLimitStrict(`forgot-pwd:${ip}`, { limit: 3, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis." },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Generate reset token — store hash in DB, send plain token in email
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: trimmedEmail },
    });

    // Store hashed token in DB (plain token never stored)
    await prisma.verificationToken.create({
      data: {
        identifier: trimmedEmail,
        token: tokenHash,
        expires,
      },
    });

    // Send email with plain token
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(trimmedEmail)}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: trimmedEmail,
      subject: "Réinitialisation de votre mot de passe — Dream Team Africa",
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1A1A1A;padding:30px 24px;text-align:center;">
      <h1 style="margin:0;color:#d4af37;font-size:22px;">Dream Team Africa</h1>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="margin:0 0 16px;color:#1A1A1A;font-size:20px;">Réinitialisation du mot de passe</h2>
      <p style="color:#555;line-height:1.6;margin:0 0 24px;">
        Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#A0522D;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p style="color:#999;font-size:13px;line-height:1.5;margin:24px 0 0;">
        Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
      </p>
    </div>
    <div style="background:#FAF8F5;padding:16px 24px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">© 2026 Dream Team Africa</p>
    </div>
  </div>
</body>
</html>`,
    });

    if (error) {
      console.error("Password reset email error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}
