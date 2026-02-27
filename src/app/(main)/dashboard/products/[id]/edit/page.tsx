import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ProductForm from "../../ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier le produit" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();
  if (product.artisanId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">Modifier le produit</h1>
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <ProductForm
          initialData={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,
            category: product.category,
            country: product.country,
            stock: product.stock,
            published: product.published,
          }}
        />
      </div>
    </div>
  );
}
