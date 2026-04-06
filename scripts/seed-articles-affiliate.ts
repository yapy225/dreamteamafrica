/**
 * Insertion des 7 articles affiliés restants pour L'Afropéen
 *
 * Usage : npx tsx scripts/seed-articles-affiliate.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ArticleSeed {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "LIFESTYLE" | "CULTURE" | "BUSINESS" | "ACTUALITE";
  readingTimeMin: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  gradientClass: string;
  eventTitle?: string;
}

const ARTICLES: ArticleSeed[] = [
  // ── Article 1 ──────────────────────────────────────────────
  {
    title: "Où dormir pendant la Foire d'Afrique Paris 2026 ?",
    slug: "ou-dormir-foire-afrique-paris-2026",
    excerpt:
      "Hôtels, Airbnb, auberges : notre sélection des meilleurs hébergements à proximité de l'Espace MAS pour la Foire d'Afrique Paris les 1er et 2 mai 2026.",
    category: "LIFESTYLE",
    readingTimeMin: 4,
    tags: ["foire d'afrique", "hébergement paris", "hôtel paris 13e", "airbnb paris"],
    metaTitle: "Où dormir pendant la Foire d'Afrique Paris 2026 ? Hôtels & Airbnb",
    metaDescription:
      "Trouvez l'hébergement idéal pour la Foire d'Afrique Paris 2026. Hôtels proches de l'Espace MAS, Airbnb, auberges — notre guide complet.",
    seoKeywords: [
      "hôtel foire afrique paris 2026",
      "hébergement espace MAS paris 13",
      "où dormir paris mai 2026",
      "airbnb paris 13e",
    ],
    gradientClass: "g1",
    eventTitle: "Foire d'Afrique",
    content: `
<p>La <strong>Foire d'Afrique Paris</strong> revient les 1er et 2 mai 2026 à l'Espace MAS (Paris 13e). Deux jours de découvertes culturelles, gastronomiques et artisanales qui attirent chaque année des milliers de visiteurs. Voici notre sélection pour trouver le logement parfait à proximité.</p>

<h2>Hôtels proches de l'Espace MAS</h2>
<p>L'Espace MAS est situé au 10 rue Françoise Dolto, dans le 13e arrondissement. Le quartier Bibliothèque-Austerlitz offre un bon choix d'hôtels à tous les prix.</p>

<h3>Notre sélection</h3>
<p><strong>Novotel Paris Gare de Lyon</strong> — 4 étoiles, 10 minutes en métro. Rooftop avec vue, petit-déjeuner buffet copieux. Idéal pour les familles. <a href="https://www.booking.com/searchresults.html?ss=Novotel+Paris+Gare+de+Lyon" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les disponibilités sur Booking.com</a>.</p>
<p><strong>Hôtel Henriette</strong> — Boutique-hôtel de charme dans le 13e, à quelques rues de l'événement. Déco soignée, jardin intérieur, ambiance intime. <a href="https://www.booking.com/searchresults.html?ss=Hotel+Henriette+Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Booking.com</a>.</p>
<p><strong>ibis Paris Bibliothèque</strong> — Pour les petits budgets, cet ibis est littéralement à côté. Propre, fonctionnel, imbattable sur le rapport qualité-prix. <a href="https://www.booking.com/searchresults.html?ss=ibis+Paris+Bibliotheque" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir sur Booking.com</a>.</p>

<h2>Logements Airbnb autour du 13e</h2>
<p>Pour un séjour plus immersif, les appartements du 13e offrent une expérience locale authentique. Le quartier est vivant, avec le marché Jeanne d'Arc et de nombreux restaurants.</p>
<p><a href="https://www.airbnb.fr/s/Paris-13e-arrondissement/homes?checkin=2026-05-01&checkout=2026-05-03" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les logements Airbnb dans le 13e pour le week-end de la Foire</a>.</p>

<h2>Conseils pratiques</h2>
<ul>
  <li><strong>Réservez tôt</strong> — Le 1er mai est un jour férié, les hôtels se remplissent vite.</li>
  <li><strong>Privilégiez les lignes 14, 6 ou le RER C</strong> — Stations Bibliothèque François Mitterrand ou Olympiades.</li>
  <li><strong>Comparez toujours</strong> — Les prix varient fortement entre Booking et Airbnb selon la période.</li>
</ul>

<h2>Réservez vos billets</h2>
<p>Votre hébergement est trouvé ? Il ne reste plus qu'à réserver vos places pour la Foire d'Afrique Paris 2026.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris">Acheter mes billets pour la Foire d'Afrique Paris 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 2 ──────────────────────────────────────────────
  {
    title: "Se détendre après la Fashion Week Africa : les meilleurs spas de Paris",
    slug: "meilleurs-spas-paris-fashion-week-africa-2026",
    excerpt:
      "Hammams, massages, soins du visage : notre sélection des meilleurs spas parisiens pour récupérer après une journée de défilés.",
    category: "LIFESTYLE",
    readingTimeMin: 4,
    tags: ["spa paris", "bien-être", "fashion week africa", "hammam paris", "détente"],
    metaTitle: "Les meilleurs spas de Paris après la Fashion Week Africa 2026",
    metaDescription:
      "Hammams, massages, soins : découvrez les meilleurs spas de Paris pour se détendre après la Fashion Week Africa 2026. Réservez en ligne.",
    seoKeywords: [
      "spa paris 2026",
      "hammam paris",
      "massage paris",
      "détente fashion week",
      "bien-être paris",
    ],
    gradientClass: "g4",
    eventTitle: "Fashion Week Africa",
    content: `
<p>Après une journée intense de défilés, de rencontres et d'émotions à la <strong>Fashion Week Africa Paris 2026</strong>, rien de tel qu'un moment de détente pour recharger les batteries. Paris regorge de spas et hammams d'exception. Voici notre sélection.</p>

<h2>Les hammams incontournables</h2>

<h3>Spa Mosaic — 1er arrondissement</h3>
<p>Un hammam contemporain aux inspirations africaines et orientales. Gommage au savon noir, massage à l'huile d'argan, salle de repos avec thé à la menthe. Un voyage sensoriel au cœur de Paris.</p>
<p><a href="https://www.treatwell.fr/salons/spa/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver un soin sur Treatwell</a>.</p>

<h3>Les Bains du Marais — 4e arrondissement</h3>
<p>Institution parisienne du bien-être depuis 25 ans. Hammam traditionnel, bassin froid, espace détente. L'adresse parfaite pour un après-midi cocooning entre amis après les défilés.</p>

<h3>Hammam MedCenter Spa — 15e arrondissement</h3>
<p>Un espace de 1 000 m² dédié au bien-être. Hammam, jacuzzi, sauna, modelages. Formules duo idéales pour un moment de complicité.</p>

<h2>Coffrets bien-être à offrir</h2>
<p>Vous cherchez un cadeau pour accompagner un billet Fashion Week Africa ? Les coffrets spa sont le combo parfait :</p>
<ul>
  <li><strong>Coffret "Spa d'Exception"</strong> — Accès spa + modelage dans un lieu premium. <a href="https://www.wonderbox.fr/coffret-cadeau/spa-et-soin/" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les coffrets Wonderbox</a>.</li>
  <li><strong>Coffret "Duo Détente"</strong> — Hammam + massage pour deux personnes. Idéal en couple ou entre amis.</li>
</ul>

<h2>Réserver en ligne</h2>
<p>La plupart de ces spas sont réservables en quelques clics. Comparez les prix et créneaux sur <a href="https://www.treatwell.fr/salons/spa/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Treatwell</a> pour trouver le soin idéal à votre budget.</p>

<h2>Combinez mode et bien-être</h2>
<p>La Fashion Week Africa, c'est le 3 octobre 2026 à l'Espace MAS. Réservez votre billet et planifiez votre séance spa pour le lendemain — vous l'aurez mérité.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/fashion-week-africa">Réserver mes places Fashion Week Africa 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 3 ──────────────────────────────────────────────
  {
    title: "Comment venir à Paris depuis Londres pour la Foire d'Afrique 2026",
    slug: "venir-paris-depuis-londres-foire-afrique-2026",
    excerpt:
      "Eurostar, avion, bus : toutes les options pour rejoindre Paris depuis Londres pour la Foire d'Afrique les 1er et 2 mai 2026.",
    category: "LIFESTYLE",
    readingTimeMin: 4,
    tags: ["eurostar", "londres paris", "transport", "foire d'afrique", "voyage"],
    metaTitle: "Londres → Paris pour la Foire d'Afrique 2026 : Eurostar, avion, bus",
    metaDescription:
      "Comment venir à Paris depuis Londres pour la Foire d'Afrique 2026 ? Eurostar, avion, bus — comparatif prix et durée.",
    seoKeywords: [
      "eurostar londres paris 2026",
      "foire afrique paris depuis londres",
      "voyage londres paris pas cher",
      "transport foire afrique",
    ],
    gradientClass: "g5",
    eventTitle: "Foire d'Afrique",
    content: `
<p>La diaspora africaine de Londres est l'une des plus importantes d'Europe, et la <strong>Foire d'Afrique Paris</strong> attire chaque année de nombreux visiteurs britanniques. Voici comment organiser votre trajet pour les 1er et 2 mai 2026.</p>

<h2>Option 1 : l'Eurostar (notre recommandation)</h2>
<p>Le moyen le plus rapide et le plus confortable. Londres St Pancras → Paris Gare du Nord en <strong>2h15</strong>, centre-ville à centre-ville.</p>
<ul>
  <li><strong>Prix :</strong> à partir de 39€ l'aller simple (réservez 2-3 mois à l'avance)</li>
  <li><strong>Fréquence :</strong> jusqu'à 18 trains par jour</li>
  <li><strong>Avantage :</strong> pas de contrôle liquides, bagages illimités, WiFi à bord</li>
</ul>
<p><a href="https://www.eurostar.com/fr-fr" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Eurostar.com</a></p>

<h2>Option 2 : le train via Trainline</h2>
<p>Trainline compare les prix de tous les opérateurs ferroviaires (Eurostar, SNCF, Ouigo). Vous pouvez parfois trouver des combinaisons moins chères en passant par Lille ou Bruxelles.</p>
<p><a href="https://www.thetrainline.com/fr/destinations/trains-pour-paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Comparer les billets sur Trainline</a></p>

<h2>Option 3 : l'avion</h2>
<p>Les vols low-cost (easyJet, Ryanair) proposent des tarifs dès 25€, mais attention aux frais cachés (bagages, transfert aéroport). Comptez 1h de vol + 1h de transfert de chaque côté.</p>
<ul>
  <li><strong>Aéroports :</strong> Luton/Gatwick/Stansted → Charles de Gaulle/Orly</li>
  <li><strong>Budget réel :</strong> 60-120€ aller-retour tout compris</li>
</ul>

<h2>Se déplacer à Paris</h2>
<p>Une fois à Paris, le métro et le RER vous emmènent partout. Pour plus de flexibilité (notamment si vous venez en groupe), pensez à la location de voiture :</p>
<p><a href="https://www.rentalcars.com/fr/city/fr/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Comparer les tarifs sur Rentalcars.com</a> — annulation gratuite sur la plupart des réservations.</p>

<h2>Notre conseil</h2>
<p>Réservez votre Eurostar au moins 8 semaines à l'avance pour obtenir les meilleurs tarifs. Le 1er mai est un jour férié en France : les trains se remplissent vite.</p>

<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris">Réserver mes billets pour la Foire d'Afrique Paris 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 4 ──────────────────────────────────────────────
  {
    title: "Louer une voiture à Paris : guide pratique pour la diaspora",
    slug: "louer-voiture-paris-guide-diaspora-2026",
    excerpt:
      "Permis étranger, assurance, comparateurs : tout ce qu'il faut savoir pour louer une voiture à Paris quand on vient de l'étranger.",
    category: "LIFESTYLE",
    readingTimeMin: 5,
    tags: ["location voiture", "paris", "diaspora", "transport", "permis étranger"],
    metaTitle: "Louer une voiture à Paris : guide pratique pour la diaspora 2026",
    metaDescription:
      "Permis étranger, assurance, comparateurs de prix : guide complet pour louer une voiture à Paris en 2026. Conseils pour la diaspora africaine.",
    seoKeywords: [
      "louer voiture paris 2026",
      "location voiture paris diaspora",
      "permis étranger france location voiture",
      "rentalcars paris",
    ],
    gradientClass: "g6",
    content: `
<p>Vous venez à Paris pour un événement de la <strong>Saison Culturelle Africaine</strong> et vous souhaitez louer une voiture ? Que vous arriviez d'Afrique, de Londres ou d'une autre ville européenne, voici tout ce qu'il faut savoir.</p>

<h2>Permis de conduire : ce qui est accepté</h2>
<ul>
  <li><strong>Permis européen (UE/EEE) :</strong> accepté sans formalité.</li>
  <li><strong>Permis britannique (post-Brexit) :</strong> accepté pour les séjours de moins de 12 mois.</li>
  <li><strong>Permis africain :</strong> accepté avec un <strong>permis international</strong> (à demander dans votre pays avant le départ).</li>
  <li><strong>Âge minimum :</strong> 21 ans chez la plupart des loueurs (25 ans pour éviter les surcharges jeune conducteur).</li>
</ul>

<h2>Où comparer les prix ?</h2>
<p>Le meilleur réflexe est d'utiliser un comparateur qui agrège les offres de tous les loueurs (Europcar, Hertz, Sixt, Enterprise, etc.) :</p>
<p><a href="https://www.rentalcars.com/fr/city/fr/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Rentalcars.com — Comparer les offres à Paris</a></p>
<ul>
  <li>Annulation gratuite sur la plupart des réservations</li>
  <li>Assurance complète disponible à la réservation</li>
  <li>Retrait en gare, aéroport ou en ville</li>
</ul>

<h2>Nos conseils</h2>
<ul>
  <li><strong>Réservez à l'avance</strong> — Les tarifs augmentent de 30 à 50% la dernière semaine.</li>
  <li><strong>Prenez l'assurance complète</strong> — Elle couvre les dommages, le vol et le bris de glace. La tranquillité n'a pas de prix.</li>
  <li><strong>Attention aux ZFE</strong> — Paris a une Zone à Faibles Émissions. Vérifiez que le véhicule a une vignette Crit'Air valide.</li>
  <li><strong>Stationnement</strong> — Préférez les parkings souterrains (Saemes, Indigo). Le stationnement de surface est cher et très contrôlé.</li>
</ul>

<h2>Alternatives à la voiture</h2>
<p>Pour les trajets ponctuels, pensez aussi aux VTC (Uber, Bolt) ou aux transports en commun. Paris est très bien desservi par le métro, le RER et le bus.</p>
<p>Pour les trajets longue distance, <a href="https://www.thetrainline.com/fr/destinations/trains-pour-paris" target="_blank" rel="noopener noreferrer nofollow sponsored">comparez les billets de train sur Trainline</a>.</p>

<h2>Préparez votre séjour culturel</h2>
<p>Votre voiture est réservée ? Découvrez le programme complet de la Saison Culturelle Africaine 2026.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir tous les événements de la Saison Culturelle Africaine</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 5 ──────────────────────────────────────────────
  {
    title: "Les meilleurs restaurants africains à Paris en 2026",
    slug: "meilleurs-restaurants-africains-paris-2026",
    excerpt:
      "De la cuisine sénégalaise au mafé congolais en passant par l'afro-fusion : notre guide des meilleures tables africaines de Paris.",
    category: "CULTURE",
    readingTimeMin: 5,
    tags: ["restaurants africains", "paris", "gastronomie", "cuisine africaine", "thefork"],
    metaTitle: "Les 10 meilleurs restaurants africains à Paris en 2026",
    metaDescription:
      "Découvrez les meilleurs restaurants africains de Paris en 2026 : cuisine sénégalaise, ivoirienne, congolaise, éthiopienne et afro-fusion. Réservez en ligne.",
    seoKeywords: [
      "restaurant africain paris 2026",
      "meilleur restaurant africain paris",
      "cuisine africaine paris",
      "restaurant sénégalais paris",
      "afro fusion paris",
    ],
    gradientClass: "g7",
    content: `
<p>Paris est devenue la capitale européenne de la gastronomie africaine. Des cantines populaires aux tables gastronomiques, la scène culinaire africaine n'a jamais été aussi riche et diversifiée. Voici notre sélection des meilleures adresses en 2026.</p>

<h2>Cuisine d'Afrique de l'Ouest</h2>

<h3>Le Petit Dakar — 10e arrondissement</h3>
<p>L'adresse incontournable pour un thiéboudienne ou un yassa poulet authentique. Ambiance conviviale, portions généreuses, prix doux. Le midi, la file d'attente témoigne de la qualité.</p>

<h3>Afrik'N'Fusion — 11e arrondissement</h3>
<p>Le chef revisite les classiques ouest-africains avec une touche contemporaine. Mafé de veau confit, attiéké au saumon, plantains caramélisés. Une expérience gustative unique.</p>

<h3>Chez Fatoumata — 18e arrondissement</h3>
<p>Cuisine guinéenne familiale dans une ambiance chaleureuse. Le riz gras du dimanche est un événement en soi. Réservation conseillée le week-end.</p>

<h2>Cuisine d'Afrique centrale</h2>

<h3>Le Plat Pays — 20e arrondissement</h3>
<p>Spécialités congolaises : pondu, liboke de poisson, chikwangue. Un voyage culinaire au cœur de Kinshasa sans quitter Paris.</p>

<h3>La Table de Yaoundé — 19e arrondissement</h3>
<p>Ndolé, eru, poisson braisé : la cuisine camerounaise dans toute sa richesse. Cadre simple mais saveurs authentiques.</p>

<h2>Afro-fusion et gastronomique</h2>

<h3>Chez Ly — 8e arrondissement</h3>
<p>Gastronomie africaine revisitée dans un cadre élégant près des Champs-Élysées. Le chef mêle techniques françaises et saveurs africaines. Parfait pour une soirée spéciale.</p>

<h3>Mama Africa — 3e arrondissement</h3>
<p>Brunch afro le dimanche, cocktails aux fruits tropicaux, ambiance musicale. L'adresse tendance du Marais pour la diaspora.</p>

<h2>Réservez en ligne et économisez</h2>
<p>La plupart de ces restaurants sont disponibles sur TheFork avec des réductions allant jusqu'à -50% sur la carte :</p>
<p><a href="https://www.thefork.fr/recherche?cityId=415144&what=restaurant+africain" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les restaurants africains à Paris sur TheFork</a></p>

<h2>Découvrez aussi nos événements</h2>
<p>La gastronomie est au cœur de la Saison Culturelle Africaine. La <strong>Foire d'Afrique Paris</strong> propose un village gastronomique avec des traiteurs de toute l'Afrique.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris">Découvrir la Foire d'Afrique Paris 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 6 ──────────────────────────────────────────────
  {
    title: "Activités culturelles à faire à Paris en mai 2026",
    slug: "activites-culturelles-paris-mai-2026",
    excerpt:
      "Musées, balades, croisières, spectacles : les meilleures activités culturelles à Paris autour de la Foire d'Afrique en mai 2026.",
    category: "CULTURE",
    readingTimeMin: 5,
    tags: ["activités paris", "culture", "musées paris", "mai 2026", "tourisme"],
    metaTitle: "Activités culturelles à Paris en mai 2026 : notre sélection",
    metaDescription:
      "Que faire à Paris en mai 2026 ? Musées, balades, croisières, spectacles — notre sélection d'activités culturelles à combiner avec la Foire d'Afrique.",
    seoKeywords: [
      "activités paris mai 2026",
      "que faire paris mai 2026",
      "musée paris culture africaine",
      "sortir paris mai",
      "croisière seine paris",
    ],
    gradientClass: "g8",
    eventTitle: "Foire d'Afrique",
    content: `
<p>Vous venez à Paris pour la <strong>Foire d'Afrique</strong> les 1er et 2 mai 2026 ? Profitez de votre séjour pour explorer la richesse culturelle de la capitale. Mai est le mois idéal : les jours sont longs, les terrasses ouvertes, et l'offre culturelle à son apogée.</p>

<h2>Musées et expositions</h2>

<h3>Musée du Quai Branly — Jacques Chirac</h3>
<p>Le temple des arts premiers. Collections permanentes d'art africain, océanien et amérindien. Les expositions temporaires sont toujours d'une qualité exceptionnelle. Comptez 2 à 3 heures de visite.</p>

<h3>Institut du Monde Arabe</h3>
<p>Architecture spectaculaire et expositions qui font le pont entre cultures africaines et arabes. La terrasse offre une vue imprenable sur Notre-Dame.</p>

<h3>Musée de l'Homme</h3>
<p>Au Trocadéro, un parcours passionnant sur l'histoire de l'humanité avec une place importante donnée aux civilisations africaines.</p>

<h2>Balades et street art</h2>
<ul>
  <li><strong>Belleville et Ménilmontant</strong> — Fresques murales d'artistes africains et afro-descendants, galeries émergentes, cafés multiculturels.</li>
  <li><strong>Château Rouge et la Goutte d'Or</strong> — Le "Little Africa" parisien. Marché Dejean, boutiques de tissus wax, ambiance unique.</li>
  <li><strong>Le Marais</strong> — Galeries d'art contemporain africain, concept stores, architecture historique.</li>
</ul>

<h2>Croisières et expériences</h2>
<p>Une croisière sur la Seine reste un classique incontournable, surtout au coucher du soleil en mai :</p>
<p><a href="https://www.getyourguide.fr/paris-l16/?q=croisiere+seine" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver une croisière sur GetYourGuide</a></p>
<p>Pour des expériences plus originales (ateliers cuisine africaine, food tours, spectacles) :</p>
<p><a href="https://www.viator.com/fr-FR/Paris/d479-ttd" target="_blank" rel="noopener noreferrer nofollow sponsored">Découvrir les expériences Viator à Paris</a></p>

<h2>Spectacles et concerts</h2>
<p>Mai est un mois riche en programmation. Consultez l'agenda des salles parisiennes sur <a href="https://www.fnacspectacles.com/place-de-spectacle/lieu-paris-paris-pariszo1.htm" target="_blank" rel="noopener noreferrer nofollow sponsored">Fnac Spectacles</a> pour trouver un concert ou un spectacle à combiner avec votre visite à la Foire d'Afrique.</p>

<h2>La Foire d'Afrique : le point de départ</h2>
<p>Commencez votre week-end culturel par la Foire d'Afrique Paris — artisanat, gastronomie, musique, danse — puis explorez Paris les jours suivants.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris">Réserver mes billets pour la Foire d'Afrique Paris 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 8 ──────────────────────────────────────────────
  {
    title: "Nos coups de cœur hôtels boutique pour un séjour culturel à Paris",
    slug: "hotels-boutique-sejour-culturel-paris-2026",
    excerpt:
      "Hôtels de charme, adresses secrètes, design unique : notre sélection des meilleurs hôtels boutique de Paris pour un séjour culturel inoubliable.",
    category: "LIFESTYLE",
    readingTimeMin: 5,
    tags: ["hôtels boutique", "paris", "séjour culturel", "hôtel charme", "design"],
    metaTitle: "Hôtels boutique à Paris : nos coups de cœur pour un séjour culturel 2026",
    metaDescription:
      "Découvrez nos hôtels boutique préférés à Paris pour un séjour culturel en 2026. Design, charme et emplacement idéal près des événements DTA.",
    seoKeywords: [
      "hôtel boutique paris 2026",
      "hôtel charme paris",
      "hôtel design paris",
      "séjour culturel paris hôtel",
      "meilleur hôtel paris",
    ],
    gradientClass: "g10",
    content: `
<p>Pour un séjour culturel à Paris, le choix de l'hôtel fait partie de l'expérience. Oubliez les chaînes impersonnelles : Paris regorge d'hôtels boutique qui racontent une histoire, à quelques stations de métro de nos événements.</p>

<h2>Rive gauche — Près de l'Espace MAS</h2>

<h3>Hôtel Henriette — 13e arrondissement</h3>
<p>Notre favori pour les visiteurs de la Foire d'Afrique et de la Fashion Week Africa. Déco scandinave-bohème, jardin intérieur secret, petit-déjeuner avec produits bio. À 10 minutes à pied de l'Espace MAS.</p>
<p><a href="https://www.booking.com/searchresults.html?ss=Hotel+Henriette+Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les disponibilités sur Booking.com</a></p>

<h3>OFF Paris Seine — 13e arrondissement</h3>
<p>Le premier hôtel flottant de Paris, amarré sur la Seine. Chambres avec vue sur l'eau, bar lounge, piscine. Une expérience unique pour un séjour mémorable.</p>
<p><a href="https://www.booking.com/searchresults.html?ss=OFF+Paris+Seine" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Booking.com</a></p>

<h2>Le Marais — Art et culture</h2>

<h3>Hôtel du Petit Moulin — 3e arrondissement</h3>
<p>Ancien boulangerie du 17e siècle transformée en hôtel par Christian Lacroix. Chaque chambre est une œuvre d'art. Idéal pour les amateurs de mode qui viennent à la Fashion Week Africa.</p>
<p><a href="https://www.booking.com/searchresults.html?ss=Hotel+du+Petit+Moulin+Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir sur Booking.com</a></p>

<h3>Hôtel Jules & Jim — 3e arrondissement</h3>
<p>Design contemporain, cour intérieure avec bar, emplacement parfait pour explorer le Marais et ses galeries d'art africain contemporain.</p>

<h2>Montmartre — Charme et authenticité</h2>

<h3>Le Relais Montmartre — 18e arrondissement</h3>
<p>Tout près de Château Rouge et du quartier africain de Paris. Chambres cosy, terrasse fleurie, ambiance village. Le point de départ idéal pour explorer le Paris africain.</p>
<p><a href="https://www.booking.com/searchresults.html?ss=Le+Relais+Montmartre+Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Booking.com</a></p>

<h2>Conseils pour bien réserver</h2>
<ul>
  <li><strong>Booking.com</strong> offre souvent l'annulation gratuite — réservez tôt et ajustez plus tard.</li>
  <li><strong>Les week-ends d'événements</strong> se remplissent vite : réservez 2 à 3 mois à l'avance.</li>
  <li><strong>Utilisez les filtres</strong> "hôtel boutique" et "petit hôtel de charme" sur Booking pour affiner.</li>
</ul>
<p><a href="https://www.booking.com/searchresults.html?ss=Paris&nflt=ht_id%3D204" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir tous les hôtels boutique à Paris sur Booking.com</a></p>

<h2>Réservez vos billets</h2>
<p>Votre hôtel est trouvé ? Il ne reste plus qu'à choisir votre événement préféré parmi la Saison Culturelle Africaine 2026.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir tous les événements DTA 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },
];

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (!admin) {
    console.error("Aucun utilisateur ADMIN trouvé.");
    process.exit(1);
  }

  // Fetch all published events for linking
  const events = await prisma.event.findMany({
    where: { published: true },
    select: { id: true, title: true },
  });

  let created = 0;
  let skipped = 0;

  for (const article of ARTICLES) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      console.log(`⏭️  Déjà existant : ${article.slug}`);
      skipped++;
      continue;
    }

    // Try to match event
    let eventId: string | undefined;
    if (article.eventTitle) {
      const matched = events.find((e) =>
        e.title.toLowerCase().includes(article.eventTitle!.toLowerCase())
      );
      if (matched) eventId = matched.id;
    }

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        status: "PUBLISHED",
        publishedAt: new Date(),
        featured: false,
        source: "manual",
        authorId: admin.id,
        readingTimeMin: article.readingTimeMin,
        tags: article.tags,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        seoKeywords: article.seoKeywords,
        gradientClass: article.gradientClass,
        ...(eventId && { eventId }),
      },
    });

    console.log(`✅ Créé : ${article.slug}`);
    created++;
  }

  console.log(`\nTerminé : ${created} créés, ${skipped} ignorés.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
