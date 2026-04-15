import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * RFC 8058 one-click unsubscribe endpoint.
 * Called by email clients (Gmail, Apple Mail) when the user clicks the
 * native "Unsubscribe" action bound to the List-Unsubscribe-Post header.
 */
export async function POST(request: NextRequest) {
  return handleUnsubscribe(request);
}

export async function GET(request: NextRequest) {
  return handleUnsubscribe(request);
}

async function handleUnsubscribe(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let email = searchParams.get("email");

  // Some clients POST the List-Unsubscribe=One-Click in the body
  if (!email && request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      email = params.get("email");
    }
  }

  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { email: normalized },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true, email: normalized });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
