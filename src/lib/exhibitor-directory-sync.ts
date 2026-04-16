import { prisma } from "@/lib/db";

/**
 * Synchronise un exposant (ExhibitorBooking + ExhibitorProfile) vers DirectoryEntry
 * pour son affichage dans l'annuaire L'Officiel d'Afrique.
 *
 * - Créé une nouvelle entrée si aucune ne correspond (par email ou companyName)
 * - Met à jour l'entrée existante sinon
 *
 * Non bloquant : les erreurs sont loggées mais ne remontent pas.
 */
export async function syncExhibitorToDirectory(bookingId: string): Promise<{ entryId?: string; created: boolean } | null> {
  try {
    const booking = await prisma.exhibitorBooking.findUnique({
      where: { id: bookingId },
      include: { profile: true },
    });

    if (!booking) {
      console.warn(`[directory-sync] Booking ${bookingId} not found`);
      return null;
    }

    const p = booking.profile;
    const companyName = p?.companyName || booking.companyName;
    const email = p?.email || booking.email;
    const phone = p?.phone || booking.phone || null;
    const firstName = p?.firstName || booking.contactName.split(" ")[0] || "";
    const lastName = p?.lastName || booking.contactName.split(" ").slice(1).join(" ") || "";
    const contactName = `${firstName} ${lastName}`.trim() || booking.contactName;
    const sector = p?.sector || booking.sector || "";
    const description = p?.description || `${companyName} — ${sector || "Exposant Foire d'Afrique Paris 2026"}`;

    const entryData = {
      companyName: companyName || null,
      contactName,
      category: "Exposant",
      city: "Paris",
      country: "France",
      phone,
      email: email || null,
      facebook: p?.facebook || null,
      instagram: p?.instagram || null,
      tiktok: p?.tiktok || null,
      linkedin: p?.linkedin || null,
      website: p?.website || null,
      logoUrl: p?.logoUrl || null,
      description,
      event: "Foire d'Afrique Paris 2026",
      published: true,
    };

    // Find existing entry by email or companyName
    const existing = email
      ? await prisma.directoryEntry.findFirst({
          where: {
            OR: [
              ...(email ? [{ email }] : []),
              ...(companyName ? [{ companyName }] : []),
            ],
          },
        })
      : null;

    if (existing) {
      await prisma.directoryEntry.update({
        where: { id: existing.id },
        data: entryData,
      });
      return { entryId: existing.id, created: false };
    }

    const created = await prisma.directoryEntry.create({ data: entryData });
    return { entryId: created.id, created: true };
  } catch (err) {
    console.error(`[directory-sync] Failed for booking ${bookingId}:`, err);
    return null;
  }
}
