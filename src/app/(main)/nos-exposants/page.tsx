import { prisma } from "@/lib/db";
import { Store } from "lucide-react";
import Image from "next/image";
import ProtectContent from "./ProtectContent";
import UnlockContacts from "./UnlockContacts";
import ExposantGrid from "./ExposantGrid";

export const metadata = {
  title: "Nos Exposants — Foire d'Afrique Paris 2026",
  description:
    "Découvrez les artisans, créateurs et entrepreneurs qui exposent à la Foire d'Afrique Paris 2026.",
};

export const dynamic = "force-dynamic";

export default async function NosExposantsPage() {
  const bookings = await prisma.exhibitorBooking.findMany({
    where: { status: { in: ["CONFIRMED", "PARTIAL"] } },
    include: { profile: true },
    orderBy: { createdAt: "asc" },
  });

  const exposants = bookings
    .filter((b) => b.companyName !== "Boutique Test Afrik")
    .map((b) => ({
      id: b.id,
      name: b.profile?.companyName || b.companyName,
      sector: b.profile?.sector || b.sector || "",
      description: b.profile?.description || null,
      logo: b.profile?.logoUrl || null,
      contact: b.profile?.firstName && b.profile?.lastName
        ? `${b.profile.firstName} ${b.profile.lastName}`
        : b.contactName,
      phone: b.profile?.phone || b.phone || "",
      email: b.profile?.email || b.email || "",
    }));

  return (
    <ProtectContent>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-dta-dark">
            Nos Exposants
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
            Plus de {exposants.length} artisans, créateurs et entrepreneurs
            africains vous attendent à la{" "}
            <strong>Foire d&apos;Afrique Paris 2026</strong> — 1er &amp; 2 mai,
            Espace MAS, Paris 13e.
          </p>
        </div>

        <ExposantGrid exposants={exposants} />

        <div className="mt-16 rounded-[var(--radius-card)] bg-dta-accent/5 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">
            Vous aussi, exposez à la Foire d&apos;Afrique !
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-dta-char/70">
            Rejoignez nos exposants et faites découvrir votre marque à des
            milliers de visiteurs passionnés de culture africaine.
          </p>
          <a
            href="/resa-exposants/foire-dafrique-paris"
            className="mt-6 inline-block rounded-[var(--radius-button)] bg-dta-accent px-8 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Réserver mon stand — 50 € d&apos;acompte
          </a>
        </div>
      </div>
    </ProtectContent>
  );
}
