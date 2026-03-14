import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Dream Team Africa",
  description: "Conditions générales de vente du site dreamteamafrica.com — commandes, paiement, billets, remboursement, RGPD.",
  alternates: { canonical: "https://dreamteamafrica.com/conditions-generales" },
};

export default function CGVPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Conditions Générales de Vente
      </h1>

      <p className="mb-8 text-sm text-dta-char/60">
        Dream Team Africa — www.dreamteamafrica.com
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Présentation de l&apos;entreprise
          </h2>
          <p>
            Dream Team Africa est une organisation culturelle dédiée à la promotion des
            talents africains et à la création d&apos;événements uniques à Paris et dans le monde.
          </p>
          <ul className="mt-3 space-y-1">
            <li>Siège social : 16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois, France</li>
            <li>Siret : 852 965 201</li>
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
          </ul>
          <p className="mt-3">
            Le site www.dreamteamafrica.com permet l&apos;achat sécurisé de billets d&apos;événements,
            de formules exposants, de partenariats et de prestations culturelles.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            2. Objet
          </h2>
          <p>
            Les présentes Conditions Générales de Vente ont pour objet de définir les droits
            et obligations des parties dans le cadre de la vente en ligne de produits et
            services proposés par Dream Team Africa.
          </p>
          <p className="mt-2">
            Toute commande passée sur le site implique l&apos;acceptation sans réserve des
            présentes conditions.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Produits et services proposés
          </h2>
          <p>Dream Team Africa propose :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Des billets électroniques pour ses événements culturels (Foire d&apos;Afrique,
              Fashion Week Africa, Festival du Conte Africain, etc.)
            </li>
            <li>Des formules d&apos;exposition et de partenariat</li>
            <li>Des prestations artistiques et culturelles</li>
          </ul>
          <p className="mt-3">
            Les caractéristiques essentielles des produits et services sont présentées sur
            le site. Les photos et visuels sont non contractuels mais représentatifs.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Prix et paiement
          </h2>
          <p>Les prix affichés sur le site sont indiqués en euros TTC.</p>
          <p className="mt-2">
            Le paiement s&apos;effectue en ligne via Stripe, plateforme sécurisée respectant les
            normes de cryptage SSL. Aucune donnée bancaire n&apos;est stockée sur le site.
          </p>
          <p className="mt-2">
            Dream Team Africa se réserve le droit de modifier ses tarifs à tout moment, mais
            les prix applicables restent ceux affichés au moment de la commande.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Commande et confirmation
          </h2>
          <p>
            Toute commande passée sur dreamteamafrica.com vaut acceptation expresse des
            présentes CGV.
          </p>
          <p className="mt-2">
            Une fois la commande validée et le paiement effectué, un e-mail de confirmation
            est envoyé automatiquement à l&apos;adresse fournie par le client, accompagné du
            billet électronique ou du récapitulatif de la prestation achetée.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Billets électroniques
          </h2>
          <p>Les billets sont nominatifs et uniques.</p>
          <p className="mt-2">
            Ils doivent être présentés à l&apos;entrée de l&apos;événement (imprimés ou en version
            numérique).
          </p>
          <p className="mt-2">
            Toute duplication, revente non autorisée ou usage frauduleux entraînera
            l&apos;annulation du billet sans remboursement.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            7. Annulation, report et remboursement
          </h2>
          <p>
            En cas d&apos;annulation de l&apos;événement par l&apos;organisateur, les billets seront
            remboursés intégralement (hors frais bancaires éventuels).
          </p>
          <p className="mt-2">
            En cas de report, les billets restent valables pour la nouvelle date.
          </p>
          <p className="mt-2">
            Aucun remboursement n&apos;est possible en cas de désistement du participant ou
            d&apos;impossibilité de se rendre à l&apos;événement.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            8. Sécurité et confidentialité
          </h2>
          <p>
            Dream Team Africa accorde une grande importance à la protection des données
            personnelles. Les informations collectées sont nécessaires à la gestion des
            commandes et à la communication avec le client.
          </p>
          <p className="mt-2">Elles ne sont jamais revendues à des tiers.</p>
          <p className="mt-2">
            Le site est protégé par un certificat SSL (https://) garantissant la
            confidentialité des échanges.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            9. Responsabilité
          </h2>
          <p>
            Dream Team Africa ne saurait être tenue responsable en cas de perturbation,
            interruption ou indisponibilité du service liée au réseau Internet.
          </p>
          <p className="mt-2">
            L&apos;organisation ne peut être tenue responsable d&apos;un retard ou d&apos;un manquement
            dû à un cas de force majeure.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            10. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur le site (textes, visuels, logos, vidéos,
            etc.) est la propriété exclusive de Dream Team Africa.
          </p>
          <p className="mt-2">
            Toute reproduction, diffusion ou exploitation sans autorisation écrite préalable
            est strictement interdite.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            11. Droit applicable
          </h2>
          <p>Les présentes CGV sont régies par le droit français.</p>
          <p className="mt-2">
            Tout litige sera soumis à la compétence exclusive des tribunaux français.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            12. Contact
          </h2>
          <p>Pour toute question, demande ou réclamation, vous pouvez nous contacter :</p>
          <ul className="mt-3 space-y-1">
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
          </ul>
        </section>

        {/* Esprit */}
        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            Dream Team Africa — Créons ensemble les ponts entre les cultures.
          </p>
        </section>
      </div>
    </div>
  );
}
