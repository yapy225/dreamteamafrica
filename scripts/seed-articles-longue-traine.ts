/**
 * Insertion des 5 articles longue traîne affiliés — Sprint 2
 *
 * 1. Guide coiffure afro (Treatwell)
 * 2. 10 expériences africaines à offrir (Wonderbox + GetYourGuide)
 * 3. Brunchs africains Paris (TheFork)
 * 4. Bruxelles → Paris Saison Culturelle (Eurostar + Trainline)
 * 5. Sorties famille culture africaine (Viator + Fnac Spectacles)
 *
 * Usage : npx tsx scripts/seed-articles-longue-traine.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ArticleSeed {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "LIFESTYLE" | "CULTURE" | "BUSINESS" | "ACTUALITE" | "DIASPORA";
  readingTimeMin: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  gradientClass: string;
  eventTitle?: string;
}

const ARTICLES: ArticleSeed[] = [
  // ── Article 1 — Coiffure afro / Treatwell ──────────────────
  {
    title: "Guide coiffure afro : les meilleurs salons de tresses à Paris en 2026",
    slug: "meilleurs-salons-tresses-coiffure-afro-paris-2026",
    excerpt:
      "Tresses, locks, tissages, coupe afro : notre sélection des meilleurs salons de coiffure afro à Paris, quartier par quartier.",
    category: "LIFESTYLE",
    readingTimeMin: 6,
    tags: ["coiffure afro", "tresses paris", "salon afro", "beauté", "cheveux naturels", "nappy"],
    metaTitle: "Les meilleurs salons de coiffure afro et tresses à Paris en 2026",
    metaDescription:
      "Tresses, locks, tissages, coupe naturelle : découvrez les meilleurs salons de coiffure afro à Paris en 2026. Réservez en ligne sur Treatwell.",
    seoKeywords: [
      "salon coiffure afro paris",
      "tresse africaine paris",
      "coiffeur afro paris",
      "salon tresses paris 18e",
      "coiffure afro paris pas cher",
      "locks paris",
      "tissage paris",
      "nappy paris",
    ],
    gradientClass: "g2",
    content: `
<p>Trouver un bon salon de coiffure afro à Paris peut être un vrai parcours du combattant. Entre les salons sans rendez-vous qui vous font attendre trois heures et ceux dont les tarifs s'envolent, il n'est pas toujours facile de s'y retrouver. Voici notre guide des meilleures adresses, testées et approuvées par la communauté.</p>

<h2>Château Rouge et Goutte d'Or — Le quartier historique</h2>
<p>Le 18e arrondissement reste le cœur battant de la coiffure afro à Paris. Autour du métro Château Rouge, des dizaines de salons proposent tresses, tissages et soins capillaires.</p>

<h3>Les Doigts de Fée — 18e</h3>
<p>Institution du quartier depuis plus de 15 ans. Spécialiste des tresses collées, des nattes plaquées et des box braids. Service rapide, mains expertes, tarifs raisonnables. Comptez 40 à 80€ selon la complexité.</p>

<h3>Afro Hair Studio — 18e</h3>
<p>Salon moderne qui allie techniques traditionnelles et tendances actuelles. Tresses, vanilles, crochet braids, mais aussi soins hydratants et traitements protéinés pour cheveux naturels. Ambiance chaleureuse, prise de rendez-vous recommandée.</p>

<h3>Maison Boucles — 18e</h3>
<p>Le salon référence pour les cheveux naturels (nappy). Coupe, coloration, définition de boucles, twist-out. Les coiffeuses prennent le temps de comprendre votre type de cheveux (3A à 4C) avant de proposer un soin adapté.</p>

<h2>Le Marais et Bastille — L'afro chic</h2>

<h3>Curl Studio — 3e arrondissement</h3>
<p>Salon haut de gamme spécialisé dans les cheveux texturés. Big chop, coloration, soins kératine pour cheveux afro. L'adresse pour un résultat professionnel dans un cadre design.</p>

<h3>Boucles & Moi — 11e arrondissement</h3>
<p>Petit salon intimiste près de Bastille. Spécialité : les coiffures protectrices (tresses, vanilles, twists) avec des produits naturels. Idéal avant un événement comme la Fashion Week Africa.</p>

<h2>Châtelet et Opéra — Le centre</h2>

<h3>The Nappy Hair Shop — 1er arrondissement</h3>
<p>Boutique-salon qui combine vente de produits capillaires afro et prestation coiffure. Diagnostic capillaire offert, conseils personnalisés, soins à base de beurre de karité et d'huile de baobab.</p>

<h2>Saint-Denis et banlieue nord — Les bons plans</h2>
<p>Pour des tarifs plus accessibles, les salons de Saint-Denis et Aubervilliers proposent des prestations de qualité à des prix 20 à 30% inférieurs à Paris intra-muros. Le RER B (Gare du Nord en 10 min) rend ces adresses très accessibles.</p>

<h2>Réservez en ligne</h2>
<p>Fini les heures d'attente sans rendez-vous. De plus en plus de salons afro parisiens sont réservables en ligne :</p>
<p><a href="https://www.treatwell.fr/salons/soin-tressage/offre-type-local/dans-paris-france/" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver un soin tressage à Paris sur Treatwell</a></p>
<p><a href="https://www.treatwell.fr/salons/coiffure-afro/dans-paris-france/" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir tous les salons coiffure afro sur Treatwell</a></p>
<ul>
  <li>Réservation en 2 clics avec créneau garanti</li>
  <li>Avis clients vérifiés pour choisir en confiance</li>
  <li>Annulation gratuite jusqu'à 24h avant</li>
</ul>

<h2>Nos conseils avant votre rendez-vous</h2>
<ul>
  <li><strong>Venez les cheveux propres et démêlés</strong> — La plupart des salons facturent un supplément pour le lavage et le démêlage.</li>
  <li><strong>Apportez des photos de référence</strong> — Montrez exactement ce que vous voulez, surtout pour les tresses.</li>
  <li><strong>Prévoyez du temps</strong> — Comptez 2 à 6 heures selon la coiffure (tresses longues = session marathon).</li>
  <li><strong>Demandez les tarifs à l'avance</strong> — Les prix varient beaucoup selon la longueur et la complexité.</li>
</ul>

<h2>Préparez votre look pour la Saison Culturelle</h2>
<p>Fashion Week Africa, Foire d'Afrique, Évasion Paris... La Saison Culturelle Africaine 2026 est l'occasion parfaite pour une nouvelle coiffure. Réservez votre salon, puis réservez vos billets.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir les événements de la Saison Culturelle Africaine 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 2 — Expériences à offrir / Wonderbox + GetYourGuide ──
  {
    title: "10 expériences africaines à offrir à Paris en 2026",
    slug: "experiences-africaines-offrir-paris-2026",
    excerpt:
      "Atelier cuisine africaine, spectacle de conte, visite guidée de la « Little Africa » parisienne : 10 idées cadeaux originales autour de la culture africaine.",
    category: "CULTURE",
    readingTimeMin: 5,
    tags: ["idée cadeau", "expérience africaine", "paris", "atelier cuisine", "culture", "coffret cadeau"],
    metaTitle: "10 expériences africaines à offrir à Paris — Idées cadeaux 2026",
    metaDescription:
      "Atelier cuisine, spectacle de conte, visite Little Africa, coffret spa : 10 expériences africaines originales à offrir à Paris en 2026.",
    seoKeywords: [
      "expérience africaine paris",
      "idée cadeau culture africaine",
      "atelier cuisine africaine paris",
      "coffret cadeau africain paris",
      "visite guidée little africa paris",
      "spectacle africain paris",
    ],
    gradientClass: "g9",
    content: `
<p>Vous cherchez un cadeau original pour un anniversaire, Noël ou simplement pour faire plaisir ? Paris regorge d'expériences liées à la culture africaine — bien plus mémorables qu'un objet. Voici nos 10 coups de cœur.</p>

<h2>1. Atelier cuisine africaine</h2>
<p>Apprenez à préparer un mafé, un thiéboudienne ou des beignets de banane plantain avec un chef d'origine africaine. Les ateliers durent 2 à 3 heures et se terminent par une dégustation conviviale.</p>
<p><a href="https://www.wonderbox.fr/loisirs-et-sorties/c/155598/NW-6488-cookingtype~africaine" target="_blank" rel="noopener noreferrer nofollow sponsored">Offrir un atelier cuisine africaine sur Wonderbox</a></p>

<h2>2. Visite guidée « Little Africa »</h2>
<p>Découvrez le Paris africain avec un guide passionné : Château Rouge, la Goutte d'Or, les marchés, les boutiques de tissus wax, les salons de coiffure, l'histoire de l'immigration africaine. Un voyage dans Paris que la plupart des Parisiens ne connaissent pas.</p>
<p><a href="https://www.getyourguide.fr/paris-l16/?q=afrique" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les visites guidées sur GetYourGuide</a></p>

<h2>3. Spectacle de conte africain</h2>
<p>Le <strong>Festival du Conte Africain</strong>, organisé par Dream Team Africa, est une expérience magique pour petits et grands. Griots, conteurs et musiciens vous transportent au cœur des traditions orales africaines. Offrir un billet, c'est offrir un voyage.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/festival-du-conte-africain">Réserver pour le Festival du Conte Africain</a></strong></p>

<h2>4. Coffret spa inspiré d'Afrique</h2>
<p>Hammam au savon noir, gommage au rhassoul, massage à l'huile d'argan — les rituels de beauté africains font la joie des spas parisiens. Offrez un coffret détente :</p>
<p><a href="https://www.wonderbox.fr/coffret-cadeau/spa-et-soin/" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les coffrets spa sur Wonderbox</a></p>

<h2>5. Dîner dans un restaurant africain gastronomique</h2>
<p>Offrez une soirée chez <strong>Chez Ly</strong> (8e) ou <strong>Afrik'N'Fusion</strong> (11e) — la gastronomie africaine revisitée dans un cadre élégant. Réservez via TheFork pour bénéficier de réductions :</p>
<p><a href="https://www.thefork.fr/recherche?cityId=415144&what=restaurant+africain" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur TheFork</a></p>

<h2>6. Billet pour la Fashion Week Africa</h2>
<p>Pour les passionnés de mode, un billet Fashion Week Africa est le cadeau rêvé. Défilés de créateurs africains, pop-up stores, networking — une journée immersive dans la mode africaine contemporaine.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/fashion-week-africa">Offrir un billet Fashion Week Africa 2026</a></strong></p>

<h2>7. Cours de danse africaine</h2>
<p>Sabar, coupé-décalé, afrobeats, ndombolo : les cours de danse africaine se multiplient à Paris. Une heure d'énergie pure, de rythme et de bonne humeur. Idéal pour un enterrement de vie de célibataire original.</p>
<p><a href="https://www.getyourguide.fr/paris-l16/?q=danse" target="_blank" rel="noopener noreferrer nofollow sponsored">Trouver un cours de danse sur GetYourGuide</a></p>

<h2>8. Croisière sur la Seine + dîner</h2>
<p>Combinez un classique parisien avec une soirée culturelle africaine. Offrez une croisière, puis enchaînez avec un événement DTA :</p>
<p><a href="https://www.getyourguide.fr/paris-l16/?q=croisiere+diner+seine" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver une croisière-dîner sur GetYourGuide</a></p>

<h2>9. Abonnement L'Afropéen</h2>
<p>Offrez l'accès à <strong>L'Afropéen</strong>, le journal en ligne de la diaspora africaine. Actualités, culture, portraits, musique — tout ce qui fait vibrer la communauté, chaque jour.</p>
<p><strong><a href="https://dreamteamafrica.com/lafropeen">Découvrir L'Afropéen</a></strong></p>

<h2>10. Week-end complet Saison Culturelle</h2>
<p>Le cadeau ultime : un week-end à Paris avec billets pour un événement DTA + hôtel + restaurant + activité. Composez votre programme sur mesure avec notre <a href="https://dreamteamafrica.com/sejour-culturel-africain-paris">guide séjour culturel africain à Paris</a>.</p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 3 — Brunchs africains / TheFork ────────────────
  {
    title: "Les meilleurs brunchs africains à Paris en 2026",
    slug: "meilleurs-brunchs-africains-paris-2026",
    excerpt:
      "Brunch sénégalais, ivoirien, éthiopien ou afro-fusion : notre sélection des meilleurs brunchs africains de Paris pour un dimanche mémorable.",
    category: "CULTURE",
    readingTimeMin: 5,
    tags: ["brunch africain", "paris", "restaurant", "dimanche", "gastronomie africaine", "afro-fusion"],
    metaTitle: "Les meilleurs brunchs africains à Paris en 2026",
    metaDescription:
      "Brunch sénégalais, éthiopien, afro-fusion : découvrez les meilleures adresses pour un brunch africain à Paris en 2026. Réservez en ligne.",
    seoKeywords: [
      "brunch africain paris",
      "brunch afro paris",
      "brunch africain paris dimanche",
      "restaurant brunch paris original",
      "brunch sénégalais paris",
      "brunch éthiopien paris",
    ],
    gradientClass: "g11",
    content: `
<p>Le brunch du dimanche est devenu un rituel sacré à Paris. Mais au-delà des œufs bénédicte et des avocado toasts, une scène brunch africaine vibrante émerge dans la capitale. Voici les adresses qui réinventent le dimanche matin à la sauce afro.</p>

<h2>Les brunchs afro-fusion</h2>

<h3>Mama Africa — 3e arrondissement</h3>
<p>Le brunch le plus hype de la scène afro parisienne. Chaque dimanche de 11h à 16h, Mama Africa propose un buffet généreux : beignets de banane plantain, œufs au piment, poulet yassa, jus de bissap et de gingembre frais, pancakes au beurre de cacahuète. Le tout dans une ambiance musicale afrobeats. Comptez 29€ par personne.</p>

<h3>Afrik'N'Fusion — 11e arrondissement</h3>
<p>Le chef propose un brunch le premier dimanche du mois. Menu fixe en 4 temps : jus tropical, assiette salée (accras, aloco, salade de manioc), plat (thiof grillé ou poulet braisé), et dessert (gâteau à la noix de coco). Réservation indispensable — les places partent en 48h.</p>

<h2>Les brunchs par pays</h2>

<h3>Brunch sénégalais — Le Petit Dakar, 10e</h3>
<p>Le dimanche, Le Petit Dakar sort sa carte brunch : café Touba, pain au lait, omelette aux oignons, fataya (chaussons farcis à la viande), thiéré (couscous de mil au lait). Un vrai petit-déjeuner dakarois à Paris.</p>

<h3>Brunch éthiopien — Addis Abeba, 11e</h3>
<p>L'injera (galette fermentée) remplace le pain de mie. Garnie de tibs (viande sautée), de lentilles épicées et de fromage ayib, elle se partage à la main. Le café éthiopien, torréfié et préparé devant vous dans la tradition de la cérémonie du café, vaut le détour à lui seul.</p>

<h3>Brunch congolais — Chez Maman Paulette, 20e</h3>
<p>Ambiance familiale pour ce brunch du dimanche : beignets kwanga, sardines braisées, bouillie de maïs, fruit de la passion frais. Comme chez maman, mais à Ménilmontant. Arrivez tôt — le bouche-à-oreille fait salle comble.</p>

<h2>Les brunchs d'hôtels avec une touche africaine</h2>
<p>Certains hôtels parisiens proposent des brunchs avec des influences africaines :</p>
<ul>
  <li><strong>Maison Barbès</strong> (18e) — Rooftop avec vue sur le Sacré-Cœur, carte brunch incluant des spécialités du Maghreb et d'Afrique de l'Ouest.</li>
  <li><strong>Mama Shelter Paris East</strong> (20e) — Brunch buffet éclectique avec accents multiculturels, ambiance design et DJ set.</li>
</ul>

<h2>Réservez votre table</h2>
<p>Les brunchs africains sont victimes de leur succès — réservez à l'avance pour être sûr d'avoir une place :</p>
<p><a href="https://www.thefork.fr/recherche?cityId=415144&what=brunch+africain" target="_blank" rel="noopener noreferrer nofollow sponsored">Rechercher un brunch africain sur TheFork</a></p>
<p><a href="https://www.thefork.fr/recherche?cityId=415144&what=brunch+paris&when=dimanche" target="_blank" rel="noopener noreferrer nofollow sponsored">Tous les brunchs du dimanche à Paris sur TheFork</a> — avec jusqu'à -50% sur la carte.</p>

<h2>Brunch + événement DTA</h2>
<p>Planifiez un dimanche parfait : brunch africain le matin, puis un événement de la Saison Culturelle Africaine l'après-midi. La <strong>Foire d'Afrique Paris</strong> (1-2 mai 2026) tombe un week-end — le combo idéal.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir le calendrier des événements 2026</a></strong></p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 4 — Bruxelles → Paris / Eurostar + Trainline ──
  {
    title: "Venir à Paris depuis Bruxelles pour la Saison Culturelle Africaine 2026",
    slug: "bruxelles-paris-saison-culturelle-africaine-2026",
    excerpt:
      "Eurostar, Thalys, covoiturage : comment rejoindre Paris depuis Bruxelles pour les événements de la Saison Culturelle Africaine 2026.",
    category: "DIASPORA",
    readingTimeMin: 4,
    tags: ["bruxelles paris", "eurostar", "transport", "diaspora belgique", "saison culturelle"],
    metaTitle: "Bruxelles → Paris : venir à la Saison Culturelle Africaine 2026",
    metaDescription:
      "Comment venir de Bruxelles à Paris pour la Saison Culturelle Africaine 2026 ? Eurostar, train, bus — guide complet avec les meilleurs tarifs.",
    seoKeywords: [
      "bruxelles paris eurostar 2026",
      "événement africain paris depuis bruxelles",
      "diaspora africaine belgique paris",
      "train bruxelles paris pas cher",
      "foire afrique paris bruxelles",
    ],
    gradientClass: "g5",
    content: `
<p>La diaspora africaine de Belgique est l'une des plus dynamiques d'Europe. Chaque année, des centaines de Bruxellois font le déplacement pour les événements de la <strong>Saison Culturelle Africaine</strong> à Paris. Bonne nouvelle : Bruxelles-Paris, c'est seulement 1h22 en Eurostar. Voici comment organiser votre venue.</p>

<h2>Option 1 : Eurostar / Thalys (notre recommandation)</h2>
<p>Bruxelles-Midi → Paris Gare du Nord en <strong>1h22</strong>. C'est le moyen le plus rapide et le plus confortable, et vous arrivez en plein centre de Paris.</p>
<ul>
  <li><strong>Prix :</strong> à partir de 29€ l'aller simple (tarif Snap)</li>
  <li><strong>Fréquence :</strong> un train toutes les heures environ</li>
  <li><strong>Astuce :</strong> réservez 6 à 8 semaines à l'avance pour les meilleurs tarifs</li>
</ul>
<p><a href="https://www.eurostar.com/fr-fr/train/bruxelles-a-paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Eurostar.com</a></p>

<h2>Option 2 : Trainline (comparer tous les opérateurs)</h2>
<p>Trainline compare Eurostar, SNCF, Ouigo et les bus (FlixBus, BlaBlaCar Bus). Vous pouvez parfois trouver des billets Ouigo à 10€ via Lille :</p>
<p><a href="https://www.thetrainline.com/fr/destinations/trains-de-bruxelles-a-paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Comparer les billets Bruxelles-Paris sur Trainline</a></p>

<h2>Option 3 : bus longue distance</h2>
<p>FlixBus et BlaBlaCar Bus proposent des trajets dès 9,99€. Comptez 3h30 à 4h de trajet. Moins confortable mais imbattable côté budget.</p>

<h2>Option 4 : covoiturage</h2>
<p>BlaBlaCar affiche régulièrement des trajets Bruxelles-Paris entre 15 et 25€. Idéal si vous êtes flexible sur les horaires et que vous aimez les rencontres.</p>

<h2>Se loger à Paris</h2>
<p>Pour un week-end, réservez un hôtel proche de l'événement :</p>
<ul>
  <li><strong>Foire d'Afrique / Fashion Week Africa</strong> → hôtels dans le 13e, près de l'Espace MAS</li>
  <li><strong>Évasion Paris</strong> → hôtels dans le 15e, près de La Seine Musicale</li>
  <li><strong>Festival de l'Autre Culture</strong> → hôtels à Créteil / Val-de-Marne</li>
</ul>
<p><a href="https://www.booking.com/searchresults.html?ss=Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Trouver un hôtel à Paris sur Booking.com</a></p>
<p>Pour les petits budgets : <a href="https://www.airbnb.fr/s/Paris--France/homes" target="_blank" rel="noopener noreferrer nofollow sponsored">logements Airbnb à Paris</a>.</p>

<h2>Le calendrier 2026 à noter</h2>
<p>Voici les dates clés pour planifier vos déplacements :</p>
<ul>
  <li><strong>1-2 mai :</strong> Foire d'Afrique Paris (Espace MAS, Paris 13e)</li>
  <li><strong>13 juin :</strong> Évasion Paris (La Seine)</li>
  <li><strong>27 juin :</strong> Festival de l'Autre Culture (Parc des Épivans)</li>
  <li><strong>3 octobre :</strong> Fashion Week Africa (Espace MAS, Paris 13e)</li>
</ul>

<h2>Réservez maintenant</h2>
<p>Train + hôtel + billet événement = le programme parfait pour un week-end culturel africain à Paris depuis Bruxelles.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine">Voir tous les événements et réserver vos billets</a></strong></p>
<p>Consultez aussi notre <a href="https://dreamteamafrica.com/sejour-culturel-africain-paris">guide complet du séjour culturel africain à Paris</a>.</p>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous.</em></p>
`.trim(),
  },

  // ── Article 5 — Sorties famille / Viator + Fnac Spectacles ──
  {
    title: "Sorties en famille : découvrir la culture africaine à Paris avec les enfants",
    slug: "sorties-famille-culture-africaine-paris-enfants-2026",
    excerpt:
      "Spectacles de conte, ateliers, musées, festivals : les meilleures sorties pour découvrir la culture africaine à Paris en famille.",
    category: "CULTURE",
    readingTimeMin: 5,
    tags: ["sortie famille", "enfants", "culture africaine", "paris", "conte africain", "atelier enfant", "musée"],
    metaTitle: "Sorties famille culture africaine à Paris : nos 10 idées avec les enfants",
    metaDescription:
      "Spectacles de conte, ateliers, musées, festivals : les meilleures sorties pour faire découvrir la culture africaine aux enfants à Paris en 2026.",
    seoKeywords: [
      "sortie famille culture africaine paris",
      "activité enfant africaine paris",
      "spectacle conte africain enfant paris",
      "musée afrique paris enfant",
      "atelier enfant paris multiculturel",
      "sortie enfant paris original",
    ],
    gradientClass: "g12",
    eventTitle: "Festival du Conte",
    content: `
<p>Transmettre la richesse de la culture africaine aux enfants, c'est possible sans prendre l'avion. Paris offre un éventail de sorties culturelles africaines adaptées aux familles. Voici nos meilleures idées pour un week-end mémorable.</p>

<h2>Spectacles et contes</h2>

<h3>Le Festival du Conte Africain</h3>
<p>Organisé par Dream Team Africa, ce festival est <strong>le</strong> rendez-vous familial par excellence. Des griots et conteurs venus de toute l'Afrique racontent les légendes d'Anansi l'araignée, du lièvre et de l'hyène, de Soundjata Keïta... Les enfants sont captivés, les parents aussi. Spectacles adaptés dès 4 ans.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/festival-du-conte-africain">Réserver pour le Festival du Conte Africain</a></strong></p>

<h3>Théâtre de la Ville — Spectacles jeune public</h3>
<p>Le Théâtre de la Ville programme régulièrement des spectacles inspirés de contes africains. Marionnettes, ombres chinoises, danse — des créations visuelles qui parlent aux enfants de tous âges.</p>
<p><a href="https://www.fnacspectacles.com/place-de-spectacle/lieu-paris-paris-pariszo1.htm" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir la programmation jeune public sur Fnac Spectacles</a></p>

<h2>Musées à explorer en famille</h2>

<h3>Musée du Quai Branly — Jacques Chirac</h3>
<p>Le musée propose des parcours famille spécialement conçus pour les enfants de 5 à 12 ans. Masques, instruments de musique, textiles : les collections africaines fascinent les petits. Les ateliers du week-end (modelage, peinture, musique) permettent de mettre les mains dans la matière.</p>
<p><a href="https://www.getyourguide.fr/paris-l16/?q=quai+branly+famille" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver une visite guidée famille au Quai Branly sur GetYourGuide</a></p>

<h3>Musée de l'Homme</h3>
<p>Au Trocadéro, un parcours interactif raconte l'histoire de l'humanité depuis l'Afrique. Les bornes tactiles, les maquettes et les jeux éducatifs captent l'attention des enfants pendant que les parents approfondissent.</p>

<h3>Institut du Monde Arabe — Espace jeunesse</h3>
<p>L'IMA propose un espace dédié aux enfants avec des expositions ludiques sur les cultures du Maghreb et du Sahel. Les ateliers calligraphie et mosaïque sont un succès garanti.</p>

<h2>Ateliers créatifs</h2>

<h3>Ateliers percussion africaine</h3>
<p>Djembé, balafon, kora : plusieurs associations parisiennes proposent des initiations musicales pour enfants dès 5 ans. Une heure de rythme, de rire et de découverte. Cherchez les ateliers ponctuels sur :</p>
<p><a href="https://www.viator.com/fr-FR/Paris/d479-ttd?q=musique" target="_blank" rel="noopener noreferrer nofollow sponsored">Activités musicales à Paris sur Viator</a></p>

<h3>Ateliers cuisine pour enfants</h3>
<p>Certains ateliers proposent des sessions "parent-enfant" autour de la cuisine africaine : beignets de banane plantain, jus de bissap, gâteau à la noix de coco. Ludique et délicieux.</p>
<p><a href="https://www.wonderbox.fr/loisirs-et-sorties/c/155598/NW-6488-cookingtype~africaine" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les ateliers cuisine africaine sur Wonderbox</a></p>

<h2>Balades et plein air</h2>
<ul>
  <li><strong>Jardin d'Agronomie Tropicale</strong> (Bois de Vincennes) — Un lieu méconnu qui raconte l'histoire coloniale avec ses pavillons d'exposition de 1907. Promenade ombragée et dépaysante, entrée gratuite.</li>
  <li><strong>Parc de la Villette</strong> — Grands espaces verts, aires de jeux, Cité des Sciences (expo "Cabanes du monde" avec des habitats africains). Parfait pour combiner culture et défoulement.</li>
  <li><strong>Balade dans Château Rouge</strong> — Les enfants adorent le marché Dejean avec ses fruits exotiques, ses épices colorées et ses tissus chatoyants. Terminez par un jus de gingembre frais.</li>
</ul>

<h2>La Foire d'Afrique : le rendez-vous familial</h2>
<p>La <strong>Foire d'Afrique Paris</strong> (1-2 mai 2026) est pensée pour les familles : village artisanal, espace enfants, démonstrations de danse, cuisine en live. L'entrée est gratuite pour les moins de 12 ans.</p>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris">Réserver pour la Foire d'Afrique Paris 2026</a></strong></p>

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
