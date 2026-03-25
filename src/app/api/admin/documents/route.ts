import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile, listFiles, deleteFile, getCdnUrl } from "@/lib/bunny";

export const dynamic = "force-dynamic";

const FOLDER = "documents";

// GET — list archived documents
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const raw = await listFiles(FOLDER);
    const files = raw
      .filter((f) => !f.IsDirectory && f.ObjectName.endsWith(".pdf"))
      .map((f) => ({
        name: f.ObjectName,
        url: getCdnUrl(`${FOLDER}/${f.ObjectName}`),
        date: new Date(f.LastChanged).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        size:
          f.Length > 1024 * 1024
            ? `${(f.Length / (1024 * 1024)).toFixed(1)} Mo`
            : `${Math.round(f.Length / 1024)} Ko`,
      }))
      .sort((a, b) => b.name.localeCompare(a.name));

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

// POST — upload a PDF
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.name.endsWith(".pdf")) {
    return NextResponse.json({ error: "Fichier PDF requis." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)." }, { status: 400 });
  }

  try {
    const result = await uploadFile(file, FOLDER);
    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}

// DELETE — remove a document
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  }

  try {
    await deleteFile(`${FOLDER}/${name}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document delete error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
