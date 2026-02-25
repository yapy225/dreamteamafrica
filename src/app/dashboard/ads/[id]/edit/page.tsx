import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CampaignForm from "../../CampaignForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier la campagne — DTA Ads" };

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;
  const campaign = await prisma.adCampaign.findUnique({ where: { id } });

  if (!campaign) notFound();
  if (campaign.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/ads");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Modifier la campagne
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <CampaignForm
          initialData={{
            id: campaign.id,
            title: campaign.title,
            format: campaign.format,
            plan: campaign.plan,
            content: campaign.content,
            imageUrl: campaign.imageUrl,
            videoUrl: campaign.videoUrl,
            targetUrl: campaign.targetUrl,
            active: campaign.active,
          }}
        />
      </div>
    </div>
  );
}
