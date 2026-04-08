import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Culture pour Tous — Comment ca marche | Dream Team Africa",
  description: "Reservez votre place des 5 EUR et payez a votre rythme. La culture africaine accessible a tous.",
};

export default function CulturePourTousPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-12 text-center">
        <span className="inline-block rounded-full bg-dta-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dta-accent">
          Nouveau
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
          Culture pour Tous
        </h1>
        <p className="mt-4 text-lg text-dta-char/70">
          La culture africaine accessible a tous.<br />
          <strong className="text-dta-dark">Reserve ta place des 5&nbsp;&euro; et paie comme tu peux.</strong>
        </p>
      </div>

      {/* COMMENT CA MARCHE */}
      <div className="mb-14">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
          Comment ca marche ?
        </h2>

        <div className="space-y-6">
          {/* Etape 1 */}
          <div className="flex gap-5 rounded-2xl border border-dta-sand bg-white p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent text-xl font-bold text-white">
              1
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Reserve avec 5&nbsp;&euro;
              </h3>
              <p className="mt-1 text-sm text-dta-char/70">
                Choisis ton evenement et bloque ta place avec un acompte de seulement 5&nbsp;&euro;.
                Tu recois immediatement ton billet electronique avec QR code.
              </p>
            </div>
          </div>

          {/* Etape 2 */}
          <div className="flex gap-5 rounded-2xl border border-dta-sand bg-white p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent text-xl font-bold text-white">
              2
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Paie a ton rythme
              </h3>
              <p className="mt-1 text-sm text-dta-char/70">
                Depuis ton espace personnel, recharge ton billet quand tu veux, du montant que tu veux (minimum 5&nbsp;&euro; par versement).
                Suis ta progression en temps reel avec ta barre de versement.
              </p>
            </div>
          </div>

          {/* Etape 3 */}
          <div className="flex gap-5 rounded-2xl border border-dta-sand bg-white p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent text-xl font-bold text-white">
              3
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Solde avant l&apos;evenement
              </h3>
              <p className="mt-1 text-sm text-dta-char/70">
                Complete le solde restant avant la veille de l&apos;evenement.
                Si tu n&apos;as pas solde, pas de panique : tu paies le complement a l&apos;entree le jour J.
              </p>
            </div>
          </div>

          {/* Etape 4 */}
          <div className="flex gap-5 rounded-2xl border border-dta-sand bg-white p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
              &#x2713;
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-dta-dark">
                Profite de l&apos;evenement !
              </h3>
              <p className="mt-1 text-sm text-dta-char/70">
                Presente ton QR code a l&apos;entree. C&apos;est tout.
                Mode, artisanat, gastronomie, musique live... la culture africaine t&apos;attend.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXEMPLE CONCRET */}
      <div className="mb-14 overflow-hidden rounded-2xl border border-dta-sand bg-gradient-to-r from-dta-dark to-[#2a1a0a] p-8 text-white">
        <h2 className="mb-6 font-serif text-xl font-bold">
          Exemple concret
        </h2>
        <p className="mb-4 text-sm text-white/70">
          Pour un billet <strong className="text-white">Evasion Paris</strong> a <strong className="text-white">150&nbsp;&euro;</strong> :
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span className="text-sm text-white/70">15 mars</span>
            <span className="text-sm">Acompte initial</span>
            <span className="font-bold text-green-400">+5 &euro;</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span className="text-sm text-white/70">25 mars</span>
            <span className="text-sm">Recharge</span>
            <span className="font-bold text-green-400">+15 &euro;</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span className="text-sm text-white/70">2 avril</span>
            <span className="text-sm">Recharge</span>
            <span className="font-bold text-green-400">+20 &euro;</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span className="text-sm text-white/70">15 avril</span>
            <span className="text-sm">Recharge</span>
            <span className="font-bold text-green-400">+50 &euro;</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span className="text-sm text-white/70">10 juin</span>
            <span className="text-sm">Solde</span>
            <span className="font-bold text-green-400">+60 &euro;</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
            <span className="text-sm text-green-300">Total</span>
            <span className="text-sm text-green-300">Billet solde</span>
            <span className="font-bold text-green-400">150 &euro;</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-green-400 to-green-500" />
          </div>
          <p className="mt-1 text-right text-xs text-white/40">100% &mdash; Billet pret !</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-14">
        <h2 className="mb-6 text-center font-serif text-2xl font-bold text-dta-dark">
          Questions frequentes
        </h2>
        <div className="space-y-4">
          <Faq
            q="Mon billet est-il valable des le premier versement ?"
            a="Oui ! Des que tu paies l'acompte de 5 EUR, tu recois ton billet avec QR code. Tu peux entrer a l'evenement meme si ton billet n'est pas entierement solde — le complement sera a payer sur place."
          />
          <Faq
            q="Quel est le montant minimum par recharge ?"
            a="5 EUR par versement. Tu peux recharger autant de fois que tu veux."
          />
          <Faq
            q="Que se passe-t-il si je ne solde pas avant l'evenement ?"
            a="Ton billet reste valable. Tu paies simplement le complement a l'entree le jour J."
          />
          <Faq
            q="Puis-je me faire rembourser ?"
            a="Conformement a la loi (art. L221-28 du Code de la consommation), les billets de spectacles ne sont ni echangeables ni remboursables. En cas d'annulation de l'evenement par l'organisateur, un remboursement integral est garanti."
          />
          <Faq
            q="Comment suivre mes versements ?"
            a="Connecte-toi sur ton espace personnel (Mon Espace) pour voir ton solde, ta barre de progression et l'historique de tous tes versements."
          />
          <Faq
            q="Le prix du billet peut-il changer ?"
            a="Non. Le prix est garanti au moment de ta reservation. Meme si le tarif augmente ensuite, tu paies le prix initial."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/saison-culturelle-africaine"
          className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-dta-accent-dark"
        >
          Decouvrir les evenements
        </Link>
        <p className="mt-3 text-sm text-dta-char/50">
          La culture africaine pour tous. Des 5&nbsp;&euro;.
        </p>
      </div>

    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-dta-sand bg-white">
      <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-dta-dark list-none flex items-center justify-between">
        {q}
        <span className="ml-2 text-dta-accent transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-4 text-sm text-dta-char/70">
        {a}
      </div>
    </details>
  );
}
