import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { buildMagicLink } from "@/lib/cpt-token";

export const dynamic = "force-dynamic";

export default async function CptSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let magicLink: string | null = null;
  let eventTitle = "";

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const email = session.metadata?.email?.toLowerCase();
      const eventId = session.metadata?.eventId;
      if (email && eventId) {
        const ticket = await prisma.ticket.findFirst({
          where: { email, eventId, stripeSessionId: session.id },
          include: { event: { select: { title: true } } },
          orderBy: { purchasedAt: "desc" },
        });
        if (ticket) {
          magicLink = buildMagicLink(ticket.id);
          eventTitle = ticket.event.title;
        }
      }
    } catch (err) {
      console.error("CPT success lookup failed:", err);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
        ✓
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Acompte reçu !</h1>
      <p className="mt-3 text-slate-600">
        Merci, votre billet <strong>Culture pour Tous</strong>
        {eventTitle && <> pour <strong>{eventTitle}</strong></>} est réservé.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Un email de confirmation vient d'être envoyé avec votre lien personnel pour solder votre billet à votre rythme.
      </p>

      {magicLink && (
        <Link
          href={magicLink}
          className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Gérer mon billet →
        </Link>
      )}

      <p className="mt-8 text-xs text-slate-400">
        Pas de compte nécessaire — le lien dans votre email est personnel et sécurisé.
      </p>
    </main>
  );
}
