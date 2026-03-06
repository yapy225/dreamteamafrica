import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { EXHIBITOR_EVENTS } from "@/lib/exhibitor-events";
import ResaForm from "./ResaForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = EXHIBITOR_EVENTS.find((e) => e.id === slug);
  if (!event) return { title: "Réservation Exposant" };
  return {
    title: `Réserver un stand — ${event.title} | Dream Team Africa`,
    description: `Devenez exposant pour ${event.title}. Stand à partir de 150€/jour. Paiement jusqu'en 5 fois sans frais.`,
  };
}

export default async function ResaExposantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { slug } = await params;
  const event = EXHIBITOR_EVENTS.find((e) => e.id === slug);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <ResaForm event={event} />
    </div>
  );
}
