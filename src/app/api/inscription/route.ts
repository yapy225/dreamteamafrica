import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = [
      "entreprise",
      "categorie",
      "directeur",
      "ville",
      "pays",
      "mobile",
      "email",
      "description",
    ];

    for (const field of required) {
      if (
        !body[field] ||
        (typeof body[field] === "string" && !body[field].trim())
      ) {
        return NextResponse.json(
          { error: `Le champ "${field}" est requis.` },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const inscription = await prisma.inscription.create({
      data: {
        entreprise: body.entreprise.trim(),
        categorie: body.categorie.trim(),
        directeur: body.directeur.trim(),
        adresse: body.adresse?.trim() || null,
        ville: body.ville.trim(),
        codePostal: body.codePostal?.trim() || null,
        pays: body.pays.trim(),
        mobile: body.mobile.trim(),
        telephone: body.telephone?.trim() || null,
        email: body.email.trim().toLowerCase(),
        siteWeb: body.siteWeb?.trim() || null,
        facebook: body.facebook?.trim() || null,
        instagram: body.instagram?.trim() || null,
        tiktok: body.tiktok?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        youtube: body.youtube?.trim() || null,
        linkedin: body.linkedin?.trim() || null,
        description: body.description.trim(),
        motsCles: body.motsCles?.trim() || null,
        newsletter: body.newsletter ?? false,
      },
    });

    return NextResponse.json(
      { id: inscription.id, message: "Inscription enregistrée avec succès." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inscription error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
