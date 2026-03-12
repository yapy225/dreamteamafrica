import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/bunny";

/**
 * GET /api/exposants/profil?token=xxx
 * Returns the exhibitor profile data for the public form.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requis." }, { status: 400 });
  }

  const profile = await prisma.exhibitorProfile.findUnique({
    where: { token },
    include: {
      booking: {
        select: {
          companyName: true,
          contactName: true,
          email: true,
          phone: true,
          sector: true,
          pack: true,
          events: true,
          totalDays: true,
        },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    id: profile.id,
    token: profile.token,
    submittedAt: profile.submittedAt,
    // Pre-fill from booking if profile fields are empty
    companyName: profile.companyName || profile.booking.companyName,
    sector: profile.sector || profile.booking.sector,
    firstName: profile.firstName || profile.booking.contactName.split(" ")[0],
    lastName: profile.lastName || profile.booking.contactName.split(" ").slice(1).join(" "),
    phone: profile.phone || profile.booking.phone,
    email: profile.email || profile.booking.email,
    facebook: profile.facebook || "",
    instagram: profile.instagram || "",
    description: profile.description || "",
    logoUrl: profile.logoUrl,
    image1Url: profile.image1Url,
    image2Url: profile.image2Url,
    image3Url: profile.image3Url,
    videoUrl: profile.videoUrl,
    masterclass: profile.masterclass,
    daysPresent: profile.daysPresent,
    pack: profile.booking.pack,
    events: profile.booking.events,
  });
}

/**
 * POST /api/exposants/profil
 * Submit or update the exhibitor profile (public, token-based).
 * Accepts multipart form data with text fields and file uploads.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.json({ error: "Token requis." }, { status: 400 });
    }

    const profile = await prisma.exhibitorProfile.findUnique({
      where: { token },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
    }

    // Upload files if present
    const folder = `exposants/${profile.id}`;
    const fileFields = ["logo", "image1", "image2", "image3", "video"] as const;
    const uploadedUrls: Record<string, string | null> = {};

    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        const result = await uploadFile(file, folder);
        uploadedUrls[field] = result.url;
      }
    }

    // Update profile with text fields + uploaded URLs
    const updated = await prisma.exhibitorProfile.update({
      where: { token },
      data: {
        companyName: (formData.get("companyName") as string) || profile.companyName,
        sector: (formData.get("sector") as string) || profile.sector,
        firstName: (formData.get("firstName") as string) || profile.firstName,
        lastName: (formData.get("lastName") as string) || profile.lastName,
        phone: (formData.get("phone") as string) || profile.phone,
        email: (formData.get("email") as string) || profile.email,
        facebook: (formData.get("facebook") as string) || profile.facebook,
        instagram: (formData.get("instagram") as string) || profile.instagram,
        description: (formData.get("description") as string) || profile.description,
        masterclass: formData.get("masterclass") === "true",
        daysPresent: formData.getAll("daysPresent") as string[],
        ...(uploadedUrls.logo && { logoUrl: uploadedUrls.logo }),
        ...(uploadedUrls.image1 && { image1Url: uploadedUrls.image1 }),
        ...(uploadedUrls.image2 && { image2Url: uploadedUrls.image2 }),
        ...(uploadedUrls.image3 && { image3Url: uploadedUrls.image3 }),
        ...(uploadedUrls.video && { videoUrl: uploadedUrls.video }),
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error("Exhibitor profile submit error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
