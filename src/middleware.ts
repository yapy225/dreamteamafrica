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

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") ?? "";
  const redirectPath = DOMAIN_REDIRECTS[host];

  if (redirectPath) {
    const url = new URL(redirectPath, `https://${PRIMARY_DOMAIN}`);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
