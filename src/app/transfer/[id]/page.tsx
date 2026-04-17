import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyTransferToken } from "@/lib/transfer-token";
import TransferAcceptClient from "./TransferAcceptClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invitation — Dream Team Africa",
};

export default async function TransferPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t: token } = await searchParams;

  if (!token || !verifyTransferToken(id, token)) notFound();

  const transfer = await prisma.ticketTransfer.findUnique({
    where: { id },
    include: {
      ticket: {
        include: {
          event: {
            select: { title: true, venue: true, address: true, date: true, coverImage: true },
          },
        },
      },
    },
  });

  if (!transfer) notFound();

  const expired = transfer.status === "PENDING" && transfer.expiresAt < new Date();
  const status: string = expired ? "EXPIRED" : transfer.status;
  const fromInitial = transfer.fromLastName ? transfer.fromLastName[0].toUpperCase() + "." : "";
  const fromLabel = [transfer.fromFirstName, fromInitial].filter(Boolean).join(" ") || "Un membre Dream Team Africa";

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(transfer.ticket.event.date));

  if (status !== "PENDING") {
    const label: Record<string, string> = {
      ACCEPTED: "Cette invitation a déjà été acceptée.",
      EXPIRED: "Cette invitation a expiré.",
      CANCELLED: "Le cédant a annulé cette invitation.",
      REFUSED: "Cette invitation a été refusée.",
    };
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="font-serif text-2xl font-bold text-dta-dark">Invitation indisponible</h1>
          <p className="mt-3 text-sm text-dta-char/70">{label[status] || "Cette invitation n'est plus active."}</p>
          <a href="mailto:contact@dreamteamafrica.com" className="mt-6 inline-block text-sm font-medium text-dta-accent hover:underline">
            Contacter Dream Team Africa
          </a>
        </div>
      </div>
    );
  }

  return (
    <TransferAcceptClient
      transferId={transfer.id}
      token={token}
      fromLabel={fromLabel}
      expiresAt={transfer.expiresAt.toISOString()}
      message={transfer.message}
      mode={transfer.mode}
      event={{
        title: transfer.ticket.event.title,
        venue: transfer.ticket.event.venue,
        address: transfer.ticket.event.address,
        dateStr,
        coverImage: transfer.ticket.event.coverImage,
      }}
      tier={transfer.ticket.tier}
      prefillFirstName={transfer.toFirstName}
      prefillLastName={transfer.toLastName}
      prefillPhone={transfer.toPhone}
    />
  );
}
