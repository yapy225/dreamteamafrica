import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const booking = await prisma.exhibitorBooking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    const body = await request.json();

    const updated = await prisma.exhibitorBooking.update({
      where: { id },
      data: {
        ...(body.companyName && { companyName: body.companyName }),
        ...(body.contactName && { contactName: body.contactName }),
        ...(body.email && { email: body.email }),
        ...(body.phone && { phone: body.phone }),
        ...(body.sector && { sector: body.sector }),
        ...(body.pack && { pack: body.pack as "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION" | "SAISON" }),
        ...(body.totalDays !== undefined && { totalDays: Number(body.totalDays) }),
        ...(body.stands !== undefined && { stands: Number(body.stands) }),
        ...(body.totalPrice !== undefined && { totalPrice: parseFloat(body.totalPrice) }),
        ...(body.installments !== undefined && { installments: Number(body.installments) }),
        ...(body.installmentAmount !== undefined && { installmentAmount: parseFloat(body.installmentAmount) }),
        ...(body.paidInstallments !== undefined && { paidInstallments: Number(body.paidInstallments) }),
        ...(body.status && { status: body.status as "PENDING" | "PARTIAL" | "CONFIRMED" | "CANCELLED" }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
