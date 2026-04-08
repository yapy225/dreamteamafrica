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
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    // File size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)." }, { status: 400 });
    }

    // Allowed MIME types
    const allowedTypes = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/quicktime",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé." }, { status: 400 });
    }

    // Sanitize folder path (prevent directory traversal)
    const safeFolder = folder
      .replace(/\.\./g, "")
      .replace(/^\/+/, "")
      .replace(/\/{2,}/g, "/")
      .replace(/[^a-zA-Z0-9\-_\/]/g, "")
      .split("/")
      .filter(s => s && s !== ".")
      .join("/");

    const result = await uploadFile(file, safeFolder);

    return NextResponse.json({ url: result.url, path: result.path }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}
