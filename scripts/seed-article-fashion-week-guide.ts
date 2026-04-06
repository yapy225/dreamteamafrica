/**
 * Script d'insertion de l'article affilié #7
 * "Guide complet du visiteur : Fashion Week Africa Paris 2026"
 *
 * Usage : npx tsx scripts/seed-article-fashion-week-guide.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "guide-visiteur-fashion-week-africa-paris-2026";

const CONTENT = `
<p>La <strong>Fashion Week Africa Paris 2026</strong> s'annonce comme l'événement mode le plus attendu de la rentrée. Le 3 octobre 2026, l'Espace MAS (Paris 13e) accueillera les créateurs africains les plus audacieux de la scène internationale. Que vous veniez de Paris, de province ou de l'étranger, voici tout ce qu'il faut savoir pour profiter pleinement de cette journée exceptionnelle.</p>

<h2>L'événement en bref</h2>
<p>Organisée par <strong>Dream Team Africa</strong> dans le cadre de la Saison Culturelle Africaine, la Fashion Week Africa réunit chaque année des designers de Dakar, Lagos, Abidjan, Kinshasa et de la diaspora parisienne. Défilés, pop-up stores, masterclasses et networking : une journée complète dédiée à la mode africaine contemporaine.</p>
<ul>
  <li><strong>Date :</strong> samedi 3 octobre 2026</li>
  <li><strong>Lieu :</strong> Espace MAS, 10 rue Françoise Dolto, Paris 13e</li>
  <li><strong>Accès :</strong> Métro Bibliothèque François Mitterrand (L14) ou RER C</li>
</ul>

<h2>Où dormir pendant la Fashion Week Africa ?</h2>
<p>Paris en octobre reste très demandé. Réservez votre hébergement le plus tôt possible pour bénéficier des meilleurs tarifs.</p>

<h3>Nos recommandations hôtels</h3>
<p><strong>Novotel Paris Gare de Lyon</strong> — 4 étoiles, à 10 minutes de l'Espace MAS en métro. Confort moderne, bar rooftop et petit-déjeuner buffet complet. <a href="https://www.booking.com/searchresults.html?ss=Paris+13e&checkin=2026-10-02&checkout=2026-10-04" target="_blank" rel="noopener noreferrer nofollow sponsored">Voir les disponibilités sur Booking.com</a>.</p>
<p><strong>Hôtel Henriette</strong> — Boutique-hôtel intimiste dans le 13e, parfait pour un séjour avec du caractère. Décoration soignée et ambiance chaleureuse. <a href="https://www.booking.com/searchresults.html?ss=Hotel+Henriette+Paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Réserver sur Booking.com</a>.</p>
<p><strong>Logement chez l'habitant</strong> — Pour une immersion dans la vie parisienne, explorez les options sur <a href="https://www.airbnb.fr/s/Paris-13e/homes" target="_blank" rel="noopener noreferrer nofollow sponsored">Airbnb autour du 13e arrondissement</a>.</p>

<h2>Comment venir à Paris ?</h2>

<h3>En train</h3>
<p>Depuis la province ou depuis Londres, le train reste le moyen le plus pratique et écologique.</p>
<ul>
  <li><strong>Depuis la France :</strong> TGV vers Gare de Lyon (à 10 min de l'Espace MAS). <a href="https://www.thetrainline.com/fr/destinations/trains-pour-paris" target="_blank" rel="noopener noreferrer nofollow sponsored">Comparez les billets sur Trainline</a>.</li>
  <li><strong>Depuis Londres :</strong> Eurostar direct vers Gare du Nord (2h15). <a href="https://www.eurostar.com/fr-fr" target="_blank" rel="noopener noreferrer nofollow sponsored">Réservez sur Eurostar</a>.</li>
</ul>

<h3>En voiture</h3>
<p>Si vous préférez la flexibilité, louez un véhicule pour explorer Paris à votre rythme. Comparez les offres des loueurs avec <a href="https://www.rentalcars.com/fr/city/fr/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Rentalcars.com</a> — jusqu'à 40% d'économie en réservant à l'avance.</p>

<h2>Où manger autour de l'événement ?</h2>
<p>Le 13e arrondissement et ses alentours regorgent de bonnes tables, et la scène culinaire africaine parisienne n'a jamais été aussi riche.</p>
<ul>
  <li><strong>Afrik'N'Fusion</strong> (11e) — Cuisine afro-fusion créative, ambiance lounge.</li>
  <li><strong>Le Petit Dakar</strong> (10e) — Thiéboudienne et yassa authentiques dans un cadre convivial.</li>
  <li><strong>Chez Ly</strong> (8e) — Gastronomie africaine revisitée, cadre élégant.</li>
</ul>
<p>Réservez votre table à l'avance et bénéficiez de réductions exclusives via <a href="https://www.thefork.fr/recherche?cityId=415144&what=restaurant+africain" target="_blank" rel="noopener noreferrer nofollow sponsored">TheFork — restaurants africains à Paris</a>.</p>

<h2>Que faire à Paris ce week-end là ?</h2>
<p>Profitez de votre séjour pour découvrir Paris sous un angle culturel africain :</p>
<ul>
  <li><strong>Musée du Quai Branly</strong> — Collections permanentes d'art africain, à 20 min en métro.</li>
  <li><strong>Balade street art à Belleville</strong> — Fresques d'artistes africains et afro-descendants.</li>
  <li><strong>Croisière sur la Seine</strong> — Un classique incontournable pour les visiteurs.</li>
</ul>
<p>Réservez vos activités à l'avance avec <a href="https://www.getyourguide.fr/paris-l16/" target="_blank" rel="noopener noreferrer nofollow sponsored">GetYourGuide — activités à Paris</a> ou <a href="https://www.viator.com/fr-FR/Paris/d479-ttd" target="_blank" rel="noopener noreferrer nofollow sponsored">Viator</a> pour des expériences uniques avec annulation gratuite.</p>

<h2>Se détendre après les défilés</h2>
<p>Après une journée intense de défilés et de networking, accordez-vous un moment de détente :</p>
<ul>
  <li><strong>Spa Mosaic</strong> (1er) — Hammam et soins inspirés de traditions africaines.</li>
  <li><strong>Les Bains du Marais</strong> (4e) — Hammam, spa et ambiance apaisante au cœur du Marais.</li>
</ul>
<p>Trouvez un spa près de vous et réservez en ligne sur <a href="https://www.treatwell.fr/salons/spa/paris/" target="_blank" rel="noopener noreferrer nofollow sponsored">Treatwell</a>. Vous pouvez aussi offrir un coffret détente via <a href="https://www.wonderbox.fr/coffret-cadeau/spa-et-soin/" target="_blank" rel="noopener noreferrer nofollow sponsored">Wonderbox</a> — le cadeau parfait pour accompagner un billet Fashion Week Africa.</p>

<h2>Billetterie et programme</h2>
<p>Les places pour la Fashion Week Africa Paris 2026 sont en vente sur notre site. Plusieurs formules sont disponibles :</p>
<ul>
  <li><strong>Pass Standard</strong> — Accès aux défilés et au salon.</li>
  <li><strong>Pass VIP</strong> — Front row, accès backstage et cocktail networking.</li>
  <li><strong>Pass Pro</strong> — Pour les professionnels de la mode, accès aux rendez-vous B2B.</li>
</ul>
<p><strong><a href="https://dreamteamafrica.com/saison-culturelle-africaine/fashion-week-africa">Réservez vos places pour la Fashion Week Africa Paris 2026</a></strong></p>

<h2>Checklist du visiteur</h2>
<ul>
  <li>Réserver son hébergement (Booking.com ou Airbnb)</li>
  <li>Acheter son billet de train (Trainline) ou réserver une voiture (Rentalcars)</li>
  <li>Réserver un restaurant pour le dîner (TheFork)</li>
  <li>Planifier une activité culturelle (GetYourGuide)</li>
  <li>Acheter ses billets Fashion Week Africa sur dreamteamafrica.com</li>
  <li>Préparer sa tenue — c'est la Fashion Week !</li>
</ul>

<p><em>Cet article contient des liens affiliés. Si vous réservez via ces liens, Dream Team Africa perçoit une petite commission sans frais supplémentaires pour vous. Cela nous aide à financer la Saison Culturelle Africaine et à proposer du contenu gratuit.</em></p>
`.trim();

async function main() {
  // Find admin user for author
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (!admin) {
    console.error("Aucun utilisateur ADMIN trouvé. Créez-en un d'abord.");
    process.exit(1);
  }

  // Find Fashion Week Africa event
  const event = await prisma.event.findFirst({
    where: {
      title: { contains: "Fashion Week", mode: "insensitive" },
      published: true,
    },
    select: { id: true },
  });

  const existing = await prisma.article.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Article déjà existant, mise à jour...");
    await prisma.article.update({
      where: { slug: SLUG },
      data: { content: CONTENT },
    });
    console.log("Article mis à jour :", SLUG);
    return;
  }

  await prisma.article.create({
    data: {
      title: "Guide complet du visiteur : Fashion Week Africa Paris 2026",
      slug: SLUG,
      excerpt:
        "Hébergement, transport, restaurants, activités : tout ce qu'il faut savoir pour profiter pleinement de la Fashion Week Africa à Paris le 3 octobre 2026.",
      content: CONTENT,
      category: "LIFESTYLE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      featured: true,
      source: "manual",
      authorId: admin.id,
      readingTimeMin: 5,
      tags: [
        "fashion week africa",
        "paris",
        "mode africaine",
        "guide visiteur",
        "hébergement paris",
        "restaurants africains paris",
        "saison culturelle africaine",
      ],
      metaTitle:
        "Guide complet du visiteur : Fashion Week Africa Paris 2026 — Hôtels, Transport, Restaurants",
      metaDescription:
        "Où dormir, comment venir, où manger et que faire à Paris pour la Fashion Week Africa 2026. Guide pratique avec nos meilleures recommandations.",
      seoKeywords: [
        "fashion week africa paris 2026",
        "mode africaine paris",
        "hôtel fashion week paris",
        "restaurant africain paris",
        "séjour culturel africain paris",
        "activités paris octobre 2026",
      ],
      gradientClass: "g3",
      ...(event && { eventId: event.id }),
    },
  });

  console.log("Article créé avec succès :", SLUG);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
