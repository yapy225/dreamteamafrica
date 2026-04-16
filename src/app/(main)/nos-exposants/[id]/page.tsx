import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Store, ArrowLeft, Globe, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id },
    include: { profile: true },
  });
  if (!booking) return { title: "Exposant introuvable" };
  const name = booking.profile?.companyName || booking.companyName;
  return {
    title: `${name} — Foire d'Afrique Paris 2026`,
    description: booking.profile?.description || `Découvrez ${name} à la Foire d'Afrique Paris 2026.`,
  };
}

export default async function ExposantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!booking || !["CONFIRMED", "PARTIAL"].includes(booking.status)) {
    notFound();
  }

  const p = booking.profile;
  const name = p?.companyName || booking.companyName;
  const sector = p?.sector || booking.sector || "";
  const description = p?.description || null;
  const logo = p?.logoUrl || null;
  const images = [p?.image1Url, p?.image2Url, p?.image3Url].filter(Boolean) as string[];
  const facebook = p?.facebook || null;
  const instagram = p?.instagram || null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/nos-exposants"
        className="mb-8 inline-flex items-center gap-2 text-sm text-dta-accent hover:underline"
      >
        <ArrowLeft size={16} /> Retour aux exposants
      </Link>

      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-dta-sand/30">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <Store size={40} className="text-dta-accent" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-serif text-3xl font-bold text-dta-dark">
              {name}
            </h1>
            {sector && (
              <p className="mt-1 text-lg font-medium text-dta-accent">
                {sector}
              </p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
              {instagram && (
                <a
                  href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-100"
                >
                  <Instagram size={14} /> Instagram
                </a>
              )}
              {facebook && (
                <a
                  href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                  <Globe size={14} /> Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {description && (
          <div className="mt-8 border-t border-dta-sand/30 pt-6">
            <h2 className="font-serif text-xl font-bold text-dta-dark">
              À propos
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-dta-char/80">
              {description}
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-8 border-t border-dta-sand/30 pt-6">
            <h2 className="font-serif text-xl font-bold text-dta-dark">
              Galerie
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <Image
                    src={img}
                    alt={`${name} — photo ${i + 1}`}
                    width={400}
                    height={300}
                    className="h-56 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-dta-char/60">
          Retrouvez {name} à la Foire d&apos;Afrique Paris — 1er &amp; 2 mai 2026, Espace MAS, Paris 13e
        </p>
        <a
          href="/foire-paris-2026"
          className="mt-4 inline-block rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Réserver mon billet
        </a>
      </div>
    </div>
  );
}
