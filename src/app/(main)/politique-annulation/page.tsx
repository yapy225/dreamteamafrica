import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique d'annulation et de remboursement — Dream Team Africa",
  description: "Conditions d'annulation, de remboursement et de report des billets pour les événements Dream Team Africa.",
};

export default function PolitiqueAnnulationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Politique d&apos;annulation et de remboursement
      </h1>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* Éditeur */}
        <section>
          <p>
            Le site www.dreamteamafrica.com est édité par <strong>DREAM TEAM AFRICA</strong>,
            association régie par la loi du 1er juillet 1901, déclarée sous le numéro
            W942006772, dont le siège social est situé au :
          </p>
          <p className="mt-2">
            16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois, France
          </p>
          <ul className="mt-3 space-y-1">
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Site : <a href="https://www.dreamteamafrica.com" className="text-dta-accent hover:underline">www.dreamteamafrica.com</a></li>
          </ul>
          <p className="mt-3">
            Directrice de la publication : <strong>Mme Yvylee KOFFI</strong><br />
            Présidente et fondatrice de l&apos;association DREAM TEAM AFRICA
          </p>
        </section>

        {/* Intro */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Conditions d&apos;annulation et de remboursement
          </h2>
          <p>
            Les événements organisés par DREAM TEAM AFRICA (Foire d&apos;Afrique Paris,
            Fashion Week Africa, Festival du Conte Africain, etc.) sont soumis à une gestion
            rigoureuse afin de garantir la qualité et la sécurité de l&apos;expérience des
            participants.
          </p>
          <p className="mt-2">
            Nous vous invitons à lire attentivement les conditions suivantes avant toute
            réservation ou achat de billet.
          </p>
        </section>

        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Billets non remboursables
          </h2>
          <p>
            Toute commande validée sur le site www.dreamteamafrica.com est ferme et
            définitive.
          </p>
          <p className="mt-2">
            Les billets ne sont ni repris, ni échangés, ni remboursés, sauf en cas
            d&apos;annulation totale de l&apos;événement par l&apos;organisateur.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            2. Annulation de l&apos;événement
          </h2>
          <p>
            En cas d&apos;annulation d&apos;un événement à l&apos;initiative de DREAM TEAM AFRICA,
            les acheteurs seront automatiquement informés par e-mail ou téléphone.
          </p>
          <p className="mt-2">
            Un remboursement intégral du montant du billet sera alors effectué, selon le
            même moyen de paiement utilisé lors de l&apos;achat.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Report ou modification de date
          </h2>
          <p>
            En cas de report ou de modification de date, les billets restent valables pour
            la nouvelle date.
          </p>
          <p className="mt-2">
            Si le participant ne peut y assister, une demande de remboursement exceptionnelle
            peut être formulée dans un délai de 14 jours à compter de l&apos;annonce du report,
            à l&apos;adresse :{" "}
            <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
              hello@dreamteamafrica.com
            </a>
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Cas de force majeure
          </h2>
          <p>
            Aucun remboursement ne pourra être effectué en cas d&apos;événements indépendants
            de notre volonté (grèves, intempéries, pandémies, décisions administratives,
            etc.) rendant impossible la tenue de l&apos;événement.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Erreur de commande
          </h2>
          <p>
            En cas d&apos;erreur lors de la saisie des informations ou du choix du billet,
            aucune modification ni remboursement ne pourra être accordé.
          </p>
          <p className="mt-2">
            Nous vous recommandons de vérifier attentivement toutes les informations avant
            de valider votre achat.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Conditions spécifiques
          </h2>
          <p>
            Certaines prestations spéciales (pass VIP, options restauration, accès backstage,
            etc.) peuvent être soumises à des conditions particulières précisées lors de la
            réservation.
          </p>
          <p className="mt-2">
            Ces conditions prévalent sur la présente politique en cas de divergence.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Contact pour toute demande
          </h2>
          <p>
            Pour toute question relative à une annulation, un remboursement ou un report,
            veuillez contacter notre équipe :
          </p>
          <ul className="mt-3 space-y-1">
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
          </ul>
        </section>

        {/* Hébergement */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Hébergement du site
          </h2>
          <p>Le site www.dreamteamafrica.com est hébergé par :</p>
          <p className="mt-2">
            <strong>Hostinger International Ltd.</strong><br />
            61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
            <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-dta-accent hover:underline">www.hostinger.fr</a>
          </p>
        </section>

        {/* Esprit */}
        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            DREAM TEAM AFRICA s&apos;engage à offrir une expérience culturelle authentique,
            inspirante et respectueuse de ses partenaires et visiteurs. Chaque billet
            contribue directement à la promotion de la culture africaine et au soutien
            des artisans et artistes du continent.
          </p>
        </section>
      </div>
    </div>
  );
}
