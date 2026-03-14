import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Dream Team Africa",
  description: "Conditions générales d'utilisation du site dreamteamafrica.com — accès, propriété intellectuelle, données personnelles, responsabilité.",
  alternates: { canonical: "https://dreamteamafrica.com/conditions-utilisation" },
};

export default function CGUPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Conditions Générales d&apos;Utilisation
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-dta-char/80">
        Bienvenue sur www.dreamteamafrica.com, le site officiel de DREAM TEAM AFRICA,
        plateforme dédiée à la promotion des cultures africaines et de la créativité
        afro-descendante à travers des événements, expositions, rencontres et projets
        solidaires.
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Éditeur du site
          </h2>
          <p>Le site www.dreamteamafrica.com est édité par :</p>
          <p className="mt-2">
            <strong>DREAM TEAM AFRICA</strong>, association régie par la loi du 1er juillet
            1901, déclarée sous le numéro W942006772, dont le siège social est situé au :
          </p>
          <p className="mt-1">
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

        {/* 2 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            2. Hébergement
          </h2>
          <p>Le site est hébergé par :</p>
          <p className="mt-2">
            <strong>Hostinger International Ltd.</strong><br />
            61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
            <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-dta-accent hover:underline">www.hostinger.fr</a>
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Objet du site
          </h2>
          <p>
            Le site dreamteamafrica.com a pour objectif de présenter les activités de
            l&apos;association DREAM TEAM AFRICA, d&apos;informer le public sur ses événements
            (Foire d&apos;Afrique Paris, Fashion Week Africa, Festival du Conte Africain, etc.),
            et de permettre la réservation, l&apos;achat de billets ou la participation à ses
            actions.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Acceptation des conditions d&apos;utilisation
          </h2>
          <p>
            En accédant au site dreamteamafrica.com, l&apos;utilisateur reconnaît avoir pris
            connaissance des présentes Conditions Générales d&apos;Utilisation (CGU) et
            s&apos;engage à les respecter sans réserve.
          </p>
          <p className="mt-2">
            L&apos;association DREAM TEAM AFRICA se réserve le droit de modifier ces conditions
            à tout moment, sans préavis. Les utilisateurs sont invités à les consulter
            régulièrement.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble du contenu du site (textes, images, logos, vidéos, éléments
            graphiques, structure, base de données, etc.) est protégé par le droit
            d&apos;auteur et le droit des marques.
          </p>
          <p className="mt-2">
            Toute reproduction, distribution, modification, ou exploitation non autorisée
            du contenu, totale ou partielle, est strictement interdite sans l&apos;accord écrit
            de DREAM TEAM AFRICA.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Données personnelles
          </h2>
          <p>
            Les informations collectées sur le site (formulaires, billetterie, newsletters,
            etc.) sont traitées conformément au Règlement Général sur la Protection des
            Données (RGPD).
          </p>
          <p className="mt-2">
            Les données sont utilisées uniquement à des fins d&apos;organisation, de
            communication ou d&apos;information sur les activités de DREAM TEAM AFRICA.
          </p>
          <p className="mt-2">
            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
            données en écrivant à :{" "}
            <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
              hello@dreamteamafrica.com
            </a>
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            7. Responsabilité
          </h2>
          <p>
            DREAM TEAM AFRICA met tout en œuvre pour garantir la fiabilité et la mise à jour
            des informations diffusées sur son site. Cependant, elle ne saurait être tenue
            responsable des erreurs, omissions, ou indisponibilités temporaires du service.
          </p>
          <p className="mt-2">
            L&apos;utilisateur reconnaît utiliser le site sous sa seule responsabilité.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            8. Liens externes
          </h2>
          <p>
            Le site peut contenir des liens vers d&apos;autres sites ou plateformes externes.
            DREAM TEAM AFRICA décline toute responsabilité quant au contenu ou à la
            politique de confidentialité de ces sites tiers.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            9. Sécurité
          </h2>
          <p>
            Le site dreamteamafrica.com est sécurisé par certificat SSL (HTTPS) et hébergé
            sur des serveurs fiables chez Hostinger, garantissant la confidentialité des
            échanges et la protection des données.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            10. Droit applicable
          </h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation sont soumises au droit
            français.
          </p>
          <p className="mt-2">
            Tout litige relatif à leur interprétation ou à leur exécution relève de la
            compétence exclusive des tribunaux français.
          </p>
        </section>

        {/* Esprit */}
        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            DREAM TEAM AFRICA — Promouvoir, unir et célébrer la culture africaine à travers
            le monde.
          </p>
        </section>
      </div>
    </div>
  );
}
