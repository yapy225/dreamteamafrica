import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ArticleForm from "../../ArticleForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier l'article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) notFound();
  if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">Modifier l&apos;article</h1>
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <ArticleForm
          initialData={{
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            coverImage: article.coverImage,
            featured: article.featured,
            gradientClass: article.gradientClass,
            isSponsored: article.isSponsored,
            sponsorName: article.sponsorName,
            status: article.status,
          }}
        />
      </div>
    </div>
  );
}
