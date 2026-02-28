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
  await prisma.journalAd.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.inscription.deleteMany();
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
        title: "Foire D'Afrique Paris",
        slug: "foire-afrique-paris-2026",
        description:
          "Le plus grand salon de la culture africaine à Paris. Artisanat, gastronomie, musique et conférences.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/foiredafriqueparis/foiredafriqueparis%201%3A1.png",
        venue: "Espace Mas",
        address: "10 rue des terres au curé, Paris",
        date: new Date("2026-05-01T12:00:00"),
        endDate: new Date("2026-05-02T22:00:00"),
        capacity: 500,
        priceEarly: 5,
        priceStd: 10,
        priceVip: 15,
      },
    }),
    prisma.event.create({
      data: {
        title: "Festival International du Cinéma Africain",
        slug: "festival-international-cinema-africain-2026",
        description:
          "Festival international dédié au cinéma africain. Projections, débats et rencontres avec les réalisateurs.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/fica/festivalinternationalducinemaafricain%201%3A1.png",
        venue: "Cinéma Kosmos, Maison des citoyens et de la vie associative",
        address: "Fontenay-sous-Bois",
        date: new Date("2026-04-03T10:00:00"),
        endDate: new Date("2026-04-04T22:00:00"),
        capacity: 300,
        priceEarly: 7,
        priceStd: 7,
        priceVip: 7,
      },
    }),
    prisma.event.create({
      data: {
        title: "Évasion Paris",
        slug: "evasion-paris-2026",
        description:
          "Balade en bateau sur la Seine à Paris. Croisière culturelle avec concerts, dégustations et art contemporain africain.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/evasionparis/evasionparis.png",
        venue: "La Seine",
        address: "Paris",
        date: new Date("2026-06-13T12:00:00"),
        endDate: new Date("2026-06-13T16:00:00"),
        capacity: 150,
        priceEarly: 150,
        priceStd: 150,
        priceVip: 250,
      },
    }),
    prisma.event.create({
      data: {
        title: "Festival de l'Autre Culture",
        slug: "festival-autre-culture-2026",
        description:
          "Festival multiculturel en plein air. Musique, danse, gastronomie et rencontres dans un cadre verdoyant. Entrée gratuite.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/conteafricain/conte%20africain.png",
        venue: "Parc des Épivans",
        address: "Fontenay-sous-Bois",
        date: new Date("2026-06-27T13:00:00"),
        endDate: new Date("2026-06-27T21:00:00"),
        capacity: 1000,
        priceEarly: 0,
        priceStd: 0,
        priceVip: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: "Juste Une Danse - Festival des danses traditionnelles africaines",
        slug: "juste-une-danse-2026",
        description:
          "Festival des danses traditionnelles africaines. Compétitions, spectacles et ateliers.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/justeunedanse/justeunedanse11.png",
        venue: "Espace Mas",
        address: "10 rue des terres au curé, Paris",
        date: new Date("2026-10-31T12:00:00"),
        endDate: new Date("2026-10-31T18:00:00"),
        capacity: 400,
        priceEarly: 15,
        priceStd: 50,
        priceVip: 110,
      },
    }),
    prisma.event.create({
      data: {
        title: "Festival du Conte Africain - Sous l'arbre à Palabre",
        slug: "festival-conte-africain-2026",
        description:
          "Les griots et conteurs d'Afrique partagent leurs histoires millénaires. Spectacles pour toute la famille.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/conteafricain/conte%20africain%20festival.png",
        venue: "Espace Mas",
        address: "10 rue des terres au curé, Paris",
        date: new Date("2026-11-11T12:00:00"),
        endDate: new Date("2026-11-11T18:00:00"),
        capacity: 350,
        priceEarly: 10,
        priceStd: 20,
        priceVip: 35,
      },
    }),
    prisma.event.create({
      data: {
        title: "Salon Made In Africa - L'artisanat africain à Paris",
        slug: "salon-made-in-africa-2026",
        description:
          "L'artisanat africain à l'honneur. Mode, décoration, cosmétiques, épicerie fine. 500+ artisans exposants.",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/salonmadeinafrica/salonmadeinafrica%201%3A1.png",
        venue: "Espace Mas",
        address: "10 rue des terres au curé, Paris",
        date: new Date("2026-12-11T12:00:00"),
        endDate: new Date("2026-12-12T22:00:00"),
        capacity: 600,
        priceEarly: 5,
        priceStd: 10,
        priceVip: 15,
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
        images: ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?w=800&q=80"],
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
        images: ["https://images.unsplash.com/photo-1580618864180-f6e7fb65f0be?w=800&q=80"],
        category: "Décoration",
        country: "Nigeria",
        stock: 10,
        artisanId: artisans[3].id,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // ─── ARTICLES (25 total) ────────────────────────────────

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const articles = await Promise.all([
    // ── UNE (J1-3) — 3 articles ──
    prisma.article.create({
      data: {
        title: "La mode africaine conquiert les podiums parisiens",
        slug: "mode-africaine-podiums-parisiens",
        excerpt:
          "De la Fashion Week aux boutiques du Marais, les créateurs africains s'imposent comme les nouveaux visionnaires de la mode mondiale.",
        content:
          "La mode africaine connaît un essor sans précédent sur la scène internationale. Les créateurs du continent, longtemps cantonnés aux marchés locaux, investissent désormais les plus grands podiums du monde. À Paris, capitale incontestée de la mode, cette révolution est particulièrement visible.\n\nDes marques comme Tongoro, Maki Oh et Lisa Folawiyo présentent régulièrement leurs collections lors de la Fashion Week parisienne, attirant l'attention des acheteurs internationaux et des médias spécialisés. Le wax, le kente et le bogolan ne sont plus de simples curiosités exotiques mais des matières nobles qui inspirent les plus grandes maisons.\n\nCette montée en puissance s'accompagne d'une prise de conscience plus large sur la richesse des savoir-faire textiles africains.",
        coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
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
        title: "Nollywood dépasse Hollywood en volume de production",
        slug: "nollywood-depasse-hollywood",
        excerpt:
          "L'industrie cinématographique nigériane produit désormais plus de films que Hollywood et attire les investisseurs internationaux.",
        content:
          "Nollywood, l'industrie cinématographique du Nigeria, a franchi un cap symbolique en dépassant Hollywood en nombre de films produits annuellement. Avec plus de 2 500 productions par an, cette industrie représente un chiffre d'affaires de plusieurs milliards de dollars.\n\nCette croissance fulgurante s'accompagne d'une amélioration notable de la qualité des productions. Les plateformes de streaming internationales investissent massivement dans le contenu africain, offrant une visibilité sans précédent aux créateurs du continent.\n\nLe succès de séries comme Blood Sisters sur Netflix témoigne de l'appétit mondial pour les histoires africaines.",
        coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
        category: "CULTURE",
        position: "UNE",
        authorId: admin.id,
        publishedAt: new Date(now - 1 * DAY),
        dayCount: 2,
        featured: true,
      },
    }),
    prisma.article.create({
      data: {
        title: "Le franc CFA en question : vers une monnaie panafricaine ?",
        slug: "franc-cfa-monnaie-panafricaine",
        excerpt:
          "Le débat sur la souveraineté monétaire africaine s'intensifie alors que l'Union Africaine explore des alternatives au franc CFA.",
        content:
          "Le débat autour du franc CFA refait surface avec une intensité nouvelle. Plusieurs économistes africains et européens plaident pour une réforme profonde du système monétaire hérité de la colonisation.\n\nL'Union Africaine a lancé un groupe de travail pour étudier la faisabilité d'une monnaie unique panafricaine, inspirée du modèle de l'euro. Les enjeux sont considérables : souveraineté économique, stabilité financière et intégration régionale.\n\nPour la diaspora, cette question est centrale car elle impacte directement les transferts de fonds vers le continent.",
        gradientClass: "j-g3",
        category: "ACTUALITE",
        position: "UNE",
        authorId: admin.id,
        publishedAt: new Date(now - 2 * DAY),
        dayCount: 3,
      },
    }),

    // ── FACE_UNE (J4-6) — 3 articles ──
    prisma.article.create({
      data: {
        title: "Les entrepreneurs de la diaspora qui font bouger l'Afrique",
        slug: "entrepreneurs-diaspora-afrique",
        excerpt:
          "Portrait de ces femmes et hommes qui, depuis l'Europe, investissent et innovent pour transformer le continent.",
        content:
          "La diaspora africaine en Europe représente un formidable levier de développement pour le continent. Chaque année, les transferts de fonds de la diaspora dépassent les aides publiques au développement. Mais au-delà des remises financières, c'est un véritable écosystème entrepreneurial qui se construit.\n\nDes startups tech aux projets agricoles, en passant par l'immobilier et les énergies renouvelables, les entrepreneurs de la diaspora multiplient les initiatives. Leur double culture et leur connaissance des marchés européens et africains constituent un avantage compétitif unique.\n\nÀ Paris, plusieurs incubateurs se sont spécialisés dans l'accompagnement de ces projets bicontinentaux.",
        coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
        category: "BUSINESS",
        position: "FACE_UNE",
        authorId: admin.id,
        publishedAt: new Date(now - 3 * DAY),
        dayCount: 4,
      },
    }),
    prisma.article.create({
      data: {
        title: "La tech africaine lève des fonds records en 2026",
        slug: "tech-africaine-fonds-records-2026",
        excerpt:
          "Les startups du continent attirent des investissements massifs, portées par l'innovation mobile et la fintech.",
        content:
          "L'écosystème tech africain continue sa croissance exponentielle. Au premier semestre 2026, les startups africaines ont levé plus de 3 milliards de dollars, un record historique.\n\nLa fintech reste le secteur dominant avec des champions comme Flutterwave, Chipper Cash et Wave qui étendent leurs services à travers le continent. Mais d'autres secteurs émergent : healthtech, agritech, edtech.\n\nLes hubs technologiques comme Lagos, Nairobi, Le Caire et Cape Town rivalisent désormais avec des écosystèmes plus matures.",
        coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
        category: "BUSINESS",
        position: "FACE_UNE",
        authorId: admin.id,
        publishedAt: new Date(now - 4 * DAY),
        dayCount: 5,
        isSponsored: true,
        sponsorName: "AfricaTech Fund",
      },
    }),
    prisma.article.create({
      data: {
        title: "Afrobeats : la musique africaine s'impose dans les charts mondiaux",
        slug: "afrobeats-charts-mondiaux",
        excerpt:
          "De Burna Boy à Tems, les artistes africains dominent les playlists internationales et redéfinissent la pop culture.",
        content:
          "L'Afrobeats est devenu un phénomène mondial incontournable. Les artistes nigérians, ghanéens et sud-africains occupent désormais les premières places des charts internationaux.\n\nBurna Boy, Wizkid, Tems, Ayra Starr — ces noms sont devenus familiers pour des millions de fans à travers le monde. Les collaborations avec des artistes occidentaux se multiplient, mais c'est surtout le son africain qui s'exporte tel quel.\n\nLes festivals européens font désormais la part belle aux artistes africains, et Paris n'est pas en reste avec ses nombreux événements dédiés.",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
        category: "CULTURE",
        position: "FACE_UNE",
        authorId: admin.id,
        publishedAt: new Date(now - 5 * DAY),
        dayCount: 6,
      },
    }),

    // ── PAGES_4_5 (J7-8) — 2 articles ──
    prisma.article.create({
      data: {
        title: "Gastronomie : quand l'Afrique réinvente la cuisine française",
        slug: "gastronomie-afrique-cuisine-francaise",
        excerpt:
          "Les chefs africains étoilés révolutionnent la gastronomie parisienne en fusionnant saveurs ancestrales et techniques modernes.",
        content:
          "La scène gastronomique parisienne vit une révolution culinaire portée par des chefs d'origine africaine. Du thiéboudienne revisité au foutou en version fine dining, les saveurs du continent s'invitent dans les restaurants les plus prisés de la capitale.\n\nDes chefs comme Mory Sacko, étoilé Michelin avec son restaurant MoSuke, ouvrent la voie à une nouvelle génération de cuisiniers qui refusent de choisir entre leurs racines africaines et l'excellence de la gastronomie française.\n\nCette fusion culinaire trouve un écho particulier auprès d'une clientèle cosmopolite en quête d'authenticité et de nouvelles expériences gustatives.",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        category: "LIFESTYLE",
        position: "PAGES_4_5",
        authorId: admin.id,
        publishedAt: new Date(now - 7 * DAY),
        dayCount: 8,
      },
    }),
    prisma.article.create({
      data: {
        title: "Le boom du tourisme en Afrique de l'Est",
        slug: "boom-tourisme-afrique-est",
        excerpt:
          "Le Kenya, la Tanzanie et le Rwanda battent des records de fréquentation touristique, portés par l'écotourisme.",
        content:
          "L'Afrique de l'Est s'impose comme une destination touristique majeure. Le Kenya et la Tanzanie, avec leurs parcs nationaux emblématiques, accueillent un nombre record de visiteurs.\n\nLe Rwanda, souvent cité en exemple pour sa politique de tourisme haut de gamme, attire une clientèle internationale avec le gorilla trekking et ses lodges de luxe. L'Éthiopie, avec ses sites historiques classés UNESCO, connaît également un regain d'intérêt.\n\nL'écotourisme et le tourisme communautaire émergent comme des alternatives durables, bénéficiant directement aux populations locales.",
        coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
        category: "LIFESTYLE",
        position: "PAGES_4_5",
        authorId: admin.id,
        publishedAt: new Date(now - 6 * DAY),
        dayCount: 7,
      },
    }),

    // ── PAGES_6_7 (J9-10) — 2 articles ──
    prisma.article.create({
      data: {
        title: "La diaspora africaine face aux défis de la double identité",
        slug: "diaspora-double-identite",
        excerpt:
          "Entre héritage culturel et intégration, comment les Afro-européens construisent-ils leur identité plurielle ?",
        content:
          "Être d'origine africaine en Europe, c'est naviguer entre deux mondes, deux cultures, parfois deux langues. Cette double appartenance, longtemps vécue comme un tiraillement, est de plus en plus revendiquée comme une richesse par les nouvelles générations.\n\nLes Afro-européens créent leur propre culture, un mélange unique d'influences qui se manifeste dans la musique, la mode, la cuisine et les arts. L'afrobeat se mêle à l'électro, le wax se porte avec du streetwear, et les recettes de grand-mère se réinventent dans des food trucks branchés.\n\nCette identité plurielle est au cœur du projet Dream Team Africa.",
        coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
        category: "DIASPORA",
        position: "PAGES_6_7",
        authorId: admin.id,
        publishedAt: new Date(now - 9 * DAY),
        dayCount: 10,
      },
    }),
    prisma.article.create({
      data: {
        title: "Les associations panafricaines d'Europe se fédèrent",
        slug: "associations-panafricaines-europe",
        excerpt:
          "Un mouvement de structuration sans précédent unit les associations de la diaspora pour peser davantage.",
        content:
          "Les associations panafricaines d'Europe franchissent un cap en créant une fédération continentale. L'objectif : mutualiser les ressources, coordonner les actions et parler d'une seule voix auprès des institutions européennes.\n\nDe Paris à Londres, de Bruxelles à Berlin, les structures associatives de la diaspora africaine se comptent par milliers. Longtemps fragmentées, elles s'organisent désormais en réseau pour maximiser leur impact.\n\nCette structuration répond à un besoin croissant de représentation et de lobbying auprès des instances de décision.",
        gradientClass: "j-g6",
        category: "DIASPORA",
        position: "PAGES_6_7",
        authorId: admin.id,
        publishedAt: new Date(now - 8 * DAY),
        dayCount: 9,
      },
    }),

    // ── PAGES_8_9 (J11-12) — 2 articles ──
    prisma.article.create({
      data: {
        title: "Élections au Sénégal : un tournant démocratique pour l'Afrique de l'Ouest",
        slug: "elections-senegal-tournant-democratique",
        excerpt:
          "L'alternance politique sénégalaise confirme la maturité démocratique de ce pays modèle du continent.",
        content:
          "Le Sénégal continue de s'affirmer comme un modèle démocratique en Afrique de l'Ouest. Les récentes élections ont démontré la solidité des institutions sénégalaises et la maturité de son électorat.\n\nCette stabilité politique est un atout majeur pour le développement économique du pays et pour attirer les investissements de la diaspora. Le nouveau gouvernement a d'ailleurs annoncé plusieurs mesures en faveur des Sénégalais de l'extérieur.\n\nPour la diaspora en France, ces évolutions politiques sont suivies avec attention et espoir.",
        coverImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80",
        category: "ACTUALITE",
        position: "PAGES_8_9",
        authorId: admin.id,
        publishedAt: new Date(now - 11 * DAY),
        dayCount: 12,
      },
    }),
    prisma.article.create({
      data: {
        title: "L'Union Africaine renforce sa position sur la scène internationale",
        slug: "union-africaine-scene-internationale",
        excerpt:
          "L'admission de l'UA au G20 marque un tournant dans la représentation du continent dans la gouvernance mondiale.",
        content:
          "L'Union Africaine a franchi une étape historique en devenant membre permanent du G20. Cette reconnaissance internationale reflète le poids économique et démographique croissant du continent africain.\n\nAvec une population qui devrait atteindre 2,5 milliards d'habitants d'ici 2050, l'Afrique ne peut plus être ignorée dans les discussions sur les grands enjeux mondiaux : climat, commerce, santé, numérique.\n\nPour la diaspora, cette montée en puissance est source de fierté et d'opportunités.",
        gradientClass: "j-g8",
        category: "ACTUALITE",
        position: "PAGES_8_9",
        authorId: admin.id,
        publishedAt: new Date(now - 10 * DAY),
        dayCount: 11,
      },
    }),

    // ── PAGES_10_11 (J13-16) — 2 articles ──
    prisma.article.create({
      data: {
        title: "Tribune : Pour une vraie politique culturelle panafricaine",
        slug: "tribune-politique-culturelle-panafricaine",
        excerpt:
          "Il est temps de créer un espace culturel commun à l'ensemble du continent et de sa diaspora.",
        content:
          "L'Afrique possède une richesse culturelle incommensurable, mais cette richesse reste fragmentée, sous-valorisée et insuffisamment partagée entre les pays du continent et avec la diaspora.\n\nIl est urgent de mettre en place une véritable politique culturelle panafricaine qui permette la circulation des artistes, la protection des savoirs traditionnels et la promotion des industries créatives africaines sur la scène mondiale.\n\nDream Team Africa s'inscrit dans cette vision en créant un pont culturel entre l'Afrique et l'Europe, entre tradition et modernité.",
        coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
        category: "OPINION",
        position: "PAGES_10_11",
        authorId: admin.id,
        publishedAt: new Date(now - 15 * DAY),
        dayCount: 16,
      },
    }),
    prisma.article.create({
      data: {
        title: "Faut-il repenser l'aide au développement ?",
        slug: "repenser-aide-au-developpement",
        excerpt:
          "De plus en plus de voix africaines s'élèvent pour réclamer un nouveau paradigme dans les relations économiques Nord-Sud.",
        content:
          "Le modèle traditionnel de l'aide au développement est de plus en plus contesté par les intellectuels et entrepreneurs africains. Dambisa Moyo, dans son ouvrage Dead Aid, a ouvert la voie à une critique radicale de l'assistanat.\n\nAujourd'hui, un consensus émerge autour de l'idée que le commerce, l'investissement et l'entrepreneuriat sont plus efficaces que l'aide pour sortir de la pauvreté. Les succès du Rwanda, de l'Éthiopie et du Kenya en témoignent.\n\nLa diaspora a un rôle clé à jouer dans cette transformation en investissant directement dans l'économie africaine.",
        gradientClass: "j-g10",
        category: "OPINION",
        position: "PAGES_10_11",
        authorId: admin.id,
        publishedAt: new Date(now - 13 * DAY),
        dayCount: 14,
        isSponsored: true,
        sponsorName: "Africa Investment Forum",
      },
    }),

    // ── PAGES_12_13 (J17-21) — 3 articles ──
    prisma.article.create({
      data: {
        title: "L'art contemporain africain explose sur le marché mondial",
        slug: "art-contemporain-africain-marche-mondial",
        excerpt:
          "Les galeries internationales s'arrachent les œuvres d'artistes africains dont les cotes atteignent des sommets.",
        content:
          "L'art contemporain africain vit un âge d'or. Les œuvres de El Anatsui, Njideka Akunyili Crosby, et Amoako Boafo se vendent à des prix records dans les grandes maisons de ventes aux enchères.\n\nLes foires d'art comme 1-54 Contemporary African Art Fair, fondée à Londres, s'étendent désormais à Paris, New York et Marrakech. Les collectionneurs occidentaux découvrent la richesse et la diversité de la création contemporaine africaine.\n\nPour les artistes de la diaspora, cette reconnaissance ouvre de nouvelles perspectives.",
        coverImage: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=1200&q=80",
        category: "CULTURE",
        position: "PAGES_12_13",
        authorId: admin.id,
        publishedAt: new Date(now - 17 * DAY),
        dayCount: 18,
      },
    }),
    prisma.article.create({
      data: {
        title: "Sport : les athlètes africains brillent aux championnats du monde",
        slug: "athletes-africains-championnats-monde",
        excerpt:
          "Du marathon au sprint, les sportifs africains dominent les compétitions internationales d'athlétisme.",
        content:
          "Les athlètes africains continuent de régner sur l'athlétisme mondial. Le Kenya et l'Éthiopie dominent les courses de fond, tandis que le Nigeria et l'Afrique du Sud s'illustrent dans les sprints et les relais.\n\nAu-delà de l'athlétisme, le football africain gagne en prestige avec des joueurs qui évoluent dans les plus grands clubs européens. La CAN, Coupe d'Afrique des Nations, attire un public mondial croissant.\n\nLe sport reste un puissant vecteur d'intégration pour la diaspora et de fierté pour tout le continent.",
        coverImage: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcfa7?w=1200&q=80",
        category: "LIFESTYLE",
        position: "PAGES_12_13",
        authorId: admin.id,
        publishedAt: new Date(now - 18 * DAY),
        dayCount: 19,
      },
    }),
    prisma.article.create({
      data: {
        title: "Les langues africaines à l'ère du numérique",
        slug: "langues-africaines-ere-numerique",
        excerpt:
          "Des initiatives innovantes visent à préserver et numériser les 2 000 langues du continent africain.",
        content:
          "L'Afrique compte plus de 2 000 langues, une richesse linguistique unique au monde. Mais beaucoup de ces langues sont menacées de disparition face à la domination des langues coloniales.\n\nDes projets innovants comme Masakhane, qui développe des modèles d'IA pour les langues africaines, ou encore la numérisation de contenus en langues locales, offrent de nouvelles perspectives pour la préservation de ce patrimoine.\n\nLa diaspora contribue activement à ces efforts, en finançant des projets et en transmettant les langues aux nouvelles générations.",
        gradientClass: "j-g11",
        category: "CULTURE",
        position: "PAGES_12_13",
        authorId: admin.id,
        publishedAt: new Date(now - 19 * DAY),
        dayCount: 20,
        isSponsored: true,
        sponsorName: "Masakhane NLP",
      },
    }),

    // ── ARCHIVES (J22+) — 6 articles ──
    prisma.article.create({
      data: {
        title: "Énergies renouvelables : l'Afrique, futur leader mondial du solaire",
        slug: "energies-renouvelables-afrique-solaire",
        excerpt:
          "Le continent le plus ensoleillé du monde pourrait devenir le premier producteur d'énergie solaire d'ici 2040.",
        content:
          "L'Afrique reçoit plus de rayonnement solaire que tout autre continent. Pourtant, elle ne représente que 1% de la capacité solaire mondiale installée. Ce paradoxe est en train de changer.\n\nDes projets massifs comme le Noor au Maroc, les fermes solaires au Kenya et les installations off-grid en Afrique de l'Ouest transforment le paysage énergétique du continent.\n\nLa diaspora investit de plus en plus dans les projets d'énergies renouvelables, attirée par les rendements et l'impact social positif.",
        coverImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
        category: "BUSINESS",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 25 * DAY),
        dayCount: 26,
      },
    }),
    prisma.article.create({
      data: {
        title: "La littérature africaine francophone en plein renouveau",
        slug: "litterature-africaine-francophone-renouveau",
        excerpt:
          "Une nouvelle génération d'écrivains africains francophones séduit la critique et le grand public.",
        content:
          "La littérature africaine francophone connaît un renouveau spectaculaire. Mohamed Mbougar Sarr, prix Goncourt 2021 avec La plus secrète mémoire des hommes, a ouvert la voie à une nouvelle génération d'écrivains.\n\nDjamili Amadou Amal, Djaïli Amadou Amal, Gauz, Nathacha Appanah — autant de voix qui enrichissent la littérature francophone tout en explorant les thématiques propres au continent africain et à sa diaspora.\n\nLes festivals littéraires africains se multiplient en Europe, témoignant de l'engouement croissant pour ces voix nouvelles.",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
        category: "CULTURE",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 28 * DAY),
        dayCount: 29,
      },
    }),
    prisma.article.create({
      data: {
        title: "Santé : les innovations médicales made in Africa",
        slug: "innovations-medicales-made-in-africa",
        excerpt:
          "Du vaccin antipaludéen aux applications de télémédecine, le continent innove pour répondre à ses défis sanitaires.",
        content:
          "L'Afrique n'attend plus les solutions venues d'ailleurs. Le continent développe ses propres innovations médicales, adaptées à ses réalités. Le vaccin antipaludéen développé au Burkina Faso, les applications de télémédecine au Rwanda, les drones de livraison de sang au Ghana.\n\nCes innovations, nées de la nécessité, sont souvent plus adaptées et moins coûteuses que les solutions occidentales. Elles attirent l'attention de la communauté scientifique internationale.\n\nLa diaspora médicale africaine en Europe joue un rôle crucial dans le transfert de compétences et de technologies.",
        gradientClass: "j-g4",
        category: "ACTUALITE",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 30 * DAY),
        dayCount: 31,
      },
    }),
    prisma.article.create({
      data: {
        title: "Agriculture urbaine : les fermes verticales fleurissent à Lagos",
        slug: "agriculture-urbaine-fermes-verticales-lagos",
        excerpt:
          "Face à l'urbanisation galopante, Lagos mise sur l'agriculture verticale pour nourrir ses 20 millions d'habitants.",
        content:
          "Lagos, mégalopole de plus de 20 millions d'habitants, fait face à un défi alimentaire majeur. L'agriculture urbaine, et en particulier les fermes verticales, apparaît comme une solution prometteuse.\n\nDes startups nigérianes développent des solutions innovantes de culture hydroponique et aéroponique, permettant de produire des légumes frais en plein cœur de la ville. Ces initiatives créent des emplois et réduisent la dépendance aux importations.\n\nLe modèle essaime dans d'autres villes africaines, de Nairobi à Dakar.",
        coverImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
        category: "BUSINESS",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 35 * DAY),
        dayCount: 36,
      },
    }),
    prisma.article.create({
      data: {
        title: "Mode éthique : le wax peut-il sauver la fast fashion ?",
        slug: "mode-ethique-wax-fast-fashion",
        excerpt:
          "Les textiles africains traditionnels offrent une alternative durable et éthique à la mode jetable.",
        content:
          "Alors que l'industrie de la fast fashion est de plus en plus critiquée pour son impact environnemental, les textiles africains traditionnels offrent une alternative séduisante. Le wax, le kente, le bogolan sont des tissus durables, fabriqués artisanalement.\n\nDes créateurs de la diaspora développent des marques de mode éthique qui valorisent ces savoir-faire tout en répondant aux attentes des consommateurs occidentaux en matière de durabilité.\n\nCette tendance s'inscrit dans un mouvement plus large de décolonisation de la mode et de valorisation des cultures non-occidentales.",
        gradientClass: "j-g7",
        category: "LIFESTYLE",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 40 * DAY),
        dayCount: 41,
      },
    }),
    prisma.article.create({
      data: {
        title: "Éducation : les universités africaines attirent les étudiants du monde entier",
        slug: "universites-africaines-etudiants-monde",
        excerpt:
          "De nouvelles universités d'excellence émergent sur le continent et attirent des talents internationaux.",
        content:
          "L'enseignement supérieur africain se transforme. Des institutions comme l'African Leadership University au Rwanda, l'Ashesi University au Ghana et l'ALU School of Business attirent des étudiants du monde entier.\n\nCes universités nouvelle génération proposent des cursus innovants, axés sur l'entrepreneuriat, le leadership et la résolution des problèmes africains. Elles forment la prochaine génération de leaders du continent.\n\nPour les jeunes de la diaspora, ces universités représentent une opportunité de renouer avec leurs racines tout en bénéficiant d'une formation d'excellence.",
        coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
        category: "ACTUALITE",
        position: "ARCHIVES",
        authorId: admin.id,
        publishedAt: new Date(now - 45 * DAY),
        dayCount: 46,
      },
    }),
  ]);

  console.log(`Created ${articles.length} articles`);

  // ─── JOURNAL ADS (15 total) ─────────────────────────────

  const journalAds = await Promise.all([
    // 6 BANNER ads
    prisma.journalAd.create({
      data: {
        title: "Foire D'Afrique Paris 2026",
        description: "Le plus grand salon africain de Paris — 1er & 2 mai. Artisanat, gastronomie, concerts live.",
        placement: "BANNER",
        ctaText: "Réserver",
        ctaUrl: "https://dreamteamafrica.com/events/foire-afrique-paris-2026",
        gradientClass: "j-g1",
        advertiserName: "Dream Team Africa",
        campaignWeeks: 6,
        campaignStart: new Date(now - 7 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Tongoro — Collection Été 2026",
        description: "Découvrez la nouvelle collection inspirée des textiles du Sahel. Livraison offerte en Europe.",
        placement: "BANNER",
        ctaText: "Découvrir",
        ctaUrl: "https://tongoro.com",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
        advertiserName: "Tongoro Studio",
        price: "89 EUR",
        campaignWeeks: 4,
        campaignStart: new Date(now - 3 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Wave — Envoyez de l'argent en Afrique",
        description: "Transferts instantanés, frais réduits. Plus de 10 pays disponibles.",
        placement: "BANNER",
        ctaText: "Essayer Wave",
        ctaUrl: "https://wave.com",
        gradientClass: "j-g3",
        advertiserName: "Wave",
        iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        campaignWeeks: 8,
        campaignStart: new Date(now - 14 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Flutterwave Business",
        description: "La passerelle de paiement N°1 en Afrique. Intégration en 5 minutes.",
        placement: "BANNER",
        ctaText: "Commencer",
        ctaUrl: "https://flutterwave.com",
        gradientClass: "j-g5",
        advertiserName: "Flutterwave",
        campaignWeeks: 4,
        campaignStart: new Date(now - 5 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Festival du Conte Africain",
        description: "Sous l'arbre à palabre — 11 novembre 2026 à Paris. Griots et conteurs.",
        placement: "BANNER",
        ctaText: "Billetterie",
        ctaUrl: "https://dreamteamafrica.com/events/festival-conte-africain-2026",
        gradientClass: "j-g9",
        advertiserName: "Dream Team Africa",
        campaignWeeks: 3,
        campaignStart: new Date(now - 1 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Air Sénégal — Vols directs Paris-Dakar",
        description: "À partir de 299€ A/R. Nouveaux horaires été 2026.",
        placement: "BANNER",
        ctaText: "Réserver",
        ctaUrl: "https://flyairsenegal.com",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&q=80",
        advertiserName: "Air Sénégal",
        price: "299 EUR",
        campaignWeeks: 6,
        campaignStart: new Date(now - 10 * DAY),
      },
    }),

    // 2 INLINE ads
    prisma.journalAd.create({
      data: {
        title: "Salon Made In Africa — L'artisanat africain à Paris",
        description: "Plus de 500 artisans exposants. Mode, décoration, cosmétiques, épicerie fine. 11-12 décembre 2026 à l'Espace Mas.",
        placement: "INLINE",
        ctaText: "Obtenir mon badge",
        ctaUrl: "https://dreamteamafrica.com/events/salon-made-in-africa-2026",
        imageUrl: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80",
        advertiserName: "Dream Team Africa",
        iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9m3 10H5m14-5H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>',
        campaignWeeks: 8,
        campaignStart: new Date(now - 10 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Chipper Cash — Transferts gratuits entre pays africains",
        description: "Envoyez et recevez de l'argent sans frais dans 9 pays d'Afrique. Téléchargez l'app.",
        placement: "INLINE",
        ctaText: "Télécharger",
        ctaUrl: "https://chippercash.com",
        gradientClass: "j-g6",
        advertiserName: "Chipper Cash",
        price: "0 EUR de frais",
        iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
        campaignWeeks: 6,
        campaignStart: new Date(now - 5 * DAY),
      },
    }),

    // 1 VIDEO ad
    prisma.journalAd.create({
      data: {
        title: "Évasion Paris — Croisière culturelle sur la Seine",
        description: "Concerts, dégustations, art contemporain africain. Une expérience unique le 13 juin 2026.",
        placement: "VIDEO",
        ctaText: "Réserver ma place",
        ctaUrl: "https://dreamteamafrica.com/events/evasion-paris-2026",
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
        advertiserName: "Évasion Paris",
        price: "150 EUR",
        campaignWeeks: 10,
        campaignStart: new Date(now - 14 * DAY),
      },
    }),

    // 6 SIDEBAR ads
    prisma.journalAd.create({
      data: {
        title: "Bijoux Akan — Collection Adinkra",
        description: "Bijoux artisanaux inspirés des symboles Akan. Plaqué or 18 carats.",
        placement: "SIDEBAR",
        ctaText: "Voir la collection",
        ctaUrl: "https://dreamteamafrica.com/marketplace/bijoux",
        imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80",
        advertiserName: "Aminata Créations",
        price: "89 EUR",
        campaignWeeks: 4,
        campaignStart: new Date(now - 2 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Cuir de Tombouctou",
        description: "Sacs et accessoires en cuir tanné végétal. Gravures Touareg authentiques.",
        placement: "SIDEBAR",
        ctaText: "Commander",
        ctaUrl: "https://dreamteamafrica.com/marketplace/maroquinerie",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
        advertiserName: "Fatou Cuir",
        price: "120 EUR",
        campaignWeeks: 4,
        campaignStart: new Date(now - 3 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Kente Premium — Tissu artisanal du Ghana",
        description: "Écharpes et accessoires en authentique Kente. Livraison Europe offerte.",
        placement: "SIDEBAR",
        ctaText: "Acheter",
        ctaUrl: "https://dreamteamafrica.com/marketplace/mode",
        gradientClass: "j-g2",
        advertiserName: "Kofi Textiles",
        price: "65 EUR",
        iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2 12 3.46 8 2 3.62 3.46a1 1 0 00-.62.94V20a1 1 0 001.38.92L8 19l4 1.46L16 19l4.38 1.92A1 1 0 0021 20V4.4a1 1 0 00-.62-.94z"/></svg>',
        campaignWeeks: 3,
        campaignStart: new Date(now - 1 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Juste Une Danse — Billetterie ouverte",
        description: "Festival des danses traditionnelles africaines. 31 octobre à l'Espace Mas.",
        placement: "SIDEBAR",
        ctaText: "Prendre un billet",
        ctaUrl: "https://dreamteamafrica.com/events/juste-une-danse-2026",
        gradientClass: "j-g4",
        advertiserName: "Dream Team Africa",
        campaignWeeks: 6,
        campaignStart: new Date(now - 7 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Masques Igbo — Art décoratif",
        description: "Masques sculptés à la main en bois d'ébène. Pièces uniques signées.",
        placement: "SIDEBAR",
        ctaText: "Découvrir",
        ctaUrl: "https://dreamteamafrica.com/marketplace/decoration",
        imageUrl: "https://images.unsplash.com/photo-1580618864180-f6e7fb65f0be?w=400&q=80",
        advertiserName: "Chidi Art",
        price: "95 EUR",
        campaignWeeks: 4,
        campaignStart: new Date(now - 4 * DAY),
      },
    }),
    prisma.journalAd.create({
      data: {
        title: "Africa Tech Summit 2026",
        description: "Le rendez-vous annuel de la tech africaine. Conférences, networking, hackathon.",
        placement: "SIDEBAR",
        ctaText: "S'inscrire",
        ctaUrl: "https://africatechsummit.com",
        gradientClass: "j-g8",
        advertiserName: "Africa Tech Summit",
        iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01.02-5.72 2.5 2.5 0 012.96-3.08A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00-.02-5.72 2.5 2.5 0 00-2.96-3.08A2.5 2.5 0 0014.5 2z"/></svg>',
        campaignWeeks: 5,
        campaignStart: new Date(now - 8 * DAY),
      },
    }),
  ]);

  console.log(`Created ${journalAds.length} journal ads`);

  // ─── NEWSLETTER SUBSCRIBERS (8 emails) ──────────────────

  const subscribers = await Promise.all([
    prisma.newsletterSubscriber.create({
      data: { email: "reader1@example.com", isActive: true },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "reader2@example.com", isActive: true },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "aminata.fan@gmail.com", isActive: true },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "diaspora.paris@outlook.fr", isActive: true },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "culturevibe@proton.me", isActive: true },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "ancien.lecteur@free.fr", isActive: false },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "unsubscribed@test.com", isActive: false },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: "news.afrique@laposte.net", isActive: true },
    }),
  ]);

  console.log(`Created ${subscribers.length} newsletter subscribers`);

  // ─── INSCRIPTIONS (L'OFFICIEL D'AFRIQUE) ────────────────

  const inscriptions = await Promise.all([
    prisma.inscription.create({
      data: {
        entreprise: "Chez Mama Afrique",
        categorie: "Restaurant",
        directeur: "Marie-Claire Kouassi",
        adresse: "12 rue de la Paix",
        ville: "Paris",
        codePostal: "75010",
        pays: "France",
        mobile: "+33 6 12 34 56 78",
        email: "contact@chezmamaafrique.fr",
        siteWeb: "https://chezmamaafrique.fr",
        instagram: "@chezmamaafrique",
        description: "Restaurant africain authentique proposant des spécialités ivoiriennes, sénégalaises et camerounaises. Ambiance chaleureuse, plats faits maison.",
        motsCles: "restaurant, africain, ivoirien, sénégalais, Paris",
        newsletter: true,
        status: "VALIDATED",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Afro Styles Coiffure",
        categorie: "Coiffure & Beauté",
        directeur: "Fatima Diop",
        adresse: "45 avenue de la République",
        ville: "Montreuil",
        codePostal: "93100",
        pays: "France",
        mobile: "+33 7 98 76 54 32",
        email: "rdv@afrostyles.fr",
        facebook: "AfroStylesCoiffure",
        instagram: "@afrostyles_official",
        description: "Salon de coiffure afro spécialisé dans les tresses, locks, tissages et soins capillaires naturels. Produits bio et made in Africa.",
        motsCles: "coiffure, afro, tresses, locks, beauté",
        newsletter: true,
        status: "VALIDATED",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Wax & Co Design",
        categorie: "Mode & Textile",
        directeur: "Adama Traoré",
        ville: "Lyon",
        codePostal: "69003",
        pays: "France",
        mobile: "+33 6 55 44 33 22",
        email: "hello@waxandco.com",
        siteWeb: "https://waxandco.com",
        instagram: "@waxandco",
        tiktok: "@waxandco_design",
        description: "Marque de mode éthique utilisant des tissus wax africains. Collections homme et femme, sur mesure et prêt-à-porter.",
        motsCles: "mode, wax, africain, éthique, lyon",
        newsletter: true,
        status: "VALIDATED",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Dakar Digital Agency",
        categorie: "Technologie",
        directeur: "Ibrahima Sow",
        ville: "Dakar",
        pays: "Sénégal",
        mobile: "+221 77 123 45 67",
        email: "contact@dakardigital.sn",
        siteWeb: "https://dakardigital.sn",
        linkedin: "dakar-digital-agency",
        description: "Agence digitale spécialisée en développement web, mobile et marketing digital pour les entreprises africaines et de la diaspora.",
        motsCles: "digital, tech, web, Dakar, marketing",
        newsletter: false,
        status: "PENDING",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Mami Wata Cosmetics",
        categorie: "Santé & Bien-être",
        directeur: "Grace Okonkwo",
        adresse: "78 boulevard Voltaire",
        ville: "Paris",
        codePostal: "75011",
        pays: "France",
        mobile: "+33 6 77 88 99 00",
        email: "info@mamiwatacosmetics.com",
        siteWeb: "https://mamiwatacosmetics.com",
        instagram: "@mamiwatacosmetics",
        youtube: "MamiWataBeauty",
        description: "Cosmétiques naturels inspirés des traditions africaines. Soins pour la peau et les cheveux, 100% naturels et fabriqués en France.",
        motsCles: "cosmétiques, naturel, beauté, soins, afro",
        newsletter: true,
        status: "PENDING",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Saveurs du Sahel",
        categorie: "Commerce",
        directeur: "Moussa Keita",
        ville: "Marseille",
        codePostal: "13001",
        pays: "France",
        mobile: "+33 6 11 22 33 44",
        email: "commandes@saveursdusahel.fr",
        description: "Épicerie fine africaine : épices, farines, condiments, boissons traditionnelles. Import direct du Mali, Burkina Faso et Niger.",
        motsCles: "épicerie, africain, sahel, épices, Marseille",
        newsletter: false,
        status: "VALIDATED",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Kora Music School",
        categorie: "Culture & Art",
        directeur: "Sékou Diabaté",
        ville: "Bruxelles",
        pays: "Belgique",
        mobile: "+32 471 23 45 67",
        email: "inscription@koramusicschool.be",
        siteWeb: "https://koramusicschool.be",
        facebook: "KoraMusicSchool",
        description: "École de musique traditionnelle africaine. Cours de kora, djembé, balafon. Stages et concerts toute l'année.",
        motsCles: "musique, kora, djembé, cours, Bruxelles",
        newsletter: true,
        status: "PENDING",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Baobab Immobilier",
        categorie: "Immobilier",
        directeur: "Jean-Pierre Ndoye",
        ville: "Abidjan",
        pays: "Côte d'Ivoire",
        mobile: "+225 07 08 09 10 11",
        email: "info@baobab-immo.ci",
        siteWeb: "https://baobab-immo.ci",
        whatsapp: "+22507080910",
        description: "Agence immobilière pour la diaspora. Achat, vente et gestion locative de biens en Côte d'Ivoire. Accompagnement à distance.",
        motsCles: "immobilier, diaspora, Abidjan, investissement",
        newsletter: true,
        status: "REJECTED",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Trans-Africa Express",
        categorie: "Transport",
        directeur: "Ousmane Bah",
        ville: "Paris",
        codePostal: "75018",
        pays: "France",
        mobile: "+33 6 99 88 77 66",
        email: "contact@transafricaexpress.fr",
        description: "Service de transport et livraison de colis vers l'Afrique de l'Ouest. Envoi de fret maritime et aérien. Devis gratuit.",
        motsCles: "transport, colis, Afrique, fret, livraison",
        newsletter: false,
        status: "PENDING",
      },
    }),
    prisma.inscription.create({
      data: {
        entreprise: "Afrika Tiss",
        categorie: "Artisanat",
        directeur: "Aminata Coulibaly",
        adresse: "5 rue des Artisans",
        ville: "Toulouse",
        codePostal: "31000",
        pays: "France",
        mobile: "+33 6 44 55 66 77",
        email: "atelier@afrikatiss.com",
        instagram: "@afrikatiss",
        description: "Atelier de couture et de création textile. Confection sur mesure en wax, bazin et bogolan. Cours de couture africaine.",
        motsCles: "artisanat, couture, wax, bogolan, Toulouse",
        newsletter: true,
        status: "VALIDATED",
      },
    }),
  ]);

  console.log(`Created ${inscriptions.length} inscriptions`);

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
