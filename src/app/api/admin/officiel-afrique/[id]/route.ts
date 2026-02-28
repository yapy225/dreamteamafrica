import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.inscription.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
    }

    const body = await request.json();

    const {
      entreprise,
      categorie,
      directeur,
      adresse,
      ville,
      codePostal,
      pays,
      mobile,
      telephone,
      email,
      siteWeb,
      facebook,
      instagram,
      tiktok,
      whatsapp,
      youtube,
      linkedin,
      description,
      motsCles,
      newsletter,
      status,
    } = body;

    if (status) {
      const validStatuses = ["PENDING", "VALIDATED", "REJECTED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
      }
    }

    const updated = await prisma.inscription.update({
      where: { id },
      data: {
        ...(entreprise !== undefined && { entreprise }),
        ...(categorie !== undefined && { categorie }),
        ...(directeur !== undefined && { directeur }),
        ...(adresse !== undefined && { adresse: adresse || null }),
        ...(ville !== undefined && { ville }),
        ...(codePostal !== undefined && { codePostal: codePostal || null }),
        ...(pays !== undefined && { pays }),
        ...(mobile !== undefined && { mobile }),
        ...(telephone !== undefined && { telephone: telephone || null }),
        ...(email !== undefined && { email }),
        ...(siteWeb !== undefined && { siteWeb: siteWeb || null }),
        ...(facebook !== undefined && { facebook: facebook || null }),
        ...(instagram !== undefined && { instagram: instagram || null }),
        ...(tiktok !== undefined && { tiktok: tiktok || null }),
        ...(whatsapp !== undefined && { whatsapp: whatsapp || null }),
        ...(youtube !== undefined && { youtube: youtube || null }),
        ...(linkedin !== undefined && { linkedin: linkedin || null }),
        ...(description !== undefined && { description }),
        ...(motsCles !== undefined && { motsCles: motsCles || null }),
        ...(newsletter !== undefined && { newsletter }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update inscription error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.inscription.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
    }

    await prisma.inscription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete inscription error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
