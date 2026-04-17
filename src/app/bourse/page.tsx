import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { LISTING_CONFIG } from "@/lib/transfer-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bourse officielle de billets DTA — Dream Team Africa",
  description: "Bourse officielle de billets DTA : achetez un billet d'un fan empêché au prix d'achat. Zéro spéculation, billetterie officielle.",
};

export default async function BoursePage() {
  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 3600 * 1000);

  const listings = await prisma.ticketTransfer.findMany({
    where: {
      status: "LISTED",
      ticket: {
        checkedInAt: null,
        event: { published: true, date: { gt: cutoff } },
      },
    },
    include: {
      ticket: {
        include: {
          event: { select: { title: true, slug: true, venue: true, date: true, coverImage: true } },
        },
      },
    },
    orderBy: { listedAt: "desc" },
    take: 60,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-dta-accent">Bourse officielle de billets DTA</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">Un empêchement ? Votre billet peut trouver preneur.</h1>
        <p className="mt-3 max-w-2xl text-sm text-dta-char/70">
          Des billets officiels, mis en vente au <strong>prix d&apos;achat</strong> par d&apos;anciens acheteurs empêchés d&apos;y aller. Le vendeur est remboursé <strong>uniquement lorsqu&apos;un visiteur achète</strong> son billet. Zéro spéculation. {Math.round(LISTING_CONFIG.COMMISSION_RATE * 100)} % de frais de service à l&apos;acheteur.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <h2 className="font-serif text-xl font-bold text-slate-900">Aucun billet en vente actuellement</h2>
          <p className="mt-2 text-sm text-slate-500">Revenez régulièrement — les annonces apparaissent ici dès qu&apos;un visiteur remet son billet en vente.</p>
          <Link href="/saison-culturelle-africaine" className="mt-6 inline-flex rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
            Voir les événements
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => {
            const price = l.publicPrice ? Number(l.publicPrice) : Number(l.ticket.price);
            const commission = Math.round(price * LISTING_CONFIG.COMMISSION_RATE * 100) / 100;
            const total = Math.round((price + commission) * 100) / 100;
            return (
              <Link
                key={l.id}
                href={`/bourse/${l.id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 w-full bg-slate-900">
                  {l.ticket.event.coverImage ? (
                    <img src={l.ticket.event.coverImage} alt={l.ticket.event.title} className="h-full w-full object-cover opacity-80" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-dta-accent to-dta-accent-dark" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-dta-dark shadow">
                    {price.toFixed(2)} € + {commission.toFixed(2)} € frais
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-dta-accent">{l.ticket.tier}</p>
                  <h3 className="mt-1 font-serif text-base font-bold text-slate-900 line-clamp-2">{l.ticket.event.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(l.ticket.event.date)} — {l.ticket.event.venue}</p>
                  <p className="mt-3 text-sm font-bold text-dta-dark">Total : {total.toFixed(2)} €</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-dta-beige/40 p-6">
        <h2 className="font-serif text-lg font-bold text-dta-dark">Comment ça marche ?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold text-dta-accent">1. Le vendeur met son billet en vente</p>
            <p className="mt-1 text-sm text-slate-600">Depuis son espace personnel, au prix d&apos;achat exact. Il peut retirer l&apos;annonce à tout moment.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dta-accent">2. Un acheteur paie via la plateforme</p>
            <p className="mt-1 text-sm text-slate-600">Tant que personne n&apos;achète, aucun remboursement n&apos;est engagé. Paiement sécurisé Stripe.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dta-accent">3. QR officiel régénéré</p>
            <p className="mt-1 text-sm text-slate-600">Un nouveau QR est envoyé à l&apos;acheteur par email. L&apos;ancien est invalidé automatiquement.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dta-accent">4. Remboursement du vendeur</p>
            <p className="mt-1 text-sm text-slate-600">Le montant du billet est reversé au vendeur sur sa carte d&apos;origine (5 à 10 jours ouvrés).</p>
          </div>
        </div>
      </div>
    </main>
  );
}
