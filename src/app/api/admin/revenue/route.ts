import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRevenueData } from "@/lib/revenue";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const data = await getRevenueData();
  return NextResponse.json(data);
}
