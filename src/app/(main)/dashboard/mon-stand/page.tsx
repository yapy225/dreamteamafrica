import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ExhibitorProfileClientForm from "./ExhibitorProfileClientForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ma fiche exposant | Dashboard" };

export default async function MonStandPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  // Find the user's exhibitor booking(s) with profile
  const booking = await prisma.exhibitorBooking.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["PARTIAL", "CONFIRMED"] },
    },
    include: {
      profile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Ma fiche exposant
        </h1>
        <p className="mt-4 text-dta-char/70">
          Vous n&apos;avez pas encore de r&eacute;servation de stand confirm&eacute;e.
          Votre fiche exposant sera disponible apr&egrave;s votre premier paiement.
        </p>
      </div>
    );
  }

  // Create profile if it doesn't exist
  let profile = booking.profile;
  if (!profile) {
    const { randomUUID } = await import("crypto");
    profile = await prisma.exhibitorProfile.create({
      data: {
        bookingId: booking.id,
        userId: session.user.id,
        token: randomUUID(),
      },
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Ma fiche exposant
        </h1>
        <p className="mt-2 text-dta-char/70">
          Compl&eacute;tez votre fiche pour b&eacute;n&eacute;ficier d&apos;une visibilit&eacute; sur nos
          r&eacute;seaux sociaux et supports de communication.
        </p>
        {profile.submittedAt && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <p className="text-sm font-medium text-green-800">
              Fiche envoy&eacute;e le{" "}
              {new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(profile.submittedAt)}
              {" — "}en attente de validation par notre &eacute;quipe.
            </p>
          </div>
        )}
      </div>

      <ExhibitorProfileClientForm
        token={profile.token}
        booking={{
          companyName: booking.companyName,
          contactName: booking.contactName,
          email: booking.email,
          phone: booking.phone,
          sector: booking.sector,
          pack: booking.pack,
          events: booking.events,
        }}
      />
    </div>
  );
}
