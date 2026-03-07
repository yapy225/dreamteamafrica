import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditBookingForm from "./EditBookingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier la réservation exposant" };

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const booking = await prisma.exhibitorBooking.findUnique({ where: { id } });
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Modifier la r&eacute;servation
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <EditBookingForm
          booking={{
            id: booking.id,
            companyName: booking.companyName,
            contactName: booking.contactName,
            email: booking.email,
            phone: booking.phone,
            sector: booking.sector,
            pack: booking.pack,
            events: booking.events,
            totalDays: booking.totalDays,
            totalPrice: booking.totalPrice,
            installments: booking.installments,
            installmentAmount: booking.installmentAmount,
            paidInstallments: booking.paidInstallments,
            status: booking.status,
          }}
        />
      </div>
    </div>
  );
}
