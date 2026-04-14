import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILES = 10;
const MAX_FILE_SIZE_IMAGE = 10 * 1024 * 1024; // 10 MB
const MAX_FILE_SIZE_VIDEO = 100 * 1024 * 1024; // 100 MB
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/quicktime",
  "application/pdf",
];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const rl = rateLimit(`upload-multi:${session.user.id}`, { limit: 15, windowSec: 10 * 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop d'uploads. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "";

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} fichiers par envoi.` }, { status: 400 });
    }

    // Validate each file before uploading any
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Type non autorisé pour "${file.name}".` }, { status: 400 });
      }
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? MAX_FILE_SIZE_VIDEO : MAX_FILE_SIZE_IMAGE;
      if (file.size > maxSize) {
        return NextResponse.json({ error: `Fichier "${file.name}" trop volumineux (max ${maxSize / 1024 / 1024} Mo).` }, { status: 400 });
      }
    }

    // Sanitize folder path
    const safeFolder = folder
      .replace(/\.\./g, "")
      .replace(/^\/+/, "")
      .replace(/\/{2,}/g, "/")
      .replace(/[^a-zA-Z0-9\-_\/]/g, "")
      .split("/")
      .filter(s => s && s !== ".")
      .join("/");

    const results = await Promise.all(
      files.map((file) => uploadFile(file, safeFolder)),
    );

    return NextResponse.json({ files: results }, { status: 201 });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}
