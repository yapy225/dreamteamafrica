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
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
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
        coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
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
        coverImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80",
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
        coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
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
