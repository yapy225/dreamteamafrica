import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import DevisClient from "./DevisClient";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lead = await prisma.exposantLead.findUnique({ where: { id } });

  const title = lead
    ? `Devis Exposant — ${lead.eventName}`
    : "Devis Exposant — Dream Team Africa";

  return {
    title,
    description: "Accédez à votre devis personnalisé et réservez votre stand avec un acompte de 50 €.",
    openGraph: {
      title,
      description: "Réservez votre stand dès maintenant avec un acompte de 50 €.",
      images: [{ url: `${siteUrl}/logo-dta.png`, width: 800, height: 800, alt: "Dream Team Africa" }],
    },
  };
}

export default async function DevisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await prisma.exposantLead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <DevisClient
      lead={{
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        brand: lead.brand,
        sector: lead.sector,
        phone: lead.phone,
        email: lead.email,
        eventName: lead.eventName,
        status: lead.status,
      }}
    />
  );
}
