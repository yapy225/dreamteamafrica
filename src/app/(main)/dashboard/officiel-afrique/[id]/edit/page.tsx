import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import OfficielForm from "../../OfficielForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier le contenu" };

export default async function EditOfficielPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  // Accessible à tous les utilisateurs connectés

  const { id } = await params;
  const item = await prisma.officielContent.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Modifier le contenu
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <OfficielForm
          initialData={{
            id: item.id,
            title: item.title,
            type: item.type,
            content: item.content,
            excerpt: item.excerpt,
            coverImage: item.coverImage,
            category: item.category,
            published: item.published,
          }}
        />
      </div>
    </div>
  );
}
