import Image from "next/image";
import { prisma } from "@/lib/db";
import { Instagram, Facebook } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Nos Exposants — Foire d'Afrique Paris 2026",
  description:
    "Découvrez les exposants de la Foire d'Afrique Paris 2026 : artisans, entrepreneurs, restaurateurs et créateurs africains.",
};

export default async function ExposantsListingPage() {
  const profiles = await prisma.exhibitorProfile.findMany({
    where: {
      submittedAt: { not: null },
    },
    include: {
      booking: {
        select: { companyName: true, sector: true, events: true },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Also include profiles with at least a company name even if not formally submitted
  const profilesWithData = profiles.length > 0
    ? profiles
    : await prisma.exhibitorProfile.findMany({
        where: {
          OR: [
            { companyName: { not: null } },
            { description: { not: null } },
          ],
        },
        include: {
          booking: {
            select: { companyName: true, sector: true, events: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[3px] text-dta-accent">
          Foire d&apos;Afrique Paris 2026
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-dta-dark md:text-5xl">
          Nos Exposants
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          D&eacute;couvrez les artisans, entrepreneurs et cr&eacute;ateurs qui
          feront vivre la Foire d&apos;Afrique les 1er &amp; 2 mai 2026.
        </p>
      </div>

      {profilesWithData.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <p className="text-lg text-dta-taupe">
            Les fiches exposants seront bient&ocirc;t disponibles.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {profilesWithData.map((profile) => {
            const name = profile.companyName || profile.booking.companyName;
            const sector = profile.sector || profile.booking.sector || "";
            const heroImage =
              profile.image1Url || profile.image2Url || profile.image3Url;

            return (
              <div
                key={profile.id}
                className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-dta-sand/30">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : profile.logoUrl ? (
                    <div className="flex h-full items-center justify-center bg-dta-bg p-8">
                      <Image
                        src={profile.logoUrl}
                        alt={name}
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-dta-accent/10 to-dta-dark/10">
                      <span className="font-serif text-4xl font-bold text-dta-accent/30">
                        {name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Sector badge */}
                  {sector && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-dta-dark backdrop-blur-sm">
                      {sector}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-serif text-lg font-bold text-dta-dark">
                      {name}
                    </h2>
                    {profile.logoUrl && heroImage && (
                      <Image
                        src={profile.logoUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full object-contain"
                      />
                    )}
                  </div>

                  {profile.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-dta-char/70">
                      {profile.description}
                    </p>
                  )}

                  {/* Social links */}
                  {(profile.facebook || profile.instagram) && (
                    <div className="mt-3 flex gap-3">
                      {profile.facebook && (
                        <a
                          href={
                            profile.facebook.startsWith("http")
                              ? profile.facebook
                              : `https://facebook.com/${profile.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dta-taupe transition-colors hover:text-[#1877F2]"
                        >
                          <Facebook size={18} />
                        </a>
                      )}
                      {profile.instagram && (
                        <a
                          href={
                            profile.instagram.startsWith("http")
                              ? profile.instagram
                              : `https://instagram.com/${profile.instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dta-taupe transition-colors hover:text-[#E4405F]"
                        >
                          <Instagram size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
