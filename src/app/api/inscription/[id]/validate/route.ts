import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.inscription.update({
      where: { id },
      data: { status: "VALIDATED" },
    });

    return new NextResponse(
      `<html><body style="font-family:Arial;background:#0E0E0E;color:#F2EDE4;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">✓</div>
          <h1 style="color:#2BA84A;">Inscription validée</h1>
          <p style="color:rgba(242,237,228,0.6);">L'entreprise est maintenant visible dans l'annuaire.</p>
        </div>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch {
    return new NextResponse(
      `<html><body style="font-family:Arial;background:#0E0E0E;color:#F2EDE4;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <h1 style="color:#C23B22;">Erreur</h1>
          <p style="color:rgba(242,237,228,0.6);">Inscription introuvable ou déjà traitée.</p>
        </div>
      </body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }
}
