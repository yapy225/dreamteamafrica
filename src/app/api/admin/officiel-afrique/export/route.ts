import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const inscriptions = await prisma.inscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Entreprise",
      "Catégorie",
      "Directeur",
      "Adresse",
      "Ville",
      "Code Postal",
      "Pays",
      "Mobile",
      "Téléphone",
      "Email",
      "Site Web",
      "Facebook",
      "Instagram",
      "TikTok",
      "WhatsApp",
      "YouTube",
      "LinkedIn",
      "Description",
      "Mots-clés",
      "Newsletter",
      "Statut",
      "Date inscription",
    ];

    const rows = inscriptions.map((i) => [
      escapeCSV(i.id),
      escapeCSV(i.entreprise),
      escapeCSV(i.categorie),
      escapeCSV(i.directeur),
      escapeCSV(i.adresse),
      escapeCSV(i.ville),
      escapeCSV(i.codePostal),
      escapeCSV(i.pays),
      escapeCSV(i.mobile),
      escapeCSV(i.telephone),
      escapeCSV(i.email),
      escapeCSV(i.siteWeb),
      escapeCSV(i.facebook),
      escapeCSV(i.instagram),
      escapeCSV(i.tiktok),
      escapeCSV(i.whatsapp),
      escapeCSV(i.youtube),
      escapeCSV(i.linkedin),
      escapeCSV(i.description),
      escapeCSV(i.motsCles),
      i.newsletter ? "Oui" : "Non",
      escapeCSV(i.status),
      escapeCSV(i.createdAt.toISOString().split("T")[0]),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const today = new Date().toISOString().split("T")[0];
    const filename = `officiel-afrique-export-${today}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
