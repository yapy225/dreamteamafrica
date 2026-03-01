import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/bunny";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "";

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const results = await Promise.all(
      files.map((file) => uploadFile(file, folder)),
    );

    return NextResponse.json({ files: results }, { status: 201 });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}
