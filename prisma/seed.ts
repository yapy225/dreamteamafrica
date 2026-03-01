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
        title: "Festival International du Cinéma Africain (FICA) — Édition 2026",
        slug: "festival-international-cinema-africain-2026",
        description:
          "Deux journées de cinéma, de mémoire et de dialogue au cœur de Fontenay-sous-Bois.\n\nLe Festival International du Cinéma Africain (FICA) revient pour une nouvelle édition les 4 et 5 avril 2026. Au programme : deux films puissants suivis de débats avec le Ciné Club Afro, dans un lieu chaleureux ouvert à toutes et tous.\n\nL'esprit du FICA :\n• Valoriser le cinéma africain et de la diaspora\n• Créer un espace de débat et de réflexion autour des œuvres\n• Rendre la culture accessible (séance du dimanche gratuite)\n• Tisser des liens entre artistes, associations et publics\n• Célébrer la diversité des récits et des regards sur l'Afrique",
        coverImage:
          "https://fxsckhiprgvaidgc.public.blob.vercel-storage.com/saisonculturelleafricaine/fica/festivalinternationalducinemaafricain%201%3A1.png",
        venue: "Maison des Citoyens et de la Vie Associative",
        address: "16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois",
        date: new Date("2026-04-04T14:00:00"),
        endDate: new Date("2026-04-05T18:00:00"),
        capacity: 300,
        priceEarly: 0,
        priceStd: 0,
        priceVip: 0,
        program: [
          {
            date: "2026-04-04",
            time: "14:00",
            venue: "Maison des Citoyens et de la Vie Associative",
            address: "16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois",
            type: "Projection + Débat",
            title: "Dahomey",
            director: "Mati Diop",
            synopsis: "Ours d'or à la Berlinale 2024. En novembre 2021, vingt-six trésors royaux du Dahomey quittent Paris pour être restitués au Bénin. Le film accompagne leur voyage et interroge la mémoire, l'héritage colonial et la restitution du patrimoine africain.",
            pricing: "7 €",
            note: "Projection suivie d'un débat animé par le Ciné Club Afro.",
          },
          {
            date: "2026-04-05",
            time: "14:00",
            venue: "Maison des Citoyens et de la Vie Associative",
            address: "16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois",
            type: "Projection + Débat",
            title: "Les Ministres des Poubelles",
            director: "Quentin Noirfalisse",
            synopsis: "Documentaire saisissant sur les récupérateurs informels de Kinshasa qui transforment les déchets en ressources. Un regard sur l'économie circulaire, la débrouillardise et la dignité au quotidien.",
            pricing: "Gratuit",
            note: "Projection suivie d'un débat animé par le Ciné Club Afro.",
          },
        ],
        tiers: [
          {
            id: "JOUR1_DAHOMEY",
            name: "Jour 1 — Dahomey",
            price: 7,
            description: "Samedi 4 avril — Projection de « Dahomey » de Mati Diop + débat",
            features: [
              "Projection du film Dahomey (Ours d'or 2024)",
              "Débat avec le Ciné Club Afro",
              "Accès à la salle dès 13h30",
            ],
            highlight: true,
          },
          {
            id: "JOUR2_MINISTRES",
            name: "Jour 2 — Les Ministres des Poubelles",
            price: 0,
            description: "Dimanche 5 avril — Projection de « Les Ministres des Poubelles » + débat",
            features: [
              "Projection du documentaire",
              "Débat avec le Ciné Club Afro",
              "Entrée libre et gratuite",
            ],
            highlight: false,
          },
        ],
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
  // Categories must match frontend slugs: artistes, disques, studios, medias,
  // reseaux-sociaux, services, scenes, evenements, discotheques, agents-sportifs,
  // football, basketball, rugby, magasins, restaurants, cooperations, organismes,
  // ambassades, associations, aeroports, international

  const inscriptionData = [
    // ── ARTISTES (3) ──
    { entreprise: "Fally Ipupa Management", categorie: "artistes", directeur: "Fally Ipupa", ville: "Paris", codePostal: "75008", pays: "France", mobile: "+33 6 12 34 56 78", email: "management@fallyipupa.com", siteWeb: "https://fallyipupa.com", instagram: "@fallyipupa", youtube: "FallyIpupaVEVO", description: "Artiste musicien congolais, auteur-compositeur-interprète et danseur. Rumba congolaise, afrobeat et R&B. Plus de 15 albums et tournées internationales.", motsCles: "musique, rumba, congolais, chanteur, danseur", status: "VALIDATED", newsletter: true },
    { entreprise: "Aya Nakamura Officiel", categorie: "artistes", directeur: "Aya Danioko", ville: "Paris", codePostal: "75019", pays: "France", mobile: "+33 7 98 76 54 32", email: "booking@ayanakamura.fr", siteWeb: "https://ayanakamura.fr", instagram: "@aabordelais", tiktok: "@ayanakamura", description: "Chanteuse et auteure-compositrice franco-malienne. Pop urbaine et afropop. Artiste francophone la plus écoutée au monde sur les plateformes.", motsCles: "chanteuse, pop, afropop, franco-malienne", status: "VALIDATED", newsletter: true },
    { entreprise: "DJ Arafat Legacy", categorie: "artistes", directeur: "Fondation Arafat", ville: "Abidjan", pays: "Côte d'Ivoire", mobile: "+225 07 12 34 56", email: "fondation@djarafat.ci", instagram: "@djarafatofficiel", description: "Gestion de l'héritage musical du roi du coupé-décalé. Catalogue musical, événements hommage et fondation pour les jeunes artistes ivoiriens.", motsCles: "coupé-décalé, DJ, ivoirien, danse, hommage", status: "VALIDATED", newsletter: false },

    // ── DISQUES (3) ──
    { entreprise: "Wagram Music Africa", categorie: "disques", directeur: "Stéphane Bitton", ville: "Paris", codePostal: "75010", pays: "France", mobile: "+33 1 44 54 30 00", telephone: "+33 1 44 54 30 01", email: "africa@wfragrammusic.com", siteWeb: "https://wagrammusic.com", linkedin: "wagram-music", description: "Label indépendant français avec un catalogue riche en musiques africaines. Distribution physique et digitale, édition musicale et management d'artistes.", motsCles: "label, distribution, édition, musique africaine", status: "VALIDATED", newsletter: true },
    { entreprise: "Syllart Records", categorie: "disques", directeur: "Ibrahima Sylla", ville: "Paris", codePostal: "75011", pays: "France", mobile: "+33 6 55 44 33 22", email: "contact@syllartrecords.com", siteWeb: "https://syllartrecords.com", description: "Maison de disques historique spécialisée dans les musiques ouest-africaines. Plus de 500 albums au catalogue : manding, mbalax, afrobeat, highlife.", motsCles: "label, manding, mbalax, afrobeat, highlife", status: "VALIDATED", newsletter: true },
    { entreprise: "Lusafrica", categorie: "disques", directeur: "José da Silva", ville: "Paris", codePostal: "75004", pays: "France", mobile: "+33 6 11 22 33 44", email: "info@lusafrica.com", siteWeb: "https://lusafrica.com", description: "Label de référence pour les musiques lusophones d'Afrique. Catalogue Cap-Vert, Angola, Mozambique, Guinée-Bissau. Cesária Évora, Bonga, Mariza.", motsCles: "lusophone, Cap-Vert, morna, Angola, semba", status: "VALIDATED", newsletter: false },

    // ── STUDIOS (2) ──
    { entreprise: "Studio Davout", categorie: "studios", directeur: "Marc Sénécal", ville: "Paris", codePostal: "75020", pays: "France", mobile: "+33 6 77 88 99 00", email: "booking@studiodavout.com", siteWeb: "https://studiodavout.com", instagram: "@studiodavout", description: "Studio d'enregistrement professionnel ayant accueilli de nombreux artistes africains. Salif Keita, Youssou N'Dour, Angélique Kidjo y ont enregistré.", motsCles: "studio, enregistrement, mixage, mastering, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "Okoye Sound Lab", categorie: "studios", directeur: "Chidi Okoye", ville: "Montreuil", codePostal: "93100", pays: "France", mobile: "+33 7 66 55 44 33", email: "sessions@okoyesound.fr", instagram: "@okoyesoundlab", description: "Studio de production musicale spécialisé afrobeats, amapiano et afro-house. Beatmaking, enregistrement vocal, mixage et mastering.", motsCles: "production, afrobeats, amapiano, beatmaking", status: "VALIDATED", newsletter: true },

    // ── MEDIAS (3) ──
    { entreprise: "Africa Radio", categorie: "medias", directeur: "Dominique Guihot", ville: "Paris", codePostal: "75008", pays: "France", mobile: "+33 1 56 69 22 22", email: "redaction@africaradio.com", siteWeb: "https://africaradio.com", facebook: "AfricaRadioOfficiel", description: "Première radio consacrée au continent africain en France. Actualités, culture, musique et débats. FM Paris 107.5 et streaming mondial.", motsCles: "radio, actualités, Afrique, FM, podcast", status: "VALIDATED", newsletter: true },
    { entreprise: "Africanews / Euronews", categorie: "medias", directeur: "Catherine Monnet", ville: "Lyon", codePostal: "69002", pays: "France", mobile: "+33 4 72 18 80 00", email: "contact@africanews.com", siteWeb: "https://fr.africanews.com", instagram: "@africanews", youtube: "africanews", description: "Chaîne d'information panafricaine multilingue. Actualités en continu, reportages et documentaires sur le continent africain.", motsCles: "TV, information, panafricain, actualités", status: "VALIDATED", newsletter: false },
    { entreprise: "Amina Magazine", categorie: "medias", directeur: "Aïda Diallo", ville: "Paris", codePostal: "75009", pays: "France", mobile: "+33 6 33 22 11 00", email: "redaction@aminamagazine.com", siteWeb: "https://aminamagazine.com", instagram: "@aminamagazine", description: "Magazine féminin panafricain depuis 1972. Mode, beauté, culture, société et portraits de femmes africaines inspirantes.", motsCles: "magazine, féminin, mode, beauté, panafricain", status: "VALIDATED", newsletter: true },

    // ── RESEAUX SOCIAUX (2) ──
    { entreprise: "Afrique Créative Agency", categorie: "reseaux-sociaux", directeur: "Lamine Sarr", ville: "Paris", codePostal: "75002", pays: "France", mobile: "+33 7 44 55 66 77", email: "hello@afriquecreative.com", siteWeb: "https://afriquecreative.com", instagram: "@afriquecreative", tiktok: "@afriquecreative", description: "Agence d'influence et de community management spécialisée Afrique et diaspora. Gestion de réseaux sociaux, campagnes d'influence, création de contenu.", motsCles: "influence, community management, réseaux sociaux, contenu", status: "VALIDATED", newsletter: true },
    { entreprise: "Nofi Media", categorie: "reseaux-sociaux", directeur: "Moussa Diombana", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 6 88 77 66 55", email: "contact@nofi.media", siteWeb: "https://nofi.media", instagram: "@nofimedia", facebook: "NOFIMedia", youtube: "NOFIMedia", description: "Média digital dédié aux cultures noires et africaines. Plus de 3 millions de followers. Actualité, histoire, lifestyle et identité.", motsCles: "média digital, cultures noires, lifestyle, histoire", status: "VALIDATED", newsletter: true },

    // ── SERVICES (2) ──
    { entreprise: "Buntu Design Studio", categorie: "services", directeur: "Kwame Asante", ville: "Paris", codePostal: "75003", pays: "France", mobile: "+33 6 99 88 77 66", email: "create@buntu-design.com", siteWeb: "https://buntu-design.com", instagram: "@buntudesign", description: "Studio de création graphique et audiovisuelle. Identité visuelle, pochettes d'album, clips musicaux et direction artistique pour artistes africains.", motsCles: "graphisme, pochette, clip, direction artistique", status: "VALIDATED", newsletter: true },
    { entreprise: "Sahel Productions", categorie: "services", directeur: "Aïssata Tall", ville: "Bordeaux", codePostal: "33000", pays: "France", mobile: "+33 6 22 33 44 55", email: "production@sahelproductions.fr", siteWeb: "https://sahelproductions.fr", description: "Société de production audiovisuelle. Documentaires, films et captations live spécialisés Afrique et diaspora. Équipe bilingue français-anglais.", motsCles: "production, documentaire, film, captation, vidéo", status: "VALIDATED", newsletter: false },

    // ── SCENES (3) ──
    { entreprise: "La Bellevilloise", categorie: "scenes", directeur: "Renaud Barillet", adresse: "19 rue Boyer", ville: "Paris", codePostal: "75020", pays: "France", mobile: "+33 1 46 36 07 07", email: "programmation@labellevilloise.com", siteWeb: "https://labellevilloise.com", instagram: "@labellevilloise", description: "Lieu culturel parisien emblématique des musiques du monde et afro. Concerts, soirées, expositions et brunchs africains chaque weekend.", motsCles: "salle, concerts, musiques du monde, afro, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "Festival Afropunk Paris", categorie: "scenes", directeur: "Jocelyn Cooper", ville: "Paris", pays: "France", mobile: "+33 7 11 22 33 44", email: "paris@afropunk.com", siteWeb: "https://afropunk.com", instagram: "@afropunk", description: "Festival international de musique et de culture noire. Concerts, art, mode et activisme. Édition parisienne chaque été.", motsCles: "festival, afropunk, musique, culture, été", status: "VALIDATED", newsletter: true },
    { entreprise: "Théâtre de la Reine Blanche", categorie: "scenes", directeur: "Catherine Lara", adresse: "2 bis passage Ruelle", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 1 40 05 06 96", email: "reservation@reineblanche.com", siteWeb: "https://reineblanche.com", description: "Théâtre dédié aux arts vivants et sciences. Programmation régulière de pièces d'auteurs africains et de la diaspora.", motsCles: "théâtre, spectacle vivant, auteurs africains", status: "VALIDATED", newsletter: false },

    // ── EVENEMENTS (3) ──
    { entreprise: "Africa Fashion Week Paris", categorie: "evenements", directeur: "Adama Paris", ville: "Paris", pays: "France", mobile: "+33 6 78 90 12 34", email: "contact@africafashionweekparis.com", siteWeb: "https://africafashionweekparis.com", instagram: "@afwparis", description: "Semaine de la mode africaine à Paris. Défilés de créateurs africains, showrooms et conférences. Rendez-vous incontournable de la mode afro.", motsCles: "mode, fashion week, défilé, créateurs, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "MASA - Marché des Arts du Spectacle", categorie: "evenements", directeur: "Yacouba Konaté", ville: "Abidjan", pays: "Côte d'Ivoire", mobile: "+225 27 22 44 56 78", email: "info@masa.ci", siteWeb: "https://masa.ci", facebook: "MASAofficiel", description: "Plus grand marché professionnel des arts du spectacle en Afrique. Spectacles, concerts, danse, théâtre et marché de l'industrie culturelle.", motsCles: "marché, spectacle, professionnel, industrie culturelle", status: "VALIDATED", newsletter: true },
    { entreprise: "Nuits d'Afrique Montréal", categorie: "evenements", directeur: "Suzanne Rousseau", ville: "Montréal", pays: "Canada", mobile: "+1 514 499 98 39", email: "info@festivalnuitsdafrique.com", siteWeb: "https://festivalnuitsdafrique.com", instagram: "@nuitsdafrique", description: "Festival de musiques et danses africaines et caribéennes. 37 éditions, 800 artistes, 700 000 spectateurs. Juillet à Montréal.", motsCles: "festival, musique, danse, Montréal, caribéen", status: "VALIDATED", newsletter: false },

    // ── DISCOTHEQUES (2) ──
    { entreprise: "Le Balajo", categorie: "discotheques", directeur: "Patrick Mouratoglou", adresse: "9 rue de Lappe", ville: "Paris", codePostal: "75011", pays: "France", mobile: "+33 1 47 00 07 87", email: "contact@balajo.fr", siteWeb: "https://balajo.fr", instagram: "@lebalajo", description: "Club parisien mythique accueillant les plus grandes soirées afro, tropical et coupé-décalé. Ambiance survoltée chaque vendredi et samedi.", motsCles: "club, soirée afro, tropical, coupé-décalé, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "Nuit Blanche Afro Club", categorie: "discotheques", directeur: "Seydou Konaté", ville: "Lyon", codePostal: "69001", pays: "France", mobile: "+33 7 55 66 77 88", email: "reservations@nbaclub.fr", instagram: "@nbaclub_lyon", description: "Discothèque spécialisée musiques afro à Lyon. Afrobeats, amapiano, ndombolo, dancehall. Soirées thématiques et artistes live.", motsCles: "discothèque, afrobeats, amapiano, Lyon, soirée", status: "VALIDATED", newsletter: true },

    // ── AGENTS SPORTIFS (2) ──
    { entreprise: "Africa Sports Management", categorie: "agents-sportifs", directeur: "Pape Diouf", ville: "Marseille", codePostal: "13008", pays: "France", mobile: "+33 6 12 45 78 90", email: "contact@africasportsmanagement.com", siteWeb: "https://africasportsmanagement.com", linkedin: "africa-sports-management", description: "Agence de management sportif spécialisée dans les joueurs africains en Europe. Transferts, négociations de contrats et suivi de carrière.", motsCles: "agent, transfert, football, contrat, joueurs africains", status: "VALIDATED", newsletter: true },
    { entreprise: "Klopp Sports Agency", categorie: "agents-sportifs", directeur: "Mamadou Ndiaye", ville: "Paris", codePostal: "75016", pays: "France", mobile: "+33 7 99 88 77 66", email: "agents@kloppsports.com", siteWeb: "https://kloppsports.com", description: "Cabinet d'agents sportifs gérant des sportifs africains de haut niveau. Football, basketball et athlétisme. Accompagnement juridique et fiscal.", motsCles: "agent, sportif, haut niveau, juridique, fiscal", status: "VALIDATED", newsletter: false },

    // ── FOOTBALL (3) ──
    { entreprise: "AS Beauvais Oise", categorie: "football", directeur: "Mohamed Kanté", ville: "Beauvais", codePostal: "60000", pays: "France", mobile: "+33 3 44 02 57 77", email: "secretariat@asbeauvais.fr", siteWeb: "https://asbeauvais.fr", description: "Club de football français avec une forte représentation de joueurs issus de la diaspora africaine. Centre de formation reconnu.", motsCles: "football, club, formation, National, Beauvais", status: "VALIDATED", newsletter: false },
    { entreprise: "Africa United FC", categorie: "football", directeur: "Emmanuel Adebayor", ville: "Paris", pays: "France", mobile: "+33 6 33 44 55 66", email: "contact@africaunitedfc.com", siteWeb: "https://africaunitedfc.com", instagram: "@africaunitedfc", description: "Association sportive promouvant le football africain en Île-de-France. Tournois, détection de jeunes talents et échanges avec des clubs africains.", motsCles: "football, association, talents, tournoi, jeunes", status: "VALIDATED", newsletter: true },
    { entreprise: "FC Étoile d'Abidjan", categorie: "football", directeur: "Yaya Touré", ville: "Abidjan", pays: "Côte d'Ivoire", mobile: "+225 07 55 66 77", email: "info@etoileabidjan.ci", description: "Club de football professionnel ivoirien. Partenariats avec des clubs européens pour le développement de jeunes talents.", motsCles: "football, Côte d'Ivoire, formation, professionnel", status: "VALIDATED", newsletter: true },

    // ── BASKETBALL (2) ──
    { entreprise: "Nanterre 92 Basketball", categorie: "basketball", directeur: "Pascal Donnadieu", ville: "Nanterre", codePostal: "92000", pays: "France", mobile: "+33 1 47 29 05 60", email: "contact@nanterre92.com", siteWeb: "https://nanterre92.com", instagram: "@nanterre92basket", description: "Club de basketball français évoluant en Pro A. De nombreux joueurs d'origine africaine dans son effectif et son centre de formation.", motsCles: "basketball, Pro A, formation, Nanterre", status: "VALIDATED", newsletter: true },
    { entreprise: "Africa Basket Academy", categorie: "basketball", directeur: "Amadou Gallo Fall", ville: "Dakar", pays: "Sénégal", mobile: "+221 77 234 56 78", email: "academy@africabasket.org", siteWeb: "https://africabasket.org", description: "Académie de basketball formant les jeunes talents africains. Partenariat avec la NBA Basketball Africa League.", motsCles: "basketball, académie, NBA, BAL, formation", status: "VALIDATED", newsletter: true },

    // ── RUGBY (2) ──
    { entreprise: "Racing 92 Rugby", categorie: "rugby", directeur: "Jacky Lorenzetti", ville: "Nanterre", codePostal: "92000", pays: "France", mobile: "+33 1 41 91 76 00", email: "contact@racing92.fr", siteWeb: "https://racing92.fr", instagram: "@racing92", description: "Club de rugby du Top 14 comptant de nombreux internationaux africains. Section détection et formation de jeunes talents du continent.", motsCles: "rugby, Top 14, internationaux, formation", status: "VALIDATED", newsletter: false },
    { entreprise: "Association Rugby Africa France", categorie: "rugby", directeur: "Khaled Babbou", ville: "Paris", pays: "France", mobile: "+33 6 78 12 34 56", email: "contact@rugbyafricafrance.org", siteWeb: "https://rugbyafricafrance.org", description: "Association promouvant le rugby africain en France. Organisation de tournois, stages et échanges entre clubs français et africains.", motsCles: "rugby, Afrique, association, tournois, échanges", status: "VALIDATED", newsletter: true },

    // ── MAGASINS (3) ──
    { entreprise: "Château Rouge Records", categorie: "magasins", directeur: "Jean-Luc Mbappé", adresse: "24 rue Doudeauville", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 6 44 55 66 77", email: "shop@chateaurougerecords.fr", instagram: "@chateaurougerecords", description: "Disquaire spécialisé musiques africaines, caribéennes et black music. Vinyles, CD et merchandising. Institution du quartier Château Rouge depuis 1998.", motsCles: "disquaire, vinyles, musique africaine, Château Rouge", status: "VALIDATED", newsletter: true },
    { entreprise: "Maison Château Rouge", categorie: "magasins", directeur: "Youssouf Fofana", adresse: "40 rue Myrha", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 7 12 34 56 78", email: "boutique@maisonchateaurouge.com", siteWeb: "https://maisonchateaurouge.com", instagram: "@maisonchateaurouge", description: "Marque de mode et lifestyle inspirée de l'Afrique. Vêtements, accessoires et objets déco en wax et tissus africains. Collaboration avec Monoprix.", motsCles: "mode, wax, lifestyle, Château Rouge, déco", status: "VALIDATED", newsletter: true },
    { entreprise: "Exotic Market", categorie: "magasins", directeur: "Ousmane Bah", adresse: "15 rue de Suez", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 6 99 00 11 22", email: "contact@exoticmarket.fr", description: "Épicerie africaine de référence. Produits frais, épices, farines, boissons et cosmétiques importés directement d'Afrique de l'Ouest et centrale.", motsCles: "épicerie, africain, produits frais, épices, import", status: "VALIDATED", newsletter: false },

    // ── RESTAURANTS (3) ──
    { entreprise: "Chez Mama Afrique", categorie: "restaurants", directeur: "Marie-Claire Kouassi", adresse: "12 rue de la Paix", ville: "Paris", codePostal: "75010", pays: "France", mobile: "+33 6 12 34 56 78", email: "contact@chezmamaafrique.fr", siteWeb: "https://chezmamaafrique.fr", instagram: "@chezmamaafrique", description: "Restaurant africain authentique proposant des spécialités ivoiriennes, sénégalaises et camerounaises. Ambiance chaleureuse, plats faits maison.", motsCles: "restaurant, africain, ivoirien, sénégalais, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "Le Petit Dakar", categorie: "restaurants", directeur: "Awa Fall", adresse: "6 rue d'Enghien", ville: "Paris", codePostal: "75010", pays: "France", mobile: "+33 1 47 70 59 30", email: "reservation@lepetitdakar.fr", siteWeb: "https://lepetitdakar.fr", description: "Restaurant sénégalais reconnu pour son thiéboudienne, son yassa et son mafé. Traiteur pour événements. Terrasse en été.", motsCles: "sénégalais, thiéboudienne, yassa, traiteur, Paris", status: "VALIDATED", newsletter: true },
    { entreprise: "New Soul Food", categorie: "restaurants", directeur: "Rudy Lainé", adresse: "4 rue du Château d'Eau", ville: "Paris", codePostal: "75010", pays: "France", mobile: "+33 7 88 99 00 11", email: "hello@newsoulfood.fr", instagram: "@newsoulfood", tiktok: "@newsoulfood", description: "Restaurant afro-fusion mêlant cuisine caribéenne et ouest-africaine. Brunch le dimanche, cocktails tropicaux et concerts live le vendredi.", motsCles: "afro-fusion, caribéen, brunch, cocktails, live", status: "VALIDATED", newsletter: true },

    // ── COOPERATIONS (2) ──
    { entreprise: "Africa-France Business Club", categorie: "cooperations", directeur: "Lionel Zinsou", ville: "Paris", codePostal: "75008", pays: "France", mobile: "+33 1 42 65 30 00", email: "info@africafrancebc.org", siteWeb: "https://africafrancebc.org", linkedin: "africa-france-business-club", description: "Club d'affaires favorisant les partenariats économiques entre la France et l'Afrique. Networking, conférences et missions commerciales.", motsCles: "business, partenariat, France-Afrique, networking", status: "VALIDATED", newsletter: true },
    { entreprise: "Diaspora Business Hub", categorie: "cooperations", directeur: "Nathalie Yamb", ville: "Bruxelles", pays: "Belgique", mobile: "+32 2 345 67 89", email: "contact@diasporabusinesshub.eu", siteWeb: "https://diasporabusinesshub.eu", description: "Plateforme de coopération économique entre la diaspora africaine et le continent. Incubation de projets, financement et mentorat.", motsCles: "diaspora, coopération, incubation, mentorat, Europe", status: "VALIDATED", newsletter: true },

    // ── ORGANISMES (3) ──
    { entreprise: "SACEM — Répartition Afrique", categorie: "organismes", directeur: "Jean-Noël Tronc", ville: "Neuilly-sur-Seine", codePostal: "92200", pays: "France", mobile: "+33 1 47 15 47 15", email: "afrique@sacem.fr", siteWeb: "https://sacem.fr", description: "Service dédié aux auteurs, compositeurs et éditeurs de musique africaine. Gestion des droits d'auteur, répartition et protection des œuvres.", motsCles: "SACEM, droits d'auteur, musique, répartition", status: "VALIDATED", newsletter: false },
    { entreprise: "Institut Français — Afrique", categorie: "organismes", directeur: "Eva Nguyen Binh", ville: "Paris", codePostal: "75007", pays: "France", mobile: "+33 1 53 69 83 00", email: "afrique@institutfrancais.com", siteWeb: "https://institutfrancais.com", description: "Programmes de soutien à la création artistique africaine. Résidences, tournées, coproductions et fonds d'aide à la diffusion.", motsCles: "Institut français, création, résidence, soutien, diffusion", status: "VALIDATED", newsletter: true },
    { entreprise: "Organisation Internationale de la Francophonie", categorie: "organismes", directeur: "Louise Mushikiwabo", ville: "Paris", codePostal: "75007", pays: "France", mobile: "+33 1 44 37 33 00", email: "oif@francophonie.org", siteWeb: "https://francophonie.org", description: "Organisation internationale promouvant la langue française et la diversité culturelle. Programmes culturels et éducatifs pour les pays africains francophones.", motsCles: "francophonie, culture, éducation, coopération", status: "VALIDATED", newsletter: false },

    // ── AMBASSADES (3) ──
    { entreprise: "Ambassade du Sénégal en France", categorie: "ambassades", directeur: "El Hadji Ibou Boye", adresse: "14 avenue Robert Schuman", ville: "Paris", codePostal: "75007", pays: "France", mobile: "+33 1 47 05 39 71", email: "contact@ambassenegal.fr", siteWeb: "https://ambassenegal.fr", description: "Représentation diplomatique du Sénégal en France. Services consulaires, visas, état civil et accompagnement de la communauté sénégalaise.", motsCles: "ambassade, Sénégal, consulat, visa, diplomatique", status: "VALIDATED", newsletter: false },
    { entreprise: "Ambassade de Côte d'Ivoire en France", categorie: "ambassades", directeur: "Maurice Bandaman", adresse: "102 avenue Raymond Poincaré", ville: "Paris", codePostal: "75116", pays: "France", mobile: "+33 1 53 64 62 62", email: "info@ambaci.fr", siteWeb: "https://ambaci.fr", description: "Ambassade de la République de Côte d'Ivoire. Services consulaires, visas, passeports et soutien aux ressortissants ivoiriens en France.", motsCles: "ambassade, Côte d'Ivoire, consulat, visa", status: "VALIDATED", newsletter: false },
    { entreprise: "Consulat du Mali à Paris", categorie: "ambassades", directeur: "Toumani Djimé Diallo", adresse: "53 rue Hoche", ville: "Paris", codePostal: "75008", pays: "France", mobile: "+33 1 45 48 58 43", email: "consulat@mali-france.org", description: "Consulat général du Mali à Paris. Délivrance de documents officiels, état civil, accompagnement administratif des Maliens de France.", motsCles: "consulat, Mali, documents, état civil, Paris", status: "VALIDATED", newsletter: false },

    // ── ASSOCIATIONS (3) ──
    { entreprise: "Conseil Représentatif des Associations Noires", categorie: "associations", directeur: "Ghyslain Vedeux", ville: "Paris", pays: "France", mobile: "+33 6 55 66 77 88", email: "contact@lecran.org", siteWeb: "https://lecran.org", facebook: "LECRAN", description: "Fédération d'associations luttant contre les discriminations et promouvant l'égalité. Actions juridiques, plaidoyer et événements culturels.", motsCles: "association, anti-discrimination, égalité, droits", status: "VALIDATED", newsletter: true },
    { entreprise: "Association des Femmes Africaines de Paris", categorie: "associations", directeur: "Mariama Bâ", ville: "Paris", codePostal: "75020", pays: "France", mobile: "+33 7 22 33 44 55", email: "contact@afap-paris.org", description: "Association d'entraide et d'accompagnement des femmes africaines. Cours de français, aide juridique, insertion professionnelle et ateliers culturels.", motsCles: "femmes, entraide, insertion, français, accompagnement", status: "VALIDATED", newsletter: true },
    { entreprise: "Solidarité Afrique Lyon", categorie: "associations", directeur: "Abdoulaye Diarra", ville: "Lyon", codePostal: "69007", pays: "France", mobile: "+33 6 11 22 33 44", email: "info@solidariteafriquelyon.org", description: "Association de solidarité internationale. Projets de développement en Afrique, collectes et parrainage scolaire. Active depuis 2005.", motsCles: "solidarité, développement, parrainage, Lyon", status: "VALIDATED", newsletter: true },

    // ── AEROPORTS (2) ──
    { entreprise: "Paris-Charles de Gaulle — Hub Afrique", categorie: "aeroports", directeur: "Augustin de Romanet", ville: "Roissy-en-France", codePostal: "95700", pays: "France", mobile: "+33 1 48 62 22 80", email: "info@parisaeroport.fr", siteWeb: "https://parisaeroport.fr", description: "Principal hub européen pour les vols vers l'Afrique. Liaisons directes avec 45 villes africaines. Terminaux 2E et 2F dédiés aux compagnies africaines.", motsCles: "aéroport, CDG, vols Afrique, hub, Paris", status: "VALIDATED", newsletter: false },
    { entreprise: "Aéroport Blaise Diagne (DSS)", categorie: "aeroports", directeur: "Doudou Ka", ville: "Diass", pays: "Sénégal", mobile: "+221 33 869 70 00", email: "info@aeroport-blaisediagne.com", siteWeb: "https://aeroport-blaisediagne.com", description: "Aéroport international du Sénégal. Hub régional ouest-africain. Liaisons avec Paris, Bruxelles, Lyon, Marseille et l'ensemble du continent.", motsCles: "aéroport, Sénégal, Dakar, vols, hub régional", status: "VALIDATED", newsletter: false },

    // ── INTERNATIONAL (3) ──
    { entreprise: "African Diaspora Network USA", categorie: "international", directeur: "Almaz Negash", ville: "San Francisco", pays: "États-Unis", mobile: "+1 415 555 01 23", email: "info@africandiasporanetwork.org", siteWeb: "https://africandiasporanetwork.org", linkedin: "african-diaspora-network", description: "Réseau de la diaspora africaine aux États-Unis. Connexion d'entrepreneurs, investisseurs et leaders communautaires. Conférence annuelle à Silicon Valley.", motsCles: "diaspora, USA, entrepreneurs, Silicon Valley, réseau", status: "VALIDATED", newsletter: true },
    { entreprise: "Africa Center Tokyo", categorie: "international", directeur: "Kenji Yamamoto", ville: "Tokyo", pays: "Japon", mobile: "+81 3 6809 1234", email: "info@africacentertokyo.jp", siteWeb: "https://africacentertokyo.jp", description: "Centre culturel et commercial dédié à l'Afrique au Japon. Expositions, gastronomie, événements business et échanges culturels Afrique-Japon.", motsCles: "Japon, culture, business, échanges, Tokyo", status: "VALIDATED", newsletter: true },
    { entreprise: "Afrique-Canada Chamber of Commerce", categorie: "international", directeur: "Mama Dembele", ville: "Montréal", pays: "Canada", mobile: "+1 514 555 98 76", email: "info@acccc.ca", siteWeb: "https://acccc.ca", description: "Chambre de commerce Afrique-Canada. Facilitation des échanges commerciaux, missions économiques et accompagnement des entreprises africaines au Canada.", motsCles: "commerce, Canada, Montréal, échanges, entreprises", status: "VALIDATED", newsletter: true },

    // ── QUELQUES PENDING & REJECTED pour le réalisme ──
    { entreprise: "Dakar Digital Agency", categorie: "services", directeur: "Ibrahima Sow", ville: "Dakar", pays: "Sénégal", mobile: "+221 77 123 45 67", email: "contact@dakardigital.sn", siteWeb: "https://dakardigital.sn", linkedin: "dakar-digital-agency", description: "Agence digitale spécialisée en développement web, mobile et marketing digital pour les entreprises africaines et de la diaspora.", motsCles: "digital, web, Dakar, marketing", status: "PENDING", newsletter: false },
    { entreprise: "Mami Wata Cosmetics", categorie: "magasins", directeur: "Grace Okonkwo", adresse: "78 boulevard Voltaire", ville: "Paris", codePostal: "75011", pays: "France", mobile: "+33 6 77 88 99 00", email: "info@mamiwatacosmetics.com", siteWeb: "https://mamiwatacosmetics.com", instagram: "@mamiwatacosmetics", youtube: "MamiWataBeauty", description: "Cosmétiques naturels inspirés des traditions africaines. Soins pour la peau et les cheveux, 100% naturels et fabriqués en France.", motsCles: "cosmétiques, naturel, beauté, soins", status: "PENDING", newsletter: true },
    { entreprise: "Trans-Africa Express", categorie: "cooperations", directeur: "Ousmane Bah", ville: "Paris", codePostal: "75018", pays: "France", mobile: "+33 6 99 88 77 66", email: "contact@transafricaexpress.fr", description: "Service de transport et livraison de colis vers l'Afrique de l'Ouest. Envoi de fret maritime et aérien. Devis gratuit.", motsCles: "transport, colis, Afrique, fret, livraison", status: "PENDING", newsletter: false },
    { entreprise: "Fake Business SARL", categorie: "artistes", directeur: "Spam Bot", ville: "Lagos", pays: "Nigeria", mobile: "+234 800 000 0000", email: "spam@example.com", description: "Lorem ipsum dolor sit amet. Inscription non conforme aux critères de l'annuaire.", motsCles: "spam", status: "REJECTED", newsletter: false },
  ];

  const inscriptions = await Promise.all(
    inscriptionData.map((d) => prisma.inscription.create({ data: { ...d, status: d.status as "VALIDATED" | "PENDING" | "REJECTED" } }))
  );

  console.log(`Created ${inscriptions.length} inscriptions (${inscriptionData.filter(d => d.status === "VALIDATED").length} validated, ${inscriptionData.filter(d => d.status === "PENDING").length} pending, ${inscriptionData.filter(d => d.status === "REJECTED").length} rejected)`);

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
