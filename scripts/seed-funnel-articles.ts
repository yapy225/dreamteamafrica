/**
 * Articles SEO funnel — shopping produits africains Paris
 *
 * Ces articles ciblent des requêtes informationnelles ("comment utiliser",
 * "bienfaits", "guide") et linkent vers les landings /beurre-de-karite-paris,
 * /huile-de-chebe-paris, /tissu-wax-paris, /cosmetique-africaine-paris.
 *
 * Usage: bun scripts/seed-funnel-articles.ts
 */
import { PrismaClient, type ArticleCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface FunnelArticle {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: ArticleCategory;
  seoKeywords: string[];
  tags: string[];
  altText: string;
  readingTimeMin: number;
  content: string;
}

const articles: FunnelArticle[] = [
  // ─── 1. Huile de chebé ────────────────────────────────────────
  {
    slug: "comment-utiliser-huile-de-chebe-cheveux-afro",
    title: "Comment utiliser l'huile de chebé sur les cheveux afro : guide complet",
    excerpt:
      "Rituel ancestral des femmes Basara du Tchad, l'huile de chebé favorise la pousse et limite la casse des cheveux afro. Mode d'emploi étape par étape, fréquence et erreurs à éviter.",
    metaTitle: "Comment utiliser l'huile de chebé sur les cheveux : guide 2026",
    metaDescription:
      "Guide complet pour utiliser l'huile de chebé sur cheveux afro et crépus : application, fréquence, associations, erreurs à éviter. Rétention de longueur maximale.",
    category: "LIFESTYLE",
    seoKeywords: [
      "comment utiliser l'huile de chebe sur les cheveux",
      "huile de chebé application",
      "huile de chebé cheveux afro",
      "huile de chebe bienfaits",
      "pousse cheveux crépus",
      "rétention de longueur",
      "chebé tchad",
    ],
    tags: ["huile de chebé", "cheveux afro", "afro-beauty", "soin capillaire", "Tchad"],
    altText: "Huile de chebé appliquée sur cheveux afro tressés",
    readingTimeMin: 6,
    content: `
<p>L'<strong>huile de chebé</strong> est devenue en quelques années l'un des soins capillaires les plus recherchés par la communauté afro-beauty. Venue du Tchad, où les femmes du peuple Basara en font l'un de leurs secrets de longueur depuis des générations, elle séduit aujourd'hui les cheveux afro, crépus et bouclés du monde entier. Mais <strong>comment utiliser l'huile de chebé sur les cheveux</strong> pour en tirer le maximum de bénéfices ? Voici le guide complet 2026.</p>

<h2>Qu'est-ce que l'huile de chebé ?</h2>

<p>Le chebé (ou chébé) est une poudre traditionnelle composée de graines de <em>Croton Gratissimus</em>, de clou de girofle concassé et de parfum Mahaleb. Mélangée à une huile végétale (ricin, karité fondu, coco), elle forme l'<strong>huile de chebé</strong>. Les femmes Basara du Tchad l'utilisent depuis des siècles pour obtenir des cheveux exceptionnellement longs, protégés contre la casse et le climat sahélien extrême.</p>

<p>À ne pas confondre avec une huile qui fait pousser les cheveux plus vite : l'huile de chebé <strong>ne stimule pas la racine</strong>. Son action est différente et redoutablement efficace : elle <strong>limite la casse sur les longueurs</strong>, ce qui permet à la fibre de grandir sans se briser. C'est le principe de la <em>rétention de longueur</em>.</p>

<h2>Comment utiliser l'huile de chebé sur les cheveux : la méthode tchadienne</h2>

<p>La méthode traditionnelle en 4 étapes reste la plus efficace. Elle demande de la régularité mais pas de technique complexe.</p>

<h3>1. Hydratez d'abord</h3>

<p>Lavez vos cheveux avec un shampoing doux (sans sulfate), puis vaporisez un mélange <strong>eau + aloé véra</strong> sur l'ensemble de la chevelure. L'hydratation à base d'eau est indispensable : l'huile de chebé seule <em>ne nourrit pas</em>, elle <em>scelle</em> l'hydratation. Appliquée sur cheveux secs, elle aggraverait la sécheresse.</p>

<h3>2. Appliquez l'huile de chebé mèche par mèche</h3>

<p>Sur cheveux humides et démêlés, prélevez une petite quantité d'huile de chebé dans vos paumes. Appliquez <strong>des pointes vers les racines</strong>, mèche par mèche, en insistant sur les longueurs. Massez légèrement le cuir chevelu. Évitez le sur-dosage : une noix suffit pour la plupart des chevelures.</p>

<h3>3. Protégez en coiffure basse</h3>

<p>Tressez, vanillez ou chignonnez vos cheveux pour les protéger pendant le temps de pose. Le soir, couvrez-les d'un <strong>foulard en satin ou en soie</strong> pour éviter l'absorption du produit par le coton de la taie d'oreiller. La coiffure protectrice est le cœur de la méthode Basara.</p>

<h3>4. Laissez poser 24 à 72 heures</h3>

<p>L'huile de chebé travaille dans le temps. Laissez-la agir <strong>24 à 72 heures</strong> avant le prochain lavage. Renouvelez l'application <strong>1 à 2 fois par semaine</strong>. Les premiers résultats (fibres plus résistantes, pointes moins friables) apparaissent dès 4 semaines. La rétention de longueur se mesure sur 3 à 6 mois.</p>

<h2>Les 3 erreurs à ne jamais commettre</h2>

<ul>
  <li><strong>Appliquer sur cheveux secs</strong> : l'huile de chebé scelle ; elle ne réhydrate pas. Sans eau préalable, vos cheveux s'assècheront davantage.</li>
  <li><strong>Sauter les coiffures protectrices</strong> : frottements sur l'oreiller, brosses, mains dans les cheveux = la casse gagne toujours. La coiffure tressée est indispensable.</li>
  <li><strong>Oublier la constance</strong> : la méthode tchadienne ne donne aucun résultat visible en 1 semaine. Engagez-vous sur 3 mois minimum.</li>
</ul>

<h2>Poudre ou huile de chebé : que choisir ?</h2>

<p>La <strong>poudre de chebé</strong> est la forme traditionnelle, à mélanger soi-même avec une huile végétale de son choix. Elle permet de contrôler chaque ingrédient, notamment pour les cuirs chevelus sensibles. L'<strong>huile de chebé</strong> prête à l'emploi est plus pratique mais peut contenir des huiles moins nobles. Lisez toujours l'étiquette : privilégiez les formules à base de ricin, karité ou coco vierge, avec poudre de chebé du Tchad.</p>

<h2>Où acheter de l'huile de chebé authentique à Paris ?</h2>

<p>Les <strong>boutiques spécialisées de Château-Rouge</strong> (Goutte d'Or, 18e) importent de l'huile et de la poudre de chebé directement du Tchad. L'axe Strasbourg-Saint-Denis / Château d'Eau propose aussi des marques afro-beauty sérieuses. Pour un achat en confiance, la <a href="/saison-culturelle-africaine/foire-dafrique-paris">Foire d'Afrique Paris 2026</a> (1-2 mai, Espace MAS) rassemble chaque année des marques afro-beauty traçables.</p>

<p>Retrouvez le guide complet sur <a href="/huile-de-chebe-paris">Huile de chebé à Paris</a> avec les adresses détaillées, ou découvrez tout l'univers de la <a href="/cosmetique-africaine-paris">cosmétique africaine à Paris</a>.</p>

<h2>En conclusion</h2>

<p>Utiliser l'huile de chebé sur les cheveux afro n'a rien de compliqué : de l'eau d'abord, de l'huile ensuite, des tresses toujours, et de la régularité. En 3 mois, la différence est spectaculaire sur la rétention de longueur. C'est la force d'un geste ancestral qui traverse les générations.</p>
`.trim(),
  },

  // ─── 2. Beurre de karité ──────────────────────────────────────
  {
    slug: "beurre-de-karite-bienfaits-7-usages",
    title: "Bienfaits du beurre de karité : 7 usages quotidiens pour le visage, le corps et les cheveux",
    excerpt:
      "Hydratant, cicatrisant, anti-âge : le beurre de karité pur est le soin multi-usage par excellence. 7 façons concrètes de l'intégrer à votre routine quotidienne, sur peaux sèches, cheveux crépus, gerçures et vergetures.",
    metaTitle: "Bienfaits du beurre de karité : 7 usages visage, corps, cheveux",
    metaDescription:
      "Le beurre de karité pur et non raffiné est un soin naturel multi-usage. Découvrez 7 façons de l'utiliser au quotidien : visage, corps, cheveux, gerçures, bébé, maquillage.",
    category: "LIFESTYLE",
    seoKeywords: [
      "beurre de karité bienfaits",
      "bienfaits beurre de karité",
      "utiliser beurre de karité",
      "beurre de karité visage",
      "beurre de karité cheveux",
      "beurre de karité vergetures",
      "beurre de karité pur",
    ],
    tags: ["beurre de karité", "cosmétique naturelle", "afro-beauty", "soin peau", "cheveux"],
    altText: "Pot de beurre de karité brut africain sur fond beige",
    readingTimeMin: 5,
    content: `
<p>Utilisé depuis plus de 2 000 ans en Afrique de l'Ouest, le <strong>beurre de karité</strong> est l'un des soins naturels les plus complets qui existent. Riche en vitamines A, E et F, en acides gras insaturés et en insaponifiables rares, il s'utilise sur le visage, le corps, les cheveux et même pour soigner les bobos du quotidien. Voici les <strong>7 bienfaits du beurre de karité</strong> que vous pouvez intégrer dès aujourd'hui à votre routine, à condition de choisir un karité <strong>pur et non raffiné</strong>.</p>

<h2>1. Hydrater intensément les peaux sèches</h2>

<p>C'est l'usage roi. Le beurre de karité fond au contact de la peau (35 °C) et libère ses acides gras qui restaurent la barrière cutanée. Particulièrement efficace sur les coudes, genoux, talons et mains, il soulage aussi les zones irritées par l'eczéma léger ou le psoriasis. Appliquez une noisette le soir, sur peau propre, en massant jusqu'à absorption.</p>

<h2>2. Nourrir les cheveux afro, crépus ou abîmés</h2>

<p>Pour les cheveux crépus et bouclés, le karité est un allié incontournable. Il scelle l'hydratation, réduit la casse, apaise le cuir chevelu irrité. Utilisez-le en <strong>méthode LOC</strong> (Liquide – Oil – Cream) après un spray hydratant, ou en bain d'huile sur cheveux secs 1 h avant le shampoing. Combiné à de l'<a href="/huile-de-chebe-paris">huile de chebé</a>, il démultiplie la rétention de longueur.</p>

<h2>3. Prévenir et atténuer les vergetures</h2>

<p>Grossesse, prise ou perte de poids rapide : les vergetures apparaissent quand la peau est distendue brutalement. Le beurre de karité, grâce à sa richesse en vitamine A et en acides gras, entretient l'élasticité cutanée et limite leur apparition. Massez matin et soir ventre, cuisses, seins et hanches dès le 3e mois de grossesse.</p>

<h2>4. Cicatriser gerçures et petites blessures</h2>

<p>Lèvres gercées l'hiver, petits bobos, cicatrices récentes : le karité accélère la cicatrisation et apaise la douleur. Appliquez directement sur la zone, en couche épaisse, plusieurs fois par jour. Il peut aussi remplacer le baume à lèvres industriel (à glisser dans un petit pot de voyage).</p>

<h2>5. Démaquiller en douceur</h2>

<p>Les peaux sensibles qui tolèrent mal les démaquillants classiques peuvent opter pour le karité. Faites fondre une noisette entre vos mains, massez sur le visage sec (même maquillé), puis retirez avec un linge humide chaud. Il nettoie, nourrit et apaise en une seule étape.</p>

<h2>6. Soigner bébé</h2>

<p>Le beurre de karité <strong>100 % pur, non raffiné et sans parfum</strong> convient dès les premiers mois. Il apaise les fesses irritées, les croûtes de lait, la peau sèche des tout-petits. Toujours tester une petite zone d'abord. Évidemment, bannissez tout karité parfumé ou additionné d'huiles essentielles pour les moins de 3 ans.</p>

<h2>7. Protéger du froid et du soleil</h2>

<p>Le karité contient des cinnamates, composés qui offrent un faible indice de protection solaire naturel (environ SPF 6). Insuffisant pour remplacer une crème solaire, il reste utile pour protéger la peau du vent, du sel et du froid lors d'activités outdoor. À appliquer en fine couche sur le visage avant une sortie hiver.</p>

<h2>Comment reconnaître un beurre de karité pur ?</h2>

<p>Tous les karité vendus en grande distribution ne se valent pas. Le <strong>karité raffiné</strong> (blanc, inodore, lisse) a perdu jusqu'à 75 % de ses vitamines. Pour bénéficier de ces 7 bienfaits, il faut du <strong>karité pur et non raffiné</strong>, reconnaissable à sa couleur ivoire à jaune pâle, son odeur légèrement fumée et sa texture granuleuse. Privilégiez une origine affichée : Burkina Faso, Mali, Ghana, Côte d'Ivoire, idéalement issue d'une coopérative féminine.</p>

<p>Retrouvez le guide d'achat complet sur <a href="/beurre-de-karite-paris">Beurre de karité à Paris</a> avec les meilleures adresses 18e, 10e et 13e. Pour acheter directement auprès des coopératives africaines, rendez-vous à la <a href="/saison-culturelle-africaine/foire-dafrique-paris">Foire d'Afrique Paris 2026</a> les 1 et 2 mai (Espace MAS, Paris 13e).</p>

<h2>Un soin ancestral, une routine moderne</h2>

<p>Le beurre de karité n'a pas besoin d'être compliqué. Un pot, une noisette, trois minutes : c'est le geste de beauté minimaliste par excellence, celui qui a traversé les générations en Afrique de l'Ouest sans jamais être détrôné. À intégrer dès maintenant dans votre routine.</p>
`.trim(),
  },

  // ─── 3. Tissus africains ──────────────────────────────────────
  {
    slug: "wax-bogolan-bazin-guide-tissus-africains-paris",
    title: "Wax, bogolan, bazin : le guide des tissus africains à Paris",
    excerpt:
      "Comment différencier wax, bogolan, bazin et kente ? Origines, usages, prix au mètre et adresses parisiennes : le panorama complet des textiles africains vendus à Château-Rouge et Saint-Denis.",
    metaTitle: "Tissus africains : wax, bogolan, bazin, kente — guide 2026",
    metaDescription:
      "Guide complet des tissus africains vendus à Paris : wax, bogolan, bazin, kente. Origines, différences, prix au mètre, adresses Château-Rouge, Marché Saint-Pierre.",
    category: "LIFESTYLE",
    seoKeywords: [
      "tissus africains",
      "wax bogolan bazin",
      "différence wax bogolan",
      "tissu africain paris",
      "bogolan mali",
      "bazin riche",
      "kente ghana",
    ],
    tags: ["wax", "bogolan", "bazin", "kente", "mode africaine", "tissu", "Paris"],
    altText: "Sélection de tissus africains wax, bogolan et bazin",
    readingTimeMin: 6,
    content: `
<p>Derrière l'étiquette générique de « tissu africain » se cache une famille textile d'une richesse extraordinaire. <strong>Wax, bogolan, bazin, kente</strong> : chaque tissu raconte une histoire, une région, un savoir-faire. À Paris, ces quatre textiles se croisent dans les boutiques de Château-Rouge, du Marché Saint-Pierre et de Château d'Eau. Voici le guide complet pour les différencier, les acheter et les coudre en 2026.</p>

<h2>Le wax : emblème de la mode africaine contemporaine</h2>

<p>Contrairement à l'idée reçue, le <strong>wax</strong> n'est pas originaire d'Afrique mais d'Indonésie (technique du batik). C'est au XIXe siècle que les Néerlandais ont industrialisé l'impression à la cire puis l'ont exportée en Afrique de l'Ouest, où il est devenu un symbole culturel incontournable. Aujourd'hui, les grandes marques (Vlisco aux Pays-Bas, Uniwax en Côte d'Ivoire, GTP et ABC au Ghana) impriment chaque année de nouveaux motifs.</p>

<p>Le wax se reconnaît à son <strong>impression identique recto/verso</strong>, à ses couleurs saturées et à sa tenue rigide caractéristique due à la cire. Comptez <strong>15 à 30 €/m</strong> pour un wax africain authentique, <strong>35 à 80 €/m</strong> pour du Vlisco premium. Le pagne traditionnel se vend en 6 yards (environ 5,5 m). Toutes les adresses parisiennes sont détaillées sur notre guide <a href="/tissu-wax-paris">Tissu wax à Paris</a>.</p>

<h2>Le bogolan : le tissu de boue malien</h2>

<p>Le <strong>bogolan</strong> (littéralement « issu de la boue » en bambara) est un textile ancestral du Mali. Fabriqué à partir de coton tissé à la main, il est teint à l'aide de boues fermentées et de décoctions végétales. Les motifs géométriques beige/noir/terracotta sont peints au pinceau selon des symboles chargés de sens — bénédictions, récits, identités claniques.</p>

<p>Utilisé traditionnellement pour les tenues rituelles des chasseurs Bambara, le bogolan a conquis la mode contemporaine depuis les années 1990. À Paris, on le trouve dans les boutiques spécialisées du 18e et dans les showrooms de créateurs africains. Son prix reflète le travail artisanal : <strong>30 à 80 €/m</strong> pour un bogolan authentique tissé main.</p>

<h2>Le bazin : l'élégance raffinée d'Afrique de l'Ouest</h2>

<p>Le <strong>bazin riche</strong> est un coton damassé, chic et structuré, porté pour les cérémonies, mariages et grandes occasions au Sénégal, au Mali, en Guinée et dans toute l'Afrique de l'Ouest. Importé historiquement d'Allemagne (maisons Getzner, Hartmann), il est ensuite teint et amidonné à la main dans les teintureries africaines, notamment à Bamako et Dakar.</p>

<p>Sa particularité ? Un toucher rigide caractéristique, un lustre quasi métallique et des couleurs profondes (indigo, vin, or). Un ensemble bazin femme peut coûter plusieurs centaines d'euros une fois confectionné. À Paris, les adresses de référence sont Château-Rouge et les ateliers de tailleurs sénégalais du 18e.</p>

<h2>Le kente : l'héritage royal Ashanti</h2>

<p>Le <strong>kente</strong> est un tissu tissé à la main en fines bandes assemblées, originaire du peuple Ashanti (Ghana) et des Ewe (Togo). Chaque motif géométrique porte un nom et un sens précis. Historiquement réservé à la royauté et aux grandes occasions, il symbolise aujourd'hui la fierté panafricaine et se retrouve sur les étoles de remises de diplômes des universités afro-américaines.</p>

<p>Le kente authentique est <strong>rare et cher</strong> (50 à 200 €/m). Les imitations imprimées existent aussi, à des prix plus accessibles. À Paris, on le trouve principalement dans les boutiques ghanéennes et lors des salons comme la <a href="/saison-culturelle-africaine/fashion-week-africa">Fashion Week Africa Paris 2026</a>.</p>

<h2>Comment choisir le bon tissu pour votre projet ?</h2>

<ul>
  <li><strong>Pour une robe d'été colorée</strong> : wax (3 à 5 mètres selon la coupe).</li>
  <li><strong>Pour une veste élégante et texturée</strong> : bogolan (2 à 3 mètres).</li>
  <li><strong>Pour un ensemble de cérémonie</strong> : bazin riche (6 yards).</li>
  <li><strong>Pour un accessoire symbolique (étole, ceinture)</strong> : kente (0,5 à 1 mètre).</li>
</ul>

<h2>Où acheter ces tissus à Paris ?</h2>

<p>Le <strong>quartier Château-Rouge</strong> (Goutte d'Or, 18e) reste la référence historique pour le wax et le bazin à prix accessible. Le <strong>Marché Saint-Pierre</strong> (Montmartre) offre un rayon wax étendu pour les projets couture DIY. Pour du <strong>bogolan et du kente authentiques</strong>, privilégiez les salons spécialisés comme la <a href="/saison-culturelle-africaine/foire-dafrique-paris">Foire d'Afrique Paris</a> (1-2 mai 2026) qui rassemble des artisans textiles directement venus d'Afrique de l'Ouest.</p>

<p>Pour aller plus loin, découvrez notre <a href="/boutique-africaine-paris">guide des boutiques africaines à Paris</a> et notre panorama du <a href="/marche-africain-paris">marché africain à Paris</a>.</p>

<h2>Un vêtement, une histoire</h2>

<p>Qu'il s'agisse d'un pagne wax coloré, d'une veste bogolan ou d'un boubou bazin, porter un tissu africain, c'est porter une histoire. Celle des artisans qui tissent, teignent et peignent à la main depuis des générations. À Paris, ces textiles sont plus vivants que jamais — à condition de savoir où les chercher.</p>
`.trim(),
  },
];

async function main() {
  console.log("🔍 Recherche d'un auteur ADMIN...");
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true, name: true },
  });
  if (!admin) {
    console.error("❌ Aucun utilisateur ADMIN trouvé. Créez-en un avant de lancer ce script.");
    process.exit(1);
  }
  console.log(`✅ Auteur : ${admin.name} (${admin.id})\n`);

  for (const article of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
    if (existing) {
      await prisma.article.update({
        where: { slug: article.slug },
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          category: article.category,
          seoKeywords: article.seoKeywords,
          tags: article.tags,
          altText: article.altText,
          readingTimeMin: article.readingTimeMin,
          status: "PUBLISHED",
          source: "seo-funnel",
          authorType: "humain",
        },
      });
      console.log(`🔁 Article mis à jour : "${article.title}"`);
    } else {
      await prisma.article.create({
        data: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          category: article.category,
          seoKeywords: article.seoKeywords,
          tags: article.tags,
          altText: article.altText,
          readingTimeMin: article.readingTimeMin,
          status: "PUBLISHED",
          authorId: admin.id,
          source: "seo-funnel",
          authorType: "humain",
        },
      });
      console.log(`✅ Article créé : "${article.title}"`);
    }
  }

  console.log(`\n🎉 ${articles.length} articles funnel prêts.`);
  console.log(`📍 URLs : https://dreamteamafrica.com/lafropeen/<slug>`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
