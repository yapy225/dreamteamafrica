import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Cookies — Dream Team Africa",
  description: "Politique de cookies du site dreamteamafrica.com — types de cookies, finalités, gestion des préférences, RGPD.",
  alternates: { canonical: "https://dreamteamafrica.com/politique-cookies" },
  robots: { index: false, follow: true },
};

export default function PolitiqueCookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Politique de Cookies
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-dta-char/80">
        La présente politique de cookies explique comment DREAM TEAM AFRICA utilise les
        cookies et technologies similaires sur le site www.dreamteamafrica.com, conformément
        au Règlement Général sur la Protection des Données (RGPD) et à la directive
        ePrivacy.
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* 1 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            1. Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
            tablette, smartphone) lorsque vous visitez un site web. Il permet au site de
            mémoriser certaines informations relatives à votre visite, comme vos préférences
            de langue ou votre session de connexion, afin de faciliter votre navigation.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            2. Types de cookies utilisés
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-dta-dark">Cookies strictement nécessaires</h3>
              <p className="mt-1">
                Ces cookies sont indispensables au fonctionnement du site. Ils permettent
                la navigation, l&apos;accès aux espaces sécurisés, la gestion du panier et
                l&apos;authentification. Ils ne peuvent pas être désactivés.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-dta-dark">Cookies de performance et d&apos;analyse</h3>
              <p className="mt-1">
                Ces cookies nous permettent de mesurer l&apos;audience du site, de comprendre
                comment les visiteurs interagissent avec nos pages et d&apos;améliorer
                l&apos;expérience utilisateur. Nous utilisons notamment Google Analytics et
                le Pixel Meta (Facebook) à ces fins.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-dta-dark">Cookies de marketing et publicité</h3>
              <p className="mt-1">
                Ces cookies sont utilisés pour diffuser des publicités pertinentes et
                mesurer l&apos;efficacité de nos campagnes publicitaires. Ils sont déposés
                par nos partenaires publicitaires (Meta / Facebook Ads, Google Ads) et
                peuvent être utilisés pour créer un profil de vos centres d&apos;intérêt.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-dta-dark">Cookies fonctionnels</h3>
              <p className="mt-1">
                Ces cookies permettent de mémoriser vos choix (langue, région, préférences
                d&apos;affichage) pour vous offrir une expérience personnalisée.
              </p>
            </div>
          </div>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            3. Détail des cookies utilisés
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-dta-sand">
                  <th className="py-2 pr-3 text-left font-semibold text-dta-dark">Cookie</th>
                  <th className="py-2 pr-3 text-left font-semibold text-dta-dark">Fournisseur</th>
                  <th className="py-2 pr-3 text-left font-semibold text-dta-dark">Finalité</th>
                  <th className="py-2 text-left font-semibold text-dta-dark">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                <tr>
                  <td className="py-2 pr-3">next-auth.session-token</td>
                  <td className="py-2 pr-3">Dream Team Africa</td>
                  <td className="py-2 pr-3">Authentification et session utilisateur</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">_ga, _gid</td>
                  <td className="py-2 pr-3">Google Analytics</td>
                  <td className="py-2 pr-3">Mesure d&apos;audience et statistiques</td>
                  <td className="py-2">2 ans / 24h</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">_fbp, _fbc</td>
                  <td className="py-2 pr-3">Meta (Facebook)</td>
                  <td className="py-2 pr-3">Suivi publicitaire et mesure de campagnes</td>
                  <td className="py-2">90 jours</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">__stripe_mid, __stripe_sid</td>
                  <td className="py-2 pr-3">Stripe</td>
                  <td className="py-2 pr-3">Prévention de la fraude lors du paiement</td>
                  <td className="py-2">1 an / 30 min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            4. Gestion de vos préférences
          </h2>
          <p>
            Vous pouvez à tout moment accepter ou refuser les cookies non essentiels.
            Plusieurs options s&apos;offrent à vous :
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Via votre navigateur :</strong> vous pouvez configurer votre navigateur
              pour accepter, refuser ou supprimer les cookies. Les procédures varient selon
              le navigateur utilisé (Chrome, Firefox, Safari, Edge).
            </li>
            <li>
              <strong>Via les paramètres de votre compte :</strong> si vous êtes connecté,
              vous pouvez gérer vos préférences depuis votre espace personnel.
            </li>
          </ul>
          <p className="mt-3">
            La désactivation de certains cookies peut affecter votre expérience de
            navigation et limiter l&apos;accès à certaines fonctionnalités du site.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            5. Durée de conservation
          </h2>
          <p>
            Les cookies sont conservés pour une durée maximale de 13 mois conformément aux
            recommandations de la CNIL. Au-delà de cette période, votre consentement sera
            de nouveau demandé.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            6. Transfert de données
          </h2>
          <p>
            Certains de nos partenaires (Google, Meta, Stripe) peuvent transférer des
            données en dehors de l&apos;Union européenne. Ces transferts sont encadrés par
            des clauses contractuelles types approuvées par la Commission européenne ou
            par des décisions d&apos;adéquation, garantissant un niveau de protection conforme
            au RGPD.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            7. Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants concernant vos données
            personnelles :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit de suppression</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit de retirer votre consentement à tout moment</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
              hello@dreamteamafrica.com
            </a>
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            8. Mise à jour de la politique
          </h2>
          <p>
            DREAM TEAM AFRICA se réserve le droit de modifier la présente politique de
            cookies à tout moment. Toute modification sera publiée sur cette page avec
            la date de mise à jour.
          </p>
          <p className="mt-2">Dernière mise à jour : avril 2026</p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            9. Contact
          </h2>
          <p>Pour toute question relative aux cookies, contactez-nous :</p>
          <ul className="mt-3 space-y-1">
            <li>E-mail : <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">hello@dreamteamafrica.com</a></li>
            <li>Téléphone : <a href="tel:+33782801852" className="text-dta-accent hover:underline">+33 7 82 80 18 52</a></li>
          </ul>
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
