import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateInvoicePDF } from "@/lib/generate-invoice";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id },
    select: { userId: true, companyName: true, invoiceNumber: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  // Allow owner or admin
  const isAdmin = session.user.role === "ADMIN";
  if (booking.userId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    const pdfBuffer = await generateInvoicePDF(id);

    const fileName = booking.invoiceNumber
      ? `Facture-${booking.invoiceNumber}-${booking.companyName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
      : `Facture-${booking.companyName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("Invoice generation error:", err);
    return NextResponse.json({ error: "Erreur de génération." }, { status: 500 });
  }
}
