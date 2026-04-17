import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Dream Team Africa",
  description: "Conditions générales de vente du site dreamteamafrica.com — billets, paiement cashless, frais, remboursement.",
  alternates: { canonical: "https://dreamteamafrica.com/conditions-generales" },
  robots: { index: false, follow: true },
};

export default function CGVPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Conditions Générales de Vente
      </h1>

      <p className="mb-8 text-sm text-dta-char/60">
        Dream Team Africa — www.dreamteamafrica.com — Dernière mise à jour : 12 avril 2026
      </p>

      {/* Résumé */}
      <div className="mb-10 rounded-xl border border-dta-accent/20 bg-dta-accent/5 p-5">
        <h2 className="mb-3 font-serif text-lg font-bold text-dta-dark">En résumé</h2>
        <ul className="space-y-2 text-sm text-dta-char/80">
          <li>• Frais de gestion : <strong>3 % (min 0,50 €)</strong> sur chaque achat de billet</li>
          <li>• Paiement sur place : <strong>100 % cashless</strong> via votre wallet personnel</li>
          <li>• Commission exposants : <strong>4 %</strong> sur les paiements reçus</li>
          <li>• Parrainage : <strong>crédits bonus offerts</strong> (non retirables)</li>
          <li>• Remboursement : <strong>non</strong>, sauf annulation par l&apos;organisateur</li>
        </ul>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Présentation
          </h2>
          <p>
            Dream Team Africa est une organisation culturelle dédiée à la promotion
            de la culture africaine à Paris et en Europe, notamment à travers la
            Saison Culturelle Africaine.
          </p>
          <ul className="mt-3 space-y-1">
            <li>Siège social : 16 rue Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois</li>
            <li>N° RNA : W942006772</li>
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            2. Objet
          </h2>
          <p>
            Les présentes CGV définissent les droits et obligations des parties
            dans le cadre de l&apos;achat de billets, de l&apos;utilisation du système
            de paiement cashless et des services proposés sur dreamteamafrica.com.
          </p>
          <p className="mt-2">
            Toute commande ou utilisation du service implique l&apos;acceptation
            des présentes conditions.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Services proposés
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Billets pour les événements de la Saison Culturelle Africaine</li>
            <li>Réservation échelonnée « Culture pour Tous » (dès 5 €)</li>
            <li>Paiement cashless sur place via un wallet personnel</li>
            <li>Formules d&apos;exposition pour les artisans et commerçants</li>
            <li>Programme de parrainage</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Prix et frais de gestion
          </h2>
          <p>Les prix sont indiqués en euros TTC.</p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.1 Frais de gestion — Visiteurs</h3>
          <p className="mt-2">
            Des frais de gestion de <strong>3 % (minimum 0,50 €)</strong> sont appliqués
            sur chaque transaction de billetterie. Ces frais couvrent le traitement
            sécurisé du paiement, la génération du billet et la maintenance de la
            plateforme.
          </p>
          <p className="mt-2">
            Les frais s&apos;appliquent aussi bien pour un paiement unique que pour
            chaque versement dans le cadre du programme « Culture pour Tous ».
          </p>
          <p className="mt-2">
            Les frais sont affichés avant la validation de chaque paiement.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.2 Commission — Exposants</h3>
          <p className="mt-2">
            Une commission de <strong>4 %</strong> est prélevée sur chaque paiement
            cashless reçu par un exposant lors d&apos;un événement. L&apos;exposant reçoit
            96 % du montant payé par le visiteur.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.3 Moyens de paiement</h3>
          <p className="mt-2">
            Les paiements en ligne sont effectués par carte bancaire via Stripe.
            Aucune donnée bancaire n&apos;est stockée par Dream Team Africa.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Paiement cashless sur place
          </h2>
          <p>
            Les événements de la Saison Culturelle Africaine fonctionnent en
            <strong> 100 % cashless</strong>. Chaque visiteur dispose d&apos;un wallet
            personnel crédité automatiquement lors de l&apos;achat de son billet.
          </p>
          <p className="mt-2">
            <strong>1 € payé = 1 crédit</strong> dans le wallet. Les crédits
            servent à payer les exposants sur place via un QR code personnel.
            Pas de monnaie, pas d&apos;attente.
          </p>
          <p className="mt-2">
            Les crédits sont utilisables uniquement lors des événements
            Dream Team Africa.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Programme « Culture pour Tous »
          </h2>
          <p>
            Ce programme permet de réserver un billet avec un acompte de
            <strong> 5 € minimum</strong> et de compléter le paiement à son rythme
            (minimum 1 € par versement).
          </p>
          <p className="mt-2">
            Le prix du billet est verrouillé au moment de la réservation.
            Chaque euro versé est crédité dans le wallet du visiteur.
          </p>
          <p className="mt-2">
            Des frais de gestion de 3 % (min 0,50 €) s&apos;appliquent sur chaque versement.
          </p>
          <p className="mt-2">
            Le billet est valide dès le premier versement.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            7. Programme de parrainage
          </h2>
          <p>
            Chaque utilisateur dispose d&apos;un code de parrainage. Lorsqu&apos;un
            ami s&apos;inscrit avec ce code, les deux reçoivent des
            <strong> crédits bonus</strong>.
          </p>
          <p className="mt-2">
            Les crédits bonus sont utilisables pour payer les exposants lors
            des événements. Ils ne sont <strong>ni retirables, ni convertibles
            en euros, ni remboursables</strong>.
          </p>
          <p className="mt-2">
            Dream Team Africa se réserve le droit de modifier les conditions
            du programme à tout moment.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            8. Billets
          </h2>
          <p>Les billets sont nominatifs et uniques.</p>
          <p className="mt-2">
            Ils doivent être présentés à l&apos;entrée via le QR code généré
            dans l&apos;espace personnel du visiteur.
          </p>
          <p className="mt-2">
            Toute duplication, revente ou usage frauduleux entraînera
            l&apos;annulation du billet sans remboursement.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            9. Annulation et remboursement
          </h2>
          <p>
            En cas d&apos;annulation par l&apos;organisateur : remboursement
            intégral (hors frais de gestion).
          </p>
          <p className="mt-2">
            En cas de report : les billets restent valables.
          </p>
          <p className="mt-2">
            En cas de désistement du visiteur : aucun remboursement.
          </p>
          <p className="mt-2">
            Les crédits bonus ne sont en aucun cas remboursables.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            10. Exposants
          </h2>
          <p>
            Les exposants réservent un stand via la plateforme selon les
            formules disponibles :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Pack Entrepreneur 1 jour</strong> : 190 € — stand 2 m², 1 table, 2 chaises, 2 badges</li>
            <li><strong>Pack Entrepreneur 2 jours</strong> : 320 € (160 €/jour) — stand 2 m², 1 table, 2 chaises, 2 badges</li>
            <li><strong>Pack Restauration 2 jours</strong> : 1 000 € (500 €/jour) — espace restauration, 2 tables, 4 chaises, 4 badges</li>
          </ul>
          <p className="mt-3 font-semibold">Modalités de paiement exposant :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Un <strong>acompte de 50 €</strong> est exigé pour confirmer la réservation du stand.</li>
            <li>L&apos;acompte est <strong>non remboursable</strong>, sauf en cas d&apos;annulation de l&apos;événement par l&apos;organisateur.</li>
            <li>Le solde est payable en mensualités automatiques (jusqu&apos;à 10 fois), avec des <strong>frais de gestion partenaire de 3 %</strong> appliqués sur les paiements échelonnés.</li>
            <li>Le solde doit être <strong>entièrement réglé avant le jour de l&apos;événement</strong>.</li>
            <li>En cas de report sur un autre événement de la Saison Culturelle, l&apos;acompte versé est transférable.</li>
          </ul>
          <p className="mt-3 font-semibold">Avantages inclus :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Capsule vidéo promotionnelle personnalisée diffusée sur les réseaux sociaux Dream Team Africa</li>
            <li>Référencement dans L&apos;Officiel d&apos;Afrique (annuaire professionnel permanent)</li>
          </ul>
          <p className="mt-3 font-semibold">Commission sur les ventes sur site :</p>
          <p className="mt-2">
            Lors de l&apos;événement, les exposants reçoivent les paiements
            cashless des visiteurs. Une commission de <strong>4 %</strong> est prélevée
            sur chaque transaction.
          </p>
          <p className="mt-2">
            Les crédits reçus sont convertibles en euros par virement
            bancaire après l&apos;événement.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            11. Données personnelles
          </h2>
          <p>
            Les données collectées servent à la gestion des commandes et
            du wallet. Elles ne sont jamais revendues.
          </p>
          <p className="mt-2">
            Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès,
            de rectification et de suppression en écrivant à
            hello@dreamteamafrica.com.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            12. Droit applicable
          </h2>
          <p>
            CGV régies par le droit français. En cas de litige, recherche
            d&apos;une solution amiable avant toute action judiciaire.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            13. Contact
          </h2>
          <ul className="space-y-1">
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
            <li>WhatsApp : <a href="https://wa.me/33623914142" className="text-dta-accent hover:underline">+33 6 23 91 41 42</a></li>
          </ul>
        </section>

        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            Dream Team Africa — La culture africaine rayonne à Paris.
          </p>
        </section>
      </div>
    </div>
  );
}
