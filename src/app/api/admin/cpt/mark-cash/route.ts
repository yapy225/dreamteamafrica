import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { uploadBuffer } from "@/lib/bunny";
import { signQr } from "@/lib/qr-sig";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { ticketId, amount } = await request.json();
  const parsed = Number(amount);
  if (!ticketId || !Number.isFinite(parsed) || parsed <= 0) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });

  const remaining = Number(ticket.price) - Number(ticket.totalPaid);
  if (remaining <= 0) return NextResponse.json({ error: "Déjà soldé." }, { status: 400 });

  const safeAmount = Math.min(parsed, remaining);

  await prisma.$transaction([
    prisma.ticketPayment.create({
      data: {
        ticketId,
        amount: safeAmount,
        type: "cash",
        label: `Paiement cash (admin ${session.user.email})`,
        stripeId: `cash-${Date.now()}`,
      },
    }),
    prisma.ticket.update({
      where: { id: ticketId },
      data: { totalPaid: { increment: safeAmount } },
    }),
  ]);

  // Generate QR if now fully paid
  const updated = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (updated && Number(updated.totalPaid) >= Number(updated.price) && !updated.qrCode) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
      const sig = signQr(ticketId);
      const qrUrl = `${baseUrl}/check/${ticketId}?sig=${sig}`;
      const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
      const { url: qrCdnUrl } = await uploadBuffer(Buffer.from(qrBuffer), `qrcodes/tickets/${ticketId}.png`);
      await prisma.ticket.update({ where: { id: ticketId }, data: { qrCode: qrCdnUrl } });
    } catch (err) {
      console.error("QR generation after cash mark failed:", err);
    }
  }

  return NextResponse.json({ ok: true, amountApplied: safeAmount });
}
