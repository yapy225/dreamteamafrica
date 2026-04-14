import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/bunny";
import { sendExhibitorProfileNotification } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

  // Check token expiration
  if (profile.tokenExpiresAt && new Date() > profile.tokenExpiresAt) {
    return NextResponse.json({ error: "Ce lien a expiré. Contactez-nous pour en obtenir un nouveau." }, { status: 410 });
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
    twitter: profile.twitter || "",
    linkedin: profile.linkedin || "",
    tiktok: profile.tiktok || "",
    website: profile.website || "",
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
    const ip = getClientIp(request);
    const rl = rateLimit(`profil-exposant:${ip}`, { limit: 10, windowSec: 10 * 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de soumissions. Réessayez plus tard." }, { status: 429 });
    }

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

    // Enforce token expiration on POST (GET already checks it)
    if (profile.tokenExpiresAt && new Date() > profile.tokenExpiresAt) {
      return NextResponse.json({ error: "Ce lien a expiré. Contactez-nous pour en obtenir un nouveau." }, { status: 410 });
    }

    // Upload files if present
    const folder = `exposants/${profile.id}`;
    const fileFields = ["logo", "image1", "image2", "image3", "video"] as const;
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
    const uploadedUrls: Record<string, string | null> = {};

    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        const isVideo = field === "video";
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        const expectedType = isVideo ? "video/" : "image/";

        if (file.size > maxSize) {
          return NextResponse.json(
            { error: `Le fichier "${field}" dépasse la taille maximale autorisée (${isVideo ? "100 Mo" : "10 Mo"}).` },
            { status: 400 },
          );
        }

        if (!file.type.startsWith(expectedType)) {
          return NextResponse.json(
            { error: `Le fichier "${field}" doit être de type ${isVideo ? "vidéo" : "image"}.` },
            { status: 400 },
          );
        }

        const result = await uploadFile(file, folder);
        uploadedUrls[field] = result.url;
      }
    }

    // Check if this is a draft save
    const isDraft = formData.get("draft") === "true";

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
        twitter: (formData.get("twitter") as string) || profile.twitter,
        linkedin: (formData.get("linkedin") as string) || profile.linkedin,
        tiktok: (formData.get("tiktok") as string) || profile.tiktok,
        website: (formData.get("website") as string) || profile.website,
        description: (formData.get("description") as string) || profile.description,
        masterclass: formData.get("masterclass") === "true",
        daysPresent: formData.getAll("daysPresent") as string[],
        ...(uploadedUrls.logo && { logoUrl: uploadedUrls.logo }),
        ...(uploadedUrls.image1 && { image1Url: uploadedUrls.image1 }),
        ...(uploadedUrls.image2 && { image2Url: uploadedUrls.image2 }),
        ...(uploadedUrls.image3 && { image3Url: uploadedUrls.image3 }),
        ...(uploadedUrls.video && { videoUrl: uploadedUrls.video }),
        ...(!isDraft && { submittedAt: new Date() }),
      },
    });

    // If draft, return early without notifications or directory entry
    if (isDraft) {
      return NextResponse.json({ success: true, id: updated.id, draft: true });
    }

    // Create or update DirectoryEntry in L'Officiel d'Afrique
    try {
      const existingEntry = await prisma.directoryEntry.findFirst({
        where: {
          OR: [
            { email: updated.email || "" },
            { companyName: updated.companyName || "" },
          ],
        },
      });

      const entryData = {
        companyName: updated.companyName || null,
        contactName: `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
        category: "Exposant",
        city: "Paris",
        country: "France",
        phone: updated.phone || null,
        email: updated.email || null,
        facebook: updated.facebook || null,
        instagram: updated.instagram || null,
        tiktok: updated.tiktok || null,
        linkedin: updated.linkedin || null,
        website: updated.website || null,
        description: updated.description || updated.companyName || "",
        event: "Foire d'Afrique Paris 2026",
        published: true,
      };

      if (existingEntry) {
        await prisma.directoryEntry.update({
          where: { id: existingEntry.id },
          data: entryData,
        });
      } else {
        await prisma.directoryEntry.create({ data: entryData });
      }
    } catch (dirErr) {
      console.error("DirectoryEntry creation failed (non-blocking):", dirErr);
    }

    // Newsletter subscription
    const newsletterOpt = formData.get("newsletter");
    if (newsletterOpt === "true" && updated.email) {
      try {
        await prisma.newsletterSubscriber.upsert({
          where: { email: updated.email },
          create: { email: updated.email },
          update: { isActive: true },
        });
      } catch (nlErr) {
        console.error("Newsletter subscribe failed (non-blocking):", nlErr);
      }
    }

    // Notify admin
    try {
      await sendExhibitorProfileNotification({
        companyName: updated.companyName || "Exposant",
        contactName: `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
        profileId: updated.id,
      });
    } catch (notifErr) {
      console.error("Admin notification failed (non-blocking):", notifErr);
    }

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error("Exhibitor profile submit error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
