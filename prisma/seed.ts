import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.adCampaign.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // ─── USERS ──────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      name: "Yapy Mambo",
      email: "admin@dreamteamafrica.com",
      password: hashedPassword,
      role: "ADMIN",
      bio: "Fondateur de Dream Team Africa",
      country: "Côte d'Ivoire",
    },
  });

  const artisans = await Promise.all([
    prisma.user.create({
      data: {
        name: "Aminata Diallo",
        email: "aminata@artisan.dta",
        password: hashedPassword,
        role: "ARTISAN",
        bio: "Créatrice de bijoux inspirés de l'art Akan",
        country: "Sénégal",
      },
    }),
    prisma.user.create({
      data: {
        name: "Kofi Mensah",
        email: "kofi@artisan.dta",
        password: hashedPassword,
        role: "ARTISAN",
        bio: "Tisserand de kente et créateur textile",
        country: "Ghana",
      },
    }),
    prisma.user.create({
      data: {
        name: "Fatou Bamba",
        email: "fatou@artisan.dta",
        password: hashedPassword,
        role: "ARTISAN",
        bio: "Maroquinière spécialisée en cuir africain",
        country: "Mali",
      },
    }),
    prisma.user.create({
      data: {
        name: "Chidi Okafor",
        email: "chidi@artisan.dta",
        password: hashedPassword,
        role: "ARTISAN",
        bio: "Sculpteur sur bois et artiste contemporain",
        country: "Nigeria",
      },
    }),
  ]);

  console.log(`Created admin + ${artisans.length} artisans`);

  // ─── EVENTS ─────────────────────────────────────────────

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Africa Fashion Week Paris",
        slug: "africa-fashion-week-paris-2026",
        description:
          "Le rendez-vous incontournable de la mode africaine à Paris. Défilés, expositions et rencontres avec les créateurs les plus talentueux du continent. Plus de 30 designers présenteront leurs collections printemps-été 2027.",
        venue: "Le Carreau du Temple",
        address: "4 Rue Eugène Spuller, 75003 Paris",
        date: new Date("2026-03-15T18:00:00"),
        endDate: new Date("2026-03-16T23:00:00"),
        capacity: 500,
        priceEarly: 25,
        priceStd: 40,
        priceVip: 90,
      },
    }),
    prisma.event.create({
      data: {
        title: "Salon de la Gastronomie Africaine",
        slug: "salon-gastronomie-africaine-2026",
        description:
          "Un voyage culinaire à travers les saveurs du continent africain. Dégustations, masterclasses avec des chefs renommés, et marché de produits artisanaux. 50 exposants de 15 pays africains.",
        venue: "Parc des Expositions",
        address: "1 Place de la Porte de Versailles, 75015 Paris",
        date: new Date("2026-04-20T10:00:00"),
        endDate: new Date("2026-04-22T19:00:00"),
        capacity: 1000,
        priceEarly: 15,
        priceStd: 25,
        priceVip: 60,
      },
    }),
    prisma.event.create({
      data: {
        title: "Nuit de la Musique Afro",
        slug: "nuit-musique-afro-2026",
        description:
          "Une soirée exceptionnelle célébrant la richesse musicale africaine. Du afrobeat au mbalax, en passant par le coupé-décalé et l'amapiano. Line-up international avec des artistes de renommée mondiale.",
        venue: "La Cigale",
        address: "120 Boulevard de Rochechouart, 75018 Paris",
        date: new Date("2026-05-18T20:00:00"),
        endDate: new Date("2026-05-19T04:00:00"),
        capacity: 800,
        priceEarly: 30,
        priceStd: 45,
        priceVip: 100,
      },
    }),
    prisma.event.create({
      data: {
        title: "Festival des Arts Visuels d'Afrique",
        slug: "festival-arts-visuels-afrique-2026",
        description:
          "Exposition d'art contemporain africain réunissant peintres, sculpteurs, photographes et artistes numériques. Vernissages, conférences et ateliers créatifs pour tous les publics.",
        venue: "Palais de Tokyo",
        address: "13 Avenue du Président Wilson, 75116 Paris",
        date: new Date("2026-06-22T11:00:00"),
        endDate: new Date("2026-06-28T20:00:00"),
        capacity: 600,
        priceEarly: 12,
        priceStd: 20,
        priceVip: 50,
      },
    }),
    prisma.event.create({
      data: {
        title: "Africa Business Summit",
        slug: "africa-business-summit-2026",
        description:
          "Le sommet des entrepreneurs et investisseurs de la diaspora africaine. Panels, pitchs de startups, networking et masterclasses sur l'entrepreneuriat en Afrique et en Europe.",
        venue: "Station F",
        address: "5 Parvis Alan Turing, 75013 Paris",
        date: new Date("2026-07-10T09:00:00"),
        endDate: new Date("2026-07-11T18:00:00"),
        capacity: 400,
        priceEarly: 50,
        priceStd: 80,
        priceVip: 150,
      },
    }),
    prisma.event.create({
      data: {
        title: "Cinéma d'Afrique en Plein Air",
        slug: "cinema-afrique-plein-air-2026",
        description:
          "Festival de cinéma africain en plein air au cœur de Paris. Projections de films primés, courts-métrages, documentaires et rencontres avec les réalisateurs.",
        venue: "Parc de la Villette",
        address: "211 Avenue Jean Jaurès, 75019 Paris",
        date: new Date("2026-08-15T19:00:00"),
        endDate: new Date("2026-08-17T23:00:00"),
        capacity: 700,
        priceEarly: 10,
        priceStd: 18,
        priceVip: 40,
      },
    }),
    prisma.event.create({
      data: {
        title: "Salon du Livre Africain",
        slug: "salon-livre-africain-2026",
        description:
          "Le plus grand salon littéraire dédié aux auteurs africains et afro-descendants en Europe. Dédicaces, lectures, tables rondes et prix littéraire DTA.",
        venue: "Maison de la Radio",
        address: "116 Avenue du Président Kennedy, 75016 Paris",
        date: new Date("2026-09-25T10:00:00"),
        endDate: new Date("2026-09-27T19:00:00"),
        capacity: 450,
        priceEarly: 8,
        priceStd: 15,
        priceVip: 35,
      },
    }),
    prisma.event.create({
      data: {
        title: "Gala de Clôture DTA 2026",
        slug: "gala-cloture-dta-2026",
        description:
          "La grande soirée de clôture de la saison Dream Team Africa 2026. Dîner de gala, spectacle vivant, remise des prix DTA et performances artistiques exceptionnelles.",
        venue: "Pavillon Cambon Capucines",
        address: "46 Rue Cambon, 75001 Paris",
        date: new Date("2026-11-20T19:00:00"),
        endDate: new Date("2026-11-21T02:00:00"),
        capacity: 300,
        priceEarly: 80,
        priceStd: 120,
        priceVip: 250,
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // ─── PRODUCTS ───────────────────────────────────────────

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Collier Akan en or plaqué",
        slug: "collier-akan-or-plaque",
        description:
          "Magnifique collier inspiré des symboles Adinkra du peuple Akan. Plaqué or 18 carats, travail artisanal minutieux. Chaque pièce est unique et raconte une histoire millénaire.",
        price: 89,
        images: ["/images/products/collier-akan.jpg"],
        category: "Bijoux",
        country: "Sénégal",
        stock: 15,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Bracelet en perles Massaï",
        slug: "bracelet-perles-massai",
        description:
          "Bracelet coloré en perles de verre, tissé à la main selon la tradition Massaï. Fermeture ajustable. Disponible en plusieurs combinaisons de couleurs.",
        price: 35,
        images: ["/images/products/bracelet-massai.jpg"],
        category: "Bijoux",
        country: "Sénégal",
        stock: 30,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Écharpe en tissu Kente",
        slug: "echarpe-tissu-kente",
        description:
          "Écharpe tissée à la main en authentique tissu Kente du Ghana. Motifs géométriques traditionnels aux couleurs vibrantes. 100% coton premium.",
        price: 65,
        images: ["/images/products/echarpe-kente.jpg"],
        category: "Mode",
        country: "Ghana",
        stock: 20,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Chemise Ankara homme",
        slug: "chemise-ankara-homme",
        description:
          "Chemise pour homme en wax Ankara haut de gamme. Coupe ajustée moderne, col Mao. Parfaite pour un look afro-chic élégant.",
        price: 75,
        images: ["/images/products/chemise-ankara.jpg"],
        category: "Mode",
        country: "Ghana",
        stock: 12,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sac en cuir de Tombouctou",
        slug: "sac-cuir-tombouctou",
        description:
          "Sac à main en cuir tanné végétal de Tombouctou. Gravures traditionnelles Touareg, doublure coton. Un accessoire d'exception alliant tradition et modernité.",
        price: 120,
        images: ["/images/products/sac-tombouctou.jpg"],
        category: "Maroquinerie",
        country: "Mali",
        stock: 8,
        artisanId: artisans[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Portefeuille cuir Sahélien",
        slug: "portefeuille-cuir-sahelien",
        description:
          "Portefeuille compact en cuir du Sahel avec motifs gravés à la main. Plusieurs compartiments, finition soignée. Pièce unique numérotée.",
        price: 55,
        images: ["/images/products/portefeuille-sahel.jpg"],
        category: "Maroquinerie",
        country: "Mali",
        stock: 18,
        artisanId: artisans[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sculpture Nok en terre cuite",
        slug: "sculpture-nok-terre-cuite",
        description:
          "Reproduction artisanale d'une tête Nok en terre cuite. Inspirée de la civilisation Nok (500 av. J.-C.). Pièce décorative majestueuse, hauteur 30cm.",
        price: 150,
        images: ["/images/products/sculpture-nok.jpg"],
        category: "Décoration",
        country: "Nigeria",
        stock: 5,
        artisanId: artisans[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Masque Igbo en bois d'ébène",
        slug: "masque-igbo-ebene",
        description:
          "Masque décoratif sculpté à la main en bois d'ébène. Inspiré des masques cérémoniels Igbo. Chaque pièce est unique, signée par l'artiste.",
        price: 95,
        images: ["/images/products/masque-igbo.jpg"],
        category: "Décoration",
        country: "Nigeria",
        stock: 10,
        artisanId: artisans[3].id,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // ─── ARTICLES ───────────────────────────────────────────

  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "La mode africaine conquiert les podiums parisiens",
        slug: "mode-africaine-podiums-parisiens",
        excerpt:
          "De la Fashion Week aux boutiques du Marais, les créateurs africains s'imposent comme les nouveaux visionnaires de la mode mondiale.",
        content:
          "La mode africaine connaît un essor sans précédent sur la scène internationale. Les créateurs du continent, longtemps cantonnés aux marchés locaux, investissent désormais les plus grands podiums du monde. À Paris, capitale incontestée de la mode, cette révolution est particulièrement visible.\n\nDes marques comme Tongoro, Maki Oh et Lisa Folawiyo présentent régulièrement leurs collections lors de la Fashion Week parisienne, attirant l'attention des acheteurs internationaux et des médias spécialisés. Le wax, le kente et le bogolan ne sont plus de simples curiosités exotiques mais des matières nobles qui inspirent les plus grandes maisons.\n\nCette montée en puissance s'accompagne d'une prise de conscience plus large sur la richesse des savoir-faire textiles africains.",
        category: "CULTURE",
        position: "UNE",
        authorId: admin.id,
        publishedAt: new Date(),
        dayCount: 1,
        featured: true,
      },
    }),
    prisma.article.create({
      data: {
        title: "Les entrepreneurs de la diaspora qui font bouger l'Afrique",
        slug: "entrepreneurs-diaspora-afrique",
        excerpt:
          "Portrait de ces femmes et hommes qui, depuis l'Europe, investissent et innovent pour transformer le continent.",
        content:
          "La diaspora africaine en Europe représente un formidable levier de développement pour le continent. Chaque année, les transferts de fonds de la diaspora dépassent les aides publiques au développement. Mais au-delà des remises financières, c'est un véritable écosystème entrepreneurial qui se construit.\n\nDes startups tech aux projets agricoles, en passant par l'immobilier et les énergies renouvelables, les entrepreneurs de la diaspora multiplient les initiatives. Leur double culture et leur connaissance des marchés européens et africains constituent un avantage compétitif unique.\n\nÀ Paris, plusieurs incubateurs se sont spécialisés dans l'accompagnement de ces projets bicontinentaux.",
        category: "BUSINESS",
        position: "FACE_UNE",
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dayCount: 4,
      },
    }),
    prisma.article.create({
      data: {
        title: "Gastronomie : quand l'Afrique réinvente la cuisine française",
        slug: "gastronomie-afrique-cuisine-francaise",
        excerpt:
          "Les chefs africains étoilés révolutionnent la gastronomie parisienne en fusionnant saveurs ancestrales et techniques modernes.",
        content:
          "La scène gastronomique parisienne vit une révolution culinaire portée par des chefs d'origine africaine. Du thiéboudienne revisité au foutou en version fine dining, les saveurs du continent s'invitent dans les restaurants les plus prisés de la capitale.\n\nDes chefs comme Mory Sacko, étoilé Michelin avec son restaurant MoSuke, ouvrent la voie à une nouvelle génération de cuisiniers qui refusent de choisir entre leurs racines africaines et l'excellence de la gastronomie française.\n\nCette fusion culinaire trouve un écho particulier auprès d'une clientèle cosmopolite en quête d'authenticité et de nouvelles expériences gustatives.",
        category: "LIFESTYLE",
        position: "PAGES_4_5",
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dayCount: 8,
      },
    }),
    prisma.article.create({
      data: {
        title: "La diaspora africaine face aux défis de la double identité",
        slug: "diaspora-double-identite",
        excerpt:
          "Entre héritage culturel et intégration, comment les Afro-européens construisent-ils leur identité plurielle ?",
        content:
          "Être d'origine africaine en Europe, c'est naviguer entre deux mondes, deux cultures, parfois deux langues. Cette double appartenance, longtemps vécue comme un tiraillement, est de plus en plus revendiquée comme une richesse par les nouvelles générations.\n\nLes Afro-européens créent leur propre culture, un mélange unique d'influences qui se manifeste dans la musique, la mode, la cuisine et les arts. L'afrobeat se mêle à l'électro, le wax se porte avec du streetwear, et les recettes de grand-mère se réinventent dans des food trucks branchés.\n\nCette identité plurielle est au cœur du projet Dream Team Africa.",
        category: "DIASPORA",
        position: "PAGES_6_7",
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dayCount: 11,
      },
    }),
    prisma.article.create({
      data: {
        title: "Élections au Sénégal : un tournant démocratique pour l'Afrique de l'Ouest",
        slug: "elections-senegal-tournant-democratique",
        excerpt:
          "L'alternance politique sénégalaise confirme la maturité démocratique de ce pays modèle du continent.",
        content:
          "Le Sénégal continue de s'affirmer comme un modèle démocratique en Afrique de l'Ouest. Les récentes élections ont démontré la solidité des institutions sénégalaises et la maturité de son électorat.\n\nCette stabilité politique est un atout majeur pour le développement économique du pays et pour attirer les investissements de la diaspora. Le nouveau gouvernement a d'ailleurs annoncé plusieurs mesures en faveur des Sénégalais de l'extérieur.\n\nPour la diaspora en France, ces évolutions politiques sont suivies avec attention et espoir.",
        category: "ACTUALITE",
        position: "PAGES_8_9",
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        dayCount: 13,
      },
    }),
    prisma.article.create({
      data: {
        title: "Tribune : Pour une vraie politique culturelle panafricaine",
        slug: "tribune-politique-culturelle-panafricaine",
        excerpt:
          "Il est temps de créer un espace culturel commun à l'ensemble du continent et de sa diaspora.",
        content:
          "L'Afrique possède une richesse culturelle incommensurable, mais cette richesse reste fragmentée, sous-valorisée et insuffisamment partagée entre les pays du continent et avec la diaspora.\n\nIl est urgent de mettre en place une véritable politique culturelle panafricaine qui permette la circulation des artistes, la protection des savoirs traditionnels et la promotion des industries créatives africaines sur la scène mondiale.\n\nDream Team Africa s'inscrit dans cette vision en créant un pont culturel entre l'Afrique et l'Europe, entre tradition et modernité.",
        category: "OPINION",
        position: "PAGES_10_11",
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        dayCount: 16,
      },
    }),
  ]);

  console.log(`Created ${articles.length} articles`);

  console.log("\nSeed completed successfully!");
  console.log("─────────────────────────────");
  console.log(`Admin:    admin@dreamteamafrica.com / password123`);
  console.log(`Artisan:  aminata@artisan.dta / password123`);
  console.log(`Artisan:  kofi@artisan.dta / password123`);
  console.log(`Artisan:  fatou@artisan.dta / password123`);
  console.log(`Artisan:  chidi@artisan.dta / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
