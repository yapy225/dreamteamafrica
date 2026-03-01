import { NextResponse } from "next/server";
import { listFiles, deleteFile } from "@/lib/bunny";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "";

    const files = await listFiles(folder);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Storage list error:", error);
    return NextResponse.json({ error: "Erreur lors de la lecture." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { path } = await request.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
    }

    await deleteFile(path);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Storage delete error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
