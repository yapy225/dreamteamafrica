import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Domain → path redirections.
 */
const DOMAIN_REDIRECTS: Record<string, string> = {
  "lafropeen.com": "/lafropeen",
  "www.lafropeen.com": "/lafropeen",
  "saisonculturelleafricaine.fr": "/saison-culturelle-africaine",
  "www.saisonculturelleafricaine.fr": "/saison-culturelle-africaine",
  "foiredafrique.fr": "/saison-culturelle-africaine/foire-dafrique-paris",
  "www.foiredafrique.fr": "/saison-culturelle-africaine/foire-dafrique-paris",
  "evasionaparis.fr": "/saison-culturelle-africaine/evasion-paris",
  "www.evasionaparis.fr": "/saison-culturelle-africaine/evasion-paris",
  "fashionweekafrica.fr": "/saison-culturelle-africaine/festival-de-lautre-culture",
  "www.fashionweekafrica.fr": "/saison-culturelle-africaine/festival-de-lautre-culture",
  "salonmadeinafrica.fr": "/saison-culturelle-africaine/salon-made-in-africa",
  "www.salonmadeinafrica.fr": "/saison-culturelle-africaine/salon-made-in-africa",
  "justeunedanse.fr": "/saison-culturelle-africaine/juste-une-danse",
  "www.justeunedanse.fr": "/saison-culturelle-africaine/juste-une-danse",
  "lofficieldafrique.fr": "/lofficiel-dafrique",
  "www.lofficieldafrique.fr": "/lofficiel-dafrique",
};

const PRIMARY_DOMAIN = "dreamteamafrica.com";

/**
 * Path → path exact redirections (old WordPress URLs → new Next.js URLs).
 * Captures ~8000+ clicks/month from old indexed pages.
 */
