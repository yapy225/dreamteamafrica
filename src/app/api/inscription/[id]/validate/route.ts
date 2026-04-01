import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse(
      `<html><body style="font-family:Arial;background:#0E0E0E;color:#F2EDE4;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <h1 style="color:#C23B22;">Accès refusé</h1>
          <p>Vous devez être connecté en tant qu'administrateur.</p>
        </div>
      </body></html>`,
      { status: 403, headers: { "Content-Type": "text/html" } }
    );
  }

  const { id } = await params;
  try {
    // 1. Update inscription status
    const inscription = await prisma.inscription.update({
      where: { id },
      data: { status: "VALIDATED" },
    });

    // 2. Auto-create DirectoryEntry from validated inscription
    const existing = await prisma.directoryEntry.findFirst({
      where: { email: inscription.email },
    });

    if (!existing) {
      await prisma.directoryEntry.create({
        data: {
          companyName: inscription.entreprise,
          contactName: inscription.directeur,
          category: inscription.categorie,
          city: inscription.ville,
          country: inscription.pays,
          phone: inscription.mobile,
          email: inscription.email,
          website: inscription.siteWeb,
          facebook: inscription.facebook,
          instagram: inscription.instagram,
          tiktok: inscription.tiktok,
          whatsapp: inscription.whatsapp,
          linkedin: inscription.linkedin,
          youtube: inscription.youtube,
          description: inscription.description,
          published: true,
        },
      });
    }

    return new NextResponse(
      `<html><body style="font-family:Arial;background:#0E0E0E;color:#F2EDE4;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">✓</div>
          <h1 style="color:#2BA84A;">Inscription validée</h1>
          <p style="color:rgba(242,237,228,0.6);">${inscription.entreprise} est maintenant visible dans l'annuaire.</p>
          <a href="https://dreamteamafrica.com/lofficiel-dafrique/annuaire" style="display:inline-block;margin-top:1.5rem;padding:.7rem 1.5rem;background:#C8A246;color:#0E0E0E;text-decoration:none;font-weight:bold;font-size:.85rem;">
            Voir l'annuaire
          </a>
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
