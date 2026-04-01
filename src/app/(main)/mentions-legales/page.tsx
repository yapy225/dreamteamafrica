import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Dream Team Africa",
  description: "Mentions légales du site dreamteamafrica.com — éditeur, hébergement, propriété intellectuelle, RGPD.",
  alternates: { canonical: "https://dreamteamafrica.com/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
        Mentions légales
      </h1>

      <div className="space-y-10 text-sm leading-relaxed text-dta-char/80">
        {/* Éditeur */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Éditeur du site
          </h2>
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
        </section>

        {/* Directeur de la publication */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Directeur de la publication
          </h2>
          <p>
            <strong>Mme Yvylee KOFFI</strong>
          </p>
          <p>Présidente et fondatrice de l&apos;association DREAM TEAM AFRICA</p>
        </section>

        {/* Hébergement */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Hébergement
          </h2>
          <p>Le site est hébergé par :</p>
          <p className="mt-2">
            <strong>Hostinger International Ltd.</strong><br />
            61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
            <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-dta-accent hover:underline">www.hostinger.fr</a>
          </p>
          <p className="mt-2">
            Hostinger garantit une infrastructure sécurisée, fiable et conforme aux normes
            européennes en matière de protection des données.
          </p>
        </section>

        {/* Propriété intellectuelle */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble du contenu du site (textes, visuels, photographies, logos,
            graphismes, vidéos, etc.) est la propriété exclusive de DREAM TEAM AFRICA ou
            de ses partenaires.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation, modification, diffusion ou exploitation,
            même partielle, sans autorisation préalable écrite, est strictement interdite.
          </p>
        </section>

        {/* Responsabilité */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Responsabilité
          </h2>
          <p>
            DREAM TEAM AFRICA s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
            informations diffusées sur le site. Toutefois, aucune garantie n&apos;est donnée
            quant à l&apos;exactitude, la complétude ou l&apos;actualité du contenu.
          </p>
          <p className="mt-2">
            L&apos;association ne saurait être tenue responsable d&apos;un dommage direct ou indirect
            résultant de l&apos;utilisation du site.
          </p>
        </section>

        {/* RGPD */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Protection des données personnelles
          </h2>
          <p>
            Les informations collectées via les formulaires du site font l&apos;objet d&apos;un
            traitement destiné uniquement à la gestion des événements, inscriptions, et
            relations avec les partenaires.
          </p>
          <p className="mt-2">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous
            disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition
            à vos données.
          </p>
          <p className="mt-2">
            Pour exercer ce droit, veuillez écrire à :{" "}
            <a href="mailto:hello@dreamteamafrica.com" className="text-dta-accent hover:underline">
              hello@dreamteamafrica.com
            </a>
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Cookies
          </h2>
          <p>
            Le site peut être amené à utiliser des cookies pour améliorer l&apos;expérience
            utilisateur et mesurer l&apos;audience. Vous pouvez paramétrer vos préférences dans
            les options de votre navigateur.
          </p>
        </section>

        {/* Crédits */}
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-dta-dark">
            Crédits &amp; design
          </h2>
          <ul className="space-y-1">
            <li>Conception &amp; direction artistique : <strong>DREAM TEAM MEDIA</strong></li>
            <li>Développement &amp; hébergement : <strong>Hostinger</strong> — solution sécurisée et performante</li>
          </ul>
        </section>

        {/* Médiation */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-dta-dark">
            M&eacute;diation de la consommation
          </h2>
          <p className="text-sm leading-relaxed text-dta-char">
            Conform&eacute;ment aux articles L.616-1 et R.616-1 du Code de la consommation,
            Dream Team Africa propose un dispositif de m&eacute;diation de la consommation.
            En cas de litige non r&eacute;solu par notre service client, vous pouvez saisir
            gratuitement le m&eacute;diateur de la consommation :
          </p>
          <div className="mt-3 rounded-lg bg-dta-bg p-4 text-sm">
            <p className="font-medium text-dta-dark">M&eacute;diation de la Consommation &amp; Patrimoine (MCP)</p>
            <p className="text-dta-char">12 Square Desnouettes, 75015 Paris</p>
            <p className="text-dta-char">
              Site :{" "}
              <a href="https://mcpmediation.org" target="_blank" rel="noopener noreferrer" className="text-dta-accent underline">
                mcpmediation.org
              </a>
            </p>
          </div>
          <p className="mt-3 text-xs text-dta-char/60">
            Avant de saisir le m&eacute;diateur, le consommateur doit avoir pr&eacute;alablement
            contact&eacute; notre service client &agrave; hello@dreamteamafrica.com pour tenter de
            r&eacute;soudre le litige &agrave; l&apos;amiable.
          </p>
        </section>

        {/* Données personnelles */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-dta-dark">
            Vos droits (RGPD)
          </h2>
          <p className="text-sm leading-relaxed text-dta-char">
            Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD),
            vous disposez d&apos;un droit d&apos;acc&egrave;s, de rectification, de suppression et de portabilit&eacute;
            de vos donn&eacute;es personnelles. Vous pouvez exercer ces droits depuis votre{" "}
            <a href="/mon-espace" className="text-dta-accent underline">espace personnel</a>{" "}
            ou en nous contactant &agrave; hello@dreamteamafrica.com.
          </p>
        </section>

        {/* Esprit */}
        <section className="rounded-xl border border-dta-sand/50 bg-dta-sand/10 p-6">
          <p className="font-serif text-base italic text-dta-dark">
            Le site Dream Team Africa incarne une vision positive, culturelle et moderne de
            l&apos;Afrique, au service des talents, des créateurs et de la diaspora. Un espace
            sécurisé, rassurant et élégant, à l&apos;image de la Saison Culturelle Africaine Paris.
          </p>
        </section>
      </div>
    </div>
  );
}
