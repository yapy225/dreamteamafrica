import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Dream Team Africa",
  description: "Conditions générales de vente du site dreamteamafrica.com — billets, NTBC, frais, remboursement, RGPD.",
  alternates: { canonical: "https://dreamteamafrica.com/conditions-generales" },
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

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Présentation de l&apos;entreprise
          </h2>
          <p>
            Dream Team Africa est une organisation culturelle dédiée à la promotion des
            talents africains et à la création d&apos;événements uniques à Paris et en Europe.
          </p>
          <ul className="mt-3 space-y-1">
            <li>Siège social : Draveil, Île-de-France</li>
            <li>SIREN : 852 965 201</li>
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
            Les présentes Conditions Générales de Vente définissent les droits et obligations
            des parties dans le cadre de la vente en ligne de billets, formules exposants,
            et de l&apos;utilisation du système de paiement cashless NTÉBY Coin (NTBC)
            proposé par Dream Team Africa.
          </p>
          <p className="mt-2">
            Toute commande ou utilisation du service implique l&apos;acceptation sans réserve
            des présentes conditions.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Produits et services proposés
          </h2>
          <p>Dream Team Africa propose :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Des billets électroniques pour ses événements culturels</li>
            <li>Un système de paiement échelonné « Culture pour Tous » (dès 5 €)</li>
            <li>Un système de paiement cashless NTBC pour les événements</li>
            <li>Des formules d&apos;exposition et de partenariat</li>
            <li>Un programme de parrainage</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Prix, frais de gestion et paiement
          </h2>
          <p>Les prix affichés sont en euros TTC.</p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.1 Frais de gestion — Visiteurs</h3>
          <p className="mt-2">
            Des frais de gestion de <strong>3 % (minimum 0,50 €)</strong> sont appliqués
            sur chaque transaction de billetterie, qu&apos;il s&apos;agisse d&apos;un paiement unique
            ou d&apos;un versement échelonné « Culture pour Tous ».
          </p>
          <p className="mt-2">
            Ces frais couvrent les coûts de traitement du paiement sécurisé (Stripe),
            la génération du billet électronique et la maintenance de la plateforme.
          </p>
          <p className="mt-2">
            Les frais sont clairement affichés avant la validation du paiement.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.2 Commission — Exposants (NTBC)</h3>
          <p className="mt-2">
            Une commission de <strong>4 %</strong> est prélevée automatiquement sur chaque
            paiement NTBC reçu par un exposant lors d&apos;un événement.
          </p>
          <p className="mt-2">
            L&apos;exposant reçoit 96 % du montant payé par le visiteur. La commission est
            déduite instantanément et de manière transparente.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">4.3 Moyens de paiement</h3>
          <p className="mt-2">
            Le paiement s&apos;effectue en ligne via Stripe (carte bancaire). Aucune donnée
            bancaire n&apos;est stockée par Dream Team Africa.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Système cashless NTÉBY Coin (NTBC)
          </h2>

          <h3 className="mt-3 font-semibold text-dta-dark">5.1 Définition</h3>
          <p className="mt-2">
            Le NTBC est un token utilitaire cashless utilisé exclusivement lors des
            événements Dream Team Africa. Sa parité est fixe : <strong>1 NTBC = 1 €</strong>.
            Le NTBC n&apos;est pas une cryptomonnaie et n&apos;a pas vocation à être échangé
            en dehors de l&apos;écosystème Dream Team Africa.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">5.2 Acquisition de NTBC</h3>
          <p className="mt-2">
            Les NTBC sont crédités automatiquement dans le wallet du visiteur :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>À l&apos;achat d&apos;un billet (1 € payé = 1 NTBC crédité)</li>
            <li>À chaque recharge « Culture pour Tous » (1 € = 1 NTBC)</li>
            <li>Via le programme de parrainage (bonus NTBC)</li>
          </ul>

          <h3 className="mt-4 font-semibold text-dta-dark">5.3 Utilisation</h3>
          <p className="mt-2">
            Les NTBC permettent de payer les exposants sur place via un QR code personnel.
            Aucun espèce, aucune carte bancaire n&apos;est nécessaire pendant l&apos;événement.
          </p>

          <h3 className="mt-4 font-semibold text-dta-dark">5.4 Système de tiers</h3>
          <p className="mt-2">
            Le solde NTBC détermine un niveau de fidélité :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>🌱 Semence : 0 à 9 NTBC</li>
            <li>🌿 Racine : 10 à 49 NTBC</li>
            <li>🌳 Tronc : 50 à 199 NTBC</li>
            <li>🌴 Baobab : 200 NTBC et plus</li>
          </ul>

          <h3 className="mt-4 font-semibold text-dta-dark">5.5 Conversion exposant</h3>
          <p className="mt-2">
            Les exposants peuvent convertir leurs NTBC en euros (virement IBAN)
            après l&apos;événement. La conversion est effectuée au taux fixe 1 NTBC = 1 €,
            après déduction de la commission de 4 %.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Programme « Culture pour Tous »
          </h2>
          <p>
            Le programme « Culture pour Tous » permet de réserver un billet avec un
            acompte minimum de <strong>5 €</strong> et de compléter le paiement à son rythme
            par versements libres (minimum 1 € par versement).
          </p>
          <p className="mt-2">
            Le prix du billet est verrouillé au moment de la réservation. Aucune
            majoration n&apos;est appliquée en cas de hausse tarifaire ultérieure.
          </p>
          <p className="mt-2">
            Des frais de gestion de 3 % (minimum 0,50 €) sont appliqués sur chaque
            versement.
          </p>
          <p className="mt-2">
            Le billet est valide dès le premier versement. Le solde restant doit être
            réglé avant le jour de l&apos;événement ou sur place.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            7. Programme de parrainage
          </h2>
          <p>
            Chaque utilisateur dispose d&apos;un code de parrainage unique. Lorsqu&apos;un
            filleul s&apos;inscrit avec ce code, le parrain et le filleul reçoivent chacun
            <strong> 4 NTBC bonus</strong>.
          </p>
          <p className="mt-2">
            Les NTBC bonus sont <strong>non retirables et non convertibles en euros</strong>.
            Ils sont utilisables uniquement pour payer les exposants lors des événements.
          </p>
          <p className="mt-2">
            Dream Team Africa se réserve le droit de modifier le montant du bonus
            ou de suspendre le programme à tout moment.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            8. Billets électroniques
          </h2>
          <p>Les billets sont nominatifs et uniques.</p>
          <p className="mt-2">
            Ils doivent être présentés à l&apos;entrée de l&apos;événement via le QR code
            généré dans l&apos;espace personnel du visiteur.
          </p>
          <p className="mt-2">
            Toute duplication, revente non autorisée ou usage frauduleux entraînera
            l&apos;annulation du billet sans remboursement.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            9. Annulation, report et remboursement
          </h2>
          <p>
            En cas d&apos;annulation de l&apos;événement par l&apos;organisateur, les billets seront
            remboursés intégralement (hors frais de gestion).
          </p>
          <p className="mt-2">
            En cas de report, les billets restent valables pour la nouvelle date.
          </p>
          <p className="mt-2">
            Aucun remboursement n&apos;est possible en cas de désistement du participant.
          </p>
          <p className="mt-2">
            Les NTBC bonus (parrainage) ne sont en aucun cas remboursables.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            10. Formules exposants
          </h2>
          <p>
            Les exposants réservent un stand via la plateforme. Le paiement peut être
            effectué en une ou plusieurs fois selon la formule choisie.
          </p>
          <p className="mt-2">
            Lors de l&apos;événement, les exposants reçoivent les paiements des visiteurs
            en NTBC. Une commission de 4 % est automatiquement prélevée sur chaque
            transaction reçue.
          </p>
          <p className="mt-2">
            Les NTBC reçus sont convertibles en euros par virement bancaire après
            l&apos;événement, sur demande de l&apos;exposant.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            11. Protection des données (RGPD)
          </h2>
          <p>
            Dream Team Africa collecte les données personnelles nécessaires à la
            gestion des commandes, du wallet NTBC et de la communication.
          </p>
          <p className="mt-2">
            Les données ne sont jamais revendues à des tiers. Le site est protégé
            par un certificat SSL.
          </p>
          <p className="mt-2">
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification
            et de suppression de vos données en contactant hello@dreamteamafrica.com.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            12. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus du site (textes, visuels, logos, marques NTBC
            et NTÉBY) est la propriété exclusive de Dream Team Africa. Toute
            reproduction sans autorisation est interdite.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            13. Droit applicable et litiges
          </h2>
          <p>Les présentes CGV sont régies par le droit français.</p>
          <p className="mt-2">
            En cas de litige, une solution amiable sera recherchée avant toute action
            judiciaire. À défaut, les tribunaux français seront compétents.
          </p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            14. Contact
          </h2>
          <ul className="space-y-1">
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
            <li>WhatsApp : <a href="https://wa.me/33623914142" className="text-dta-accent hover:underline">+33 6 23 91 41 42</a></li>
          </ul>
        </section>

        {/* Esprit */}
        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            Dream Team Africa — La culture africaine rayonne à Paris.
          </p>
        </section>
      </div>
    </div>
  );
}