const PATH_REDIRECTS: Record<string, string> = {
  // ── Foire d'Afrique (2834 clicks) ──
  "/foire-dafrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/foire-afrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/saison-culturelle-africaine/foire-afrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris",

  // ── Fashion Week Africa (994 clicks) → Festival de l'Autre Culture ──
  "/fashion-week-africa-paris": "/saison-culturelle-africaine/fashion-week-africa",
  "/fashion-week-africa-paris/": "/saison-culturelle-africaine/fashion-week-africa",

  // ── Festival du Conte (528+ clicks) ──
  "/festival-du-conte-africain": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/festival-du-conte-africain/": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/festival-du-conte-africain-paris-2025": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/festival-du-conte-africain-paris-2025/": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/festival-du-conte-africain-paris": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/festival-du-conte-africain-paris/": "/saison-culturelle-africaine/festival-du-conte-africain",

  // ── Salon Made in Africa (300 clicks) ──
  "/salon-made-in-africa": "/saison-culturelle-africaine/salon-made-in-africa",
  "/salon-made-in-africa/": "/saison-culturelle-africaine/salon-made-in-africa",
  "/salon-made-in-africa-paris": "/saison-culturelle-africaine/salon-made-in-africa",
  "/salon-made-in-africa-paris/": "/saison-culturelle-africaine/salon-made-in-africa",

  // ── Juste Une Danse ──
  "/juste-une-danse": "/saison-culturelle-africaine/juste-une-danse",
  "/juste-une-danse/": "/saison-culturelle-africaine/juste-une-danse",

  // ── FICA ──
  "/festival-international-du-cin%C3%A9ma-africain": "/saison-culturelle-africaine/festival-international-du-cinema-africain",
  "/festival-international-du-cinema-africain-fontenay-sous-bois-2026": "/saison-culturelle-africaine/festival-international-du-cinema-africain",
  "/festival-international-du-cinema-africain-fontenay-sous-bois-2026/": "/saison-culturelle-africaine/festival-international-du-cinema-africain",

  // ── Old /event/* pages (304+ clicks) ──
  "/event/festival-du-conte-africain": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/event/festival-du-conte-africain/": "/saison-culturelle-africaine/festival-du-conte-africain",
  "/event/fashion-week-africa-paris": "/saison-culturelle-africaine/fashion-week-africa",
  "/event/fashion-week-africa-paris/": "/saison-culturelle-africaine/fashion-week-africa",
  "/event/foire-dafrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/event/foire-dafrique-paris/": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/event/billets-salon-made-in-africa": "/saison-culturelle-africaine/salon-made-in-africa",
  "/event/billets-salon-made-in-africa/": "/saison-culturelle-africaine/salon-made-in-africa",
  "/event/billets-le-grand-defile-zulu": "/saison-culturelle-africaine/fashion-week-africa",
  "/event/billets-le-grand-defile-zulu/": "/saison-culturelle-africaine/fashion-week-africa",
  "/event/salon-made-in-africa-paris-2025": "/saison-culturelle-africaine/salon-made-in-africa",
  "/event/salon-made-in-africa-paris-2025/": "/saison-culturelle-africaine/salon-made-in-africa",
  "/event/marche-de-noel-salon-paris-2025-2%E1%B5%89-edition": "/saison-culturelle-africaine/salon-made-in-africa",
  "/event/marche-de-noel-salon-paris-2025-2%E1%B5%89-edition/": "/saison-culturelle-africaine/salon-made-in-africa",

  // ── Old /page/* (377 clicks) ──
  "/page/saison-culturelle-africaine-paris-2025": "/saison-culturelle-africaine",
  "/page/edito-de-la-presidente": "/",
  "/page/coach-hamond-chic": "/",

  // ── Old /post/* (99+ clicks) ──
  "/post/saison-culturelle-africaine-paris-2025-dream-team-africa": "/saison-culturelle-africaine",
  "/post/activites-pour-les-familles-au-salon-made-in-africa-paris": "/saison-culturelle-africaine",
  "/post/casting-fashion-week-africa-paris": "/saison-culturelle-africaine",

  // ── Old /events/* ──
  "/evenements": "/saison-culturelle-africaine",
  "/evenements/": "/saison-culturelle-africaine",
  "/events": "/saison-culturelle-africaine",
  "/events/": "/saison-culturelle-africaine",
  "/events/categorie/africa": "/saison-culturelle-africaine",
  "/events/categorie/africa/": "/saison-culturelle-africaine",
  "/events/categorie/africa/liste": "/saison-culturelle-africaine",
  "/events/categorie/africa/liste/": "/saison-culturelle-africaine",

  // ── Old /billetterie-en-ligne/* (33+ clicks) ──
  "/billetterie-en-ligne": "/saison-culturelle-africaine",
  "/billetterie-en-ligne/": "/saison-culturelle-africaine",

  // ── Old /sortir-a-paris/* (49+ clicks) ──
  "/sortir-a-paris": "/saison-culturelle-africaine",

  // ── Elections / Awards / Other events ──
  "/election-miss-diaspora-paris": "/saison-culturelle-africaine",
  "/racine-les-awards-de-la-diaspora-africaine": "/saison-culturelle-africaine",
  "/salon-de-la-seduction-africaine": "/saison-culturelle-africaine",
  "/africa-bbq-fontenay-sous-bois-2026": "/saison-culturelle-africaine",
  "/africa-bbq-fontenay-sous-bois-2026/": "/saison-culturelle-africaine",

  // ── Old commerce pages ──
  "/commande-de-stands": "/exposants",
  "/shop": "/made-in-africa",
  "/shop/": "/made-in-africa",
  "/blog": "/lafropeen",
  "/blog/": "/lafropeen",
  "/nos-activites-planifiees": "/saison-culturelle-africaine",
  "/recuperer-mon-billet": "/saison-culturelle-africaine",
  "/tickets-checkout": "/saison-culturelle-africaine",
  "/tickets-checkout/": "/saison-culturelle-africaine",
  "/tickets-order": "/saison-culturelle-africaine",
  "/tickets-order/": "/saison-culturelle-africaine",
  "/merci": "/",
  "/merci/": "/",
  "/login": "/auth/signin",
  "/hello-world": "/",
  "/hello-world/": "/",

  // ── Variantes sans tiret ──
  "/lofficieldafrique": "/lofficiel-dafrique",
  "/lofficieldafrique/": "/lofficiel-dafrique",

  // ── Old legal pages ──
  "/conditions-generales-de-ventes": "/conditions-generales",
  "/conditions-generales-de-ventes/": "/conditions-generales",
  "/conditions-generales-dutilisation": "/conditions-utilisation",
  "/conditions-generales-dutilisation/": "/conditions-utilisation",
  "/politique-dannulation-et-remboursement": "/politique-annulation",
  "/politique-dannulation-et-remboursement/": "/politique-annulation",
  "/contact": "/nous-contacter",
  "/contact/": "/nous-contacter",
  "/contactez-nous": "/nous-contacter",

  // ── Old pack/exposant pages ──
  "/pack-exposants-foire-dafrique-paris": "/exposants",
  "/pack-exposants-foire-dafrique-paris/": "/exposants",
  "/pack-exposant-salon-made-in-africa": "/exposants",
  "/pack-exposant-salon-made-in-africa/": "/exposants",
  "/pack-exposants-fashion-week-africa": "/exposants",
  "/pack-exposants-fashion-week-africa/": "/exposants",
  "/pack-exposant": "/exposants",
  "/pack-exposant/": "/exposants",
  "/exposant": "/exposants",
  "/exposant/": "/exposants",
  "/devenir-exposant": "/exposants",
  "/devenir-exposant/": "/exposants",
  "/inscription-exposant": "/exposants",
  "/inscription-exposant/": "/exposants",

  // ── Old ticketing/pricing pages ──
  "/billets": "/saison-culturelle-africaine",
  "/billets/": "/saison-culturelle-africaine",
  "/billet": "/saison-culturelle-africaine",
  "/billet/": "/saison-culturelle-africaine",
  "/billetterie": "/saison-culturelle-africaine",
  "/billetterie/": "/saison-culturelle-africaine",
  "/tarifs": "/saison-culturelle-africaine",
  "/tarifs/": "/saison-culturelle-africaine",
  "/reservation": "/saison-culturelle-africaine",
  "/reservation/": "/saison-culturelle-africaine",
  "/paiement-carte-fashion-week-africa": "/saison-culturelle-africaine/festival-de-lautre-culture",
  "/paiement-carte-foire-dafrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/programme": "/saison-culturelle-africaine",
  "/programme/": "/saison-culturelle-africaine",

  // ── Old info/about pages ──
  "/a-propos": "/",
  "/a-propos/": "/",
  "/about": "/",
  "/about/": "/",
  "/qui-sommes-nous": "/",
  "/qui-sommes-nous/": "/",
  "/notre-equipe": "/",
  "/notre-equipe/": "/",
  "/infos-pratiques": "/saison-culturelle-africaine",
  "/infos-pratiques/": "/saison-culturelle-africaine",

  // ── Old media/gallery pages ──
  "/galerie": "/",
  "/galerie/": "/",
  "/gallery": "/",
  "/gallery/": "/",
  "/photos": "/",
  "/photos/": "/",
  "/sponsors": "/",
  "/sponsors/": "/",
  "/partenaires": "/",
  "/partenaires/": "/",
  "/presse": "/",
  "/presse/": "/",

  // ── Old participation pages ──
  "/benevoles": "/nous-contacter",
  "/benevoles/": "/nous-contacter",
  "/devenir-benevole": "/nous-contacter",
  "/devenir-benevole/": "/nous-contacter",
  "/artistes": "/nous-contacter",
  "/artistes/": "/nous-contacter",
  "/mannequins": "/nous-contacter",
  "/mannequins/": "/nous-contacter",
  "/casting": "/nous-contacter",
  "/casting/": "/nous-contacter",
  "/casting-mannequin": "/nous-contacter",
  "/casting-mannequin/": "/nous-contacter",

  // ── Old shop/account pages ──
  "/boutique": "/made-in-africa",
  "/boutique/": "/made-in-africa",
  "/marketplace": "/made-in-africa",
  "/marketplace/": "/made-in-africa",
  "/panier": "/made-in-africa",
  "/panier/": "/made-in-africa",
  "/mon-compte": "/auth/signin",
  "/mon-compte/": "/auth/signin",
  "/my-account": "/auth/signin",
  "/my-account/": "/auth/signin",
  "/inscription": "/auth/signup",
  "/inscription/": "/auth/signup",
  "/register": "/auth/signup",
  "/register/": "/auth/signup",
  "/connexion": "/auth/signin",
  "/connexion/": "/auth/signin",

  // ── Old event name variants ──
  "/dream-team-africa": "/",
  "/dream-team-africa/": "/",
  "/saison-culturelle-africaine-paris": "/saison-culturelle-africaine",
  "/saison-culturelle-africaine-paris/": "/saison-culturelle-africaine",
  "/saison-culturelle-africaine-paris-2025": "/saison-culturelle-africaine",
  "/saison-culturelle-africaine-paris-2025/": "/saison-culturelle-africaine",
  "/foire-afrique": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/foire-afrique/": "/saison-culturelle-africaine/foire-dafrique-paris",
  "/africa-bbq": "/saison-culturelle-africaine",
  "/africa-bbq/": "/saison-culturelle-africaine",
  "/evasion-paris": "/saison-culturelle-africaine/evasion-paris",
  "/evasion-paris/": "/saison-culturelle-africaine/evasion-paris",
  "/evasion-paris-luxury": "/saison-culturelle-africaine/evasion-paris",
  "/evasion-paris-luxury/": "/saison-culturelle-africaine/evasion-paris",
  "/evasion-paris-lusury": "/saison-culturelle-africaine/evasion-paris",
  "/evasion-paris-lusury/": "/saison-culturelle-africaine/evasion-paris",
  "/le-grand-defile-zulu": "/saison-culturelle-africaine",
  "/le-grand-defile-zulu/": "/saison-culturelle-africaine",
  "/marche-de-noel": "/saison-culturelle-africaine",
  "/marche-de-noel/": "/saison-culturelle-africaine",
  "/noel-africain": "/saison-culturelle-africaine",
  "/noel-africain/": "/saison-culturelle-africaine",
};

