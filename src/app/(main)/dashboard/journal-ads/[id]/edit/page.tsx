import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import JournalAdForm from "../../JournalAdForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier la publicité" };

export default async function EditJournalAdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const ad = await prisma.journalAd.findUnique({ where: { id } });

  if (!ad) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Modifier la publicité
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <JournalAdForm
          initialData={{
            id: ad.id,
            title: ad.title,
            description: ad.description,
            placement: ad.placement,
            ctaText: ad.ctaText,
            ctaUrl: ad.ctaUrl,
            imageUrl: ad.imageUrl,
            gradientClass: ad.gradientClass,
            iconSvg: ad.iconSvg,
            price: ad.price,
            advertiserName: ad.advertiserName,
            campaignWeeks: ad.campaignWeeks,
            active: ad.active,
          }}
        />
      </div>
    </div>
  );
}
