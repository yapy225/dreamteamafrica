import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone || typeof phone !== "string" || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ ok: false, error: "Numéro invalide" }, { status: 400 });
  }

  // Normalize: remove spaces, dashes, dots. Keep digits and leading +
  const digits = phone.replace(/[\s.\-()]/g, "");
  // Build variations to match: with/without leading 0, +33, 33
  const raw = digits.replace(/^\+/, "");
  const variations = [digits, raw];
  if (raw.startsWith("33")) variations.push("0" + raw.slice(2), "+" + raw);
  if (raw.startsWith("0")) variations.push("33" + raw.slice(1), "+33" + raw.slice(1));

  const ticket = await prisma.ticket.findFirst({
    where: {
      phone: { in: variations },
      totalPaid: { gt: 0 },
    },
    select: { id: true, firstName: true },
  });

  if (ticket) {
    return NextResponse.json({ ok: true, firstName: ticket.firstName });
  }

  return NextResponse.json({ ok: false });
}