/**
 * Prefix-based redirections for old WordPress sections with subpages.
 * Handles hundreds of old /section/slug URLs.
 */
const PREFIX_REDIRECTS: Array<[string, string]> = [
  // Product/blog pages → marketplace or lafropeen
  ["/beurre-de-vache/", "/lafropeen"],
  ["/beurre-de-cacao/", "/lafropeen"],
  ["/beurre-de-karite/", "/lafropeen"],
  ["/huile-de-coco/", "/lafropeen"],
  ["/huile-de-chebe/", "/lafropeen"],
  ["/cosmetique-afrique/", "/lafropeen"],
  ["/art-africain/", "/lafropeen"],
  ["/balade-sur-la-seine/", "/saison-culturelle-africaine"],
  // Old content sections
  ["/posts/", "/lafropeen"],
  ["/post/", "/lafropeen"],
  ["/sortir-a-paris/", "/saison-culturelle-africaine"],
  ["/dream-team-africa/", "/lafropeen"],
  ["/salon-made-in-africa/", "/saison-culturelle-africaine"],
  ["/foire-dafrique-paris/", "/saison-culturelle-africaine/foire-dafrique-paris"],
  ["/fashion-week-africa-paris/", "/saison-culturelle-africaine/festival-de-lautre-culture"],
  ["/juste-une-danse/", "/saison-culturelle-africaine"],
  ["/evasion-paris-lusury/", "/saison-culturelle-africaine"],
  ["/foire-de-paris/", "/saison-culturelle-africaine"],
  ["/paiement-carte-fashion-week-africa/", "/saison-culturelle-africaine/festival-de-lautre-culture"],
  ["/billetterie-en-ligne/", "/saison-culturelle-africaine"],
  ["/africa-bbq/", "/saison-culturelle-africaine"],
  ["/activite/", "/saison-culturelle-africaine"],
  ["/page/", "/"],
  ["/layouts/", "/"],
  ["/tf_header_footer/", "/"],
  ["/wp-content/", "/"],
  ["/category/", "/lafropeen"],
];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") ?? "";

  // Domain-level redirects
  const domainRedirect = DOMAIN_REDIRECTS[host];
  if (domainRedirect) {
    const url = new URL(domainRedirect, `https://${PRIMARY_DOMAIN}`);
    return NextResponse.redirect(url, 301);
  }

  const pathname = request.nextUrl.pathname;

  // ── CSRF: Origin validation on state-changing API requests ──
  if (pathname.startsWith("/api/") && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      `https://${PRIMARY_DOMAIN}`,
      "https://www.dreamteamafrica.com",
      "http://localhost:3000",
      "http://localhost:4000",
    ];
    // Webhooks from external services don't send Origin — skip for webhook paths
    const isWebhook = pathname.startsWith("/api/webhooks/") || pathname.startsWith("/api/webhook/");
    if (!isWebhook && origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }
  }

  // Exact path redirects
  const pathRedirect = PATH_REDIRECTS[pathname];
  if (pathRedirect) {
    const url = new URL(pathRedirect, request.url);
    return NextResponse.redirect(url, 301);
  }

  // Prefix-based redirects (old WordPress sections)
  for (const [prefix, target] of PREFIX_REDIRECTS) {
    if (pathname.startsWith(prefix)) {
      const url = new URL(target, request.url);
      return NextResponse.redirect(url, 301);
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next|letthemusicplay|favicon.ico|.*\\..*).*)"],
};
