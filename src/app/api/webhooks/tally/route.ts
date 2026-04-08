import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/bunny";

/**
 * POST /api/webhooks/tally
 * Webhook receiver for Tally form submissions.
 * Downloads uploaded files and stores them on Bunny CDN.
 * Updates the exhibitor profile in the database.
 */
const TALLY_SIGNING_SECRET = process.env.TALLY_SIGNING_SECRET;

export async function POST(request: Request) {
  try {
    // Verify webhook authenticity
    if (TALLY_SIGNING_SECRET) {
      const signature = request.headers.get("tally-signature");
      if (!signature || signature !== TALLY_SIGNING_SECRET) {
        console.error("[Tally Webhook] Invalid signature");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await request.json();

    console.log("[Tally Webhook] Received submission:", payload.eventId);

    // Tally webhook format: payload.data.fields is an array of { key, label, value, ... }
    const fields = payload.data?.fields || [];

    // Helper to get field value by label (case-insensitive partial match)
    function getField(label: string): string {
      const field = fields.find(
        (f: { label: string }) =>
          f.label && f.label.toLowerCase().includes(label.toLowerCase()),
      );
      if (!field) return "";
      // Text fields: value is a string
      if (typeof field.value === "string") return field.value.trim();
      // Option fields (like checkboxes): value might be an array or object
      if (Array.isArray(field.value)) return field.value.join(", ");
      if (field.value?.url) return field.value.url; // File uploads
      return String(field.value || "");
    }

    // Helper to get file URL from Tally
    function getFileUrl(label: string): string | null {
      const field = fields.find(
        (f: { label: string }) =>
          f.label && f.label.toLowerCase().includes(label.toLowerCase()),
      );
      if (!field) return null;
      // Tally file uploads: value is an array of { id, name, url, mimeType, size }
      if (Array.isArray(field.value) && field.value.length > 0) {
        return field.value[0].url || null;
      }
      if (field.value?.url) return field.value.url;
      return null;
    }

    // Extract fields
    const companyName = getField("société") || getField("societe");
    const sector = getField("secteur");
    const firstName = getField("first name") || getField("prénom");
    const lastName = getField("last name") || getField("nom");
    const phone = getField("téléphone") || getField("telephone");
    const facebook = getField("facebook");
    const instagram = getField("instagram");
    const email = getField("e-mail") || getField("email");
    const description = getField("description");
    const masterclass = getField("master class")
      .toLowerCase()
      .includes("oui");

    // File URLs from Tally
    const logoUrl = getFileUrl("logo");
    const image1Url = getFileUrl("image un") || getFileUrl("image 1");
    const image2Url = getFileUrl("image deux") || getFileUrl("image 2");
    const image3Url = getFileUrl("image trois") || getFileUrl("image 3");
    const videoUrl = getFileUrl("vidéo") || getFileUrl("video");

    console.log(
      `[Tally Webhook] ${companyName} | ${email} | ${firstName} ${lastName}`,
    );

    if (!email) {
      console.log("[Tally Webhook] No email found, skipping");
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Find matching exhibitor profile
    let profile = await prisma.exhibitorProfile.findFirst({
      where: {
        OR: [
          { email },
          { booking: { email } },
          ...(companyName
            ? [{ booking: { companyName: { contains: companyName, mode: "insensitive" as const } } }]
            : []),
        ],
      },
      include: { booking: true },
    });

    // If no profile found, try to find by booking
    if (!profile) {
      const booking = await prisma.exhibitorBooking.findFirst({
        where: {
          OR: [
            { email },
            ...(companyName
              ? [{ companyName: { contains: companyName, mode: "insensitive" as const } }]
              : []),
          ],
        },
      });

      if (booking) {
        profile = await prisma.exhibitorProfile.findFirst({
          where: { bookingId: booking.id },
          include: { booking: true },
        });
      }
    }

    if (!profile) {
      console.log(
        `[Tally Webhook] No matching profile for ${email} / ${companyName}`,
      );
      return NextResponse.json({ ok: true, noMatch: true });
    }

    // Download and upload files to Bunny CDN
    const folder = `exposants/${profile.id}`;
    const uploadedUrls: Record<string, string | null> = {};

    async function downloadAndUpload(
      url: string | null,
      fieldName: string,
    ): Promise<string | null> {
      if (!url) return null;
      try {
        // Validate URL: only allow HTTPS from trusted hosts
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") return null;
        const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254"];
        if (blockedHosts.some(h => parsed.hostname.includes(h)) || parsed.hostname.startsWith("10.") || parsed.hostname.startsWith("192.168.")) return null;

        const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
        if (!response.ok) return null;

        // Limit download size to 50MB
        const contentLength = parseInt(response.headers.get("content-length") || "0");
        if (contentLength > 50 * 1024 * 1024) return null;

        const buffer = Buffer.from(await response.arrayBuffer());
        const contentType =
          response.headers.get("content-type") || "image/jpeg";
        const ext = contentType.includes("png")
          ? "png"
          : contentType.includes("video")
            ? "mp4"
            : "jpg";
        const fileName = `${Date.now()}-${fieldName}.${ext}`;

        // Create a File-like object for uploadFile
        const file = new File([buffer], fileName, { type: contentType });
        const result = await uploadFile(file, folder);
        console.log(`[Tally Webhook] Uploaded ${fieldName}: ${result.url}`);
        return result.url;
      } catch (err) {
        console.error(`[Tally Webhook] Upload failed for ${fieldName}:`, err);
        return null;
      }
    }

    // Upload files in parallel
    const [uploadedLogo, uploadedImg1, uploadedImg2, uploadedImg3, uploadedVideo] =
      await Promise.all([
        downloadAndUpload(logoUrl, "logo"),
        downloadAndUpload(image1Url, "image1"),
        downloadAndUpload(image2Url, "image2"),
        downloadAndUpload(image3Url, "image3"),
        downloadAndUpload(videoUrl, "video"),
      ]);

    // Update profile
    await prisma.exhibitorProfile.update({
      where: { id: profile.id },
      data: {
        companyName: companyName || profile.companyName,
        sector: sector || profile.sector,
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
        phone: phone || profile.phone,
        email: email || profile.email,
        facebook: facebook || profile.facebook,
        instagram: instagram || profile.instagram,
        description: description || profile.description,
        masterclass,
        ...(uploadedLogo && { logoUrl: uploadedLogo }),
        ...(uploadedImg1 && { image1Url: uploadedImg1 }),
        ...(uploadedImg2 && { image2Url: uploadedImg2 }),
        ...(uploadedImg3 && { image3Url: uploadedImg3 }),
        ...(uploadedVideo && { videoUrl: uploadedVideo }),
        submittedAt: new Date(),
      },
    });

    console.log(
      `[Tally Webhook] Profile updated for ${companyName} (${email})`,
    );

    // Also create/update directory entry
    try {
      const contactName = `${firstName} ${lastName}`.trim();
      const existingEntry = await prisma.directoryEntry.findFirst({
        where: { OR: [{ email }, ...(companyName ? [{ companyName }] : [])] },
      });

      const entryData = {
        companyName: companyName || null,
        contactName,
        category: "Exposant",
        city: "Paris",
        country: "France",
        phone: phone || null,
        email,
        facebook: facebook || null,
        instagram: instagram || null,
        description: description || companyName || "",
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
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      ok: true,
      profileId: profile.id,
      company: companyName,
      filesUploaded: {
        logo: !!uploadedLogo,
        image1: !!uploadedImg1,
        image2: !!uploadedImg2,
        image3: !!uploadedImg3,
        video: !!uploadedVideo,
      },
    });
  } catch (error) {
    console.error("[Tally Webhook] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
