import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Domain → path redirections.
 * Each external domain redirects to the corresponding page on dreamteamafrica.com.
 */
const DOMAIN_REDIRECTS: Record<string, string> = {
  "lafropeen.com": "/lafropeen",
  "www.lafropeen.com": "/lafropeen",
  "saisonculturelleafricaine.fr": "/saison-culturelle-africaine",
  "www.saisonculturelleafricaine.fr": "/saison-culturelle-africaine",
  "foiredafrique.fr": "/saison-culturelle-africaine/foire-dafrique-paris-2026",
  "www.foiredafrique.fr": "/saison-culturelle-africaine/foire-dafrique-paris-2026",
  "evasionaparis.fr": "/saison-culturelle-africaine/evasion-paris-2026",
  "www.evasionaparis.fr": "/saison-culturelle-africaine/evasion-paris-2026",
  "fashionweekafrica.fr": "/saison-culturelle-africaine/festival-autre-culture-2026",
  "www.fashionweekafrica.fr": "/saison-culturelle-africaine/festival-autre-culture-2026",
  "salonmadeinafrica.fr": "/saison-culturelle-africaine/salon-made-in-africa-2026",
  "www.salonmadeinafrica.fr": "/saison-culturelle-africaine/salon-made-in-africa-2026",
  "justeunedanse.fr": "/saison-culturelle-africaine/juste-une-danse-2026",
  "www.justeunedanse.fr": "/saison-culturelle-africaine/juste-une-danse-2026",
};

const PRIMARY_DOMAIN = "dreamteamafrica.com";

/**
 * Path → path redirections (old URLs → new URLs).
 * Keeps Facebook Pixel retargeting & ad links working.
 */
const PATH_REDIRECTS: Record<string, string> = {
  "/foire-dafrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris-2026",
  "/foire-afrique-paris": "/saison-culturelle-africaine/foire-dafrique-paris-2026",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") ?? "";

  // Domain-level redirects
  const domainRedirect = DOMAIN_REDIRECTS[host];
  if (domainRedirect) {
    const url = new URL(domainRedirect, `https://${PRIMARY_DOMAIN}`);
    return NextResponse.redirect(url, 301);
  }

  // Path-level redirects (old campaign URLs)
  const pathname = request.nextUrl.pathname;
  const pathRedirect = PATH_REDIRECTS[pathname];
  if (pathRedirect) {
    const url = new URL(pathRedirect, request.url);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
