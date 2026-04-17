import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Dream Team Africa",
  description:
    "Politique de confidentialité du site dreamteamafrica.com — collecte, utilisation et protection de vos données personnelles.",
  alternates: { canonical: "https://dreamteamafrica.com/politique-de-confidentialite" },
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Politique de confidentialité
      </h1>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        <section>
          <p>
            La présente politique de confidentialité décrit la manière dont{" "}
            <strong>DREAM TEAM AFRICA</strong>, association loi 1901 (n° W942006772),
            collecte, utilise et protège vos données personnelles lorsque vous utilisez
            le site www.dreamteamafrica.com.
          </p>
          <p className="mt-2">
            En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Responsable du traitement
          </h2>
          <ul className="space-y-1">
            <li><strong>DREAM TEAM AFRICA</strong></li>
            <li>16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois, France</li>
            <li>
              E-mail :{" "}
              <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
                hello@dreamteamafrica.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Données collectées
          </h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nom, prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone / WhatsApp</li>
            <li>Messages échangés via WhatsApp Business (conservés pour le suivi de votre demande)</li>
            <li>Informations de profil (visiteur, exposant, artiste, partenaire, etc.)</li>
            <li>Données de navigation (cookies, adresse IP)</li>
            <li>Données de paiement (traitées par Stripe, non stockées sur nos serveurs)</li>
            <li>Données d&apos;inscription newsletter (adresse e-mail, avec consentement explicite — désinscription possible à tout moment via le lien en bas de chaque email)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Finalités du traitement
          </h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Gérer vos inscriptions et achats de billets</li>
            <li>Envoyer des confirmations et rappels (e-mail, WhatsApp)</li>
            <li>Répondre à vos demandes de contact</li>
            <li>Améliorer nos services et événements</li>
            <li>Envoyer des communications marketing (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Base légale
          </h2>
          <p>
            Le traitement de vos données repose sur votre consentement, l&apos;exécution
            d&apos;un contrat (achat de billets) ou notre intérêt légitime (amélioration
            des services), conformément au RGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Partage des données
          </h2>
          <p>
            Vos données ne sont jamais vendues. Elles peuvent être partagées avec :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Stripe</strong> — traitement sécurisé des paiements</li>
            <li><strong>Meta (Facebook, WhatsApp, Instagram)</strong> — campagnes publicitaires et notifications</li>
            <li><strong>Resend</strong> — envoi d&apos;e-mails transactionnels</li>
            <li><strong>Vercel / Neon</strong> — hébergement et base de données</li>
          </ul>
          <p className="mt-2">
            Ces prestataires sont soumis à leurs propres politiques de confidentialité
            et respectent les normes de protection des données.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Durée de conservation
          </h2>
          <p>
            Vos données sont conservées pendant la durée nécessaire aux finalités
            décrites ci-dessus, et au maximum 3 ans après votre dernier contact ou
            interaction avec nos services, sauf obligation légale.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit de suppression (« droit à l&apos;oubli »)</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit de retirer votre consentement à tout moment</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, écrivez à :{" "}
            <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
              hello@dreamteamafrica.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Cookies
          </h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience et mesurer
            l&apos;audience. Vous pouvez configurer vos préférences via les paramètres
            de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Sécurité
          </h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données contre tout accès non autorisé,
            perte ou altération. Les connexions sont chiffrées via HTTPS et les
            paiements sont traités via des plateformes certifiées PCI-DSS.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Contact
          </h2>
          <p>
            Pour toute question relative à cette politique, contactez-nous :
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              E-mail :{" "}
              <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
                hello@dreamteamafrica.com
              </a>
            </li>
            <li>
              Téléphone :{" "}
              <a href="tel:+33782801852" className="text-dta-accent hover:underline">
                +33 7 82 80 18 52
              </a>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="text-xs text-dta-char/60">
            Dernière mise à jour : mars 2026
          </p>
        </section>
      </div>
    </div>
  );
}
