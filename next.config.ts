import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://dreamteamafricamedia.b-cdn.net https://images.unsplash.com https://*.stripe.com https://lh3.googleusercontent.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://api.resend.com https://www.google-analytics.com https://vitals.vercel-insights.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "dreamteamafricamedia.b-cdn.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/letthemusicplay",
          destination: "https://letthemusicplay.vercel.app/letthemusicplay",
        },
        {
          source: "/letthemusicplay/:path+",
          destination: "https://letthemusicplay.vercel.app/letthemusicplay/:path+",
        },
      ],
    };
  },
  async redirects() {
    return [
      // Anciennes URLs du site WordPress/précédent → nouvelles URLs
      { source: "/foire-dafrique-paris", destination: "/saison-culturelle-africaine/foire-dafrique-paris", permanent: true },
      { source: "/foire-dafrique-paris/", destination: "/saison-culturelle-africaine/foire-dafrique-paris", permanent: true },
      { source: "/fashion-week-africa-paris", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/fashion-week-africa-paris/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/festival-du-conte-africain", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/festival-du-conte-africain/", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/juste-une-danse", destination: "/saison-culturelle-africaine/juste-une-danse", permanent: true },
      { source: "/juste-une-danse/", destination: "/saison-culturelle-africaine/juste-une-danse", permanent: true },
      // Anciennes routes /event/*
      { source: "/event/fashion-week-africa-paris", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/event/fashion-week-africa-paris/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/event/foire-dafrique-paris", destination: "/saison-culturelle-africaine/foire-dafrique-paris", permanent: true },
      { source: "/event/foire-dafrique-paris/", destination: "/saison-culturelle-africaine/foire-dafrique-paris", permanent: true },
      { source: "/event/billets-le-grand-defile-zulu", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/event/billets-le-grand-defile-zulu/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/event/billets-salon-made-in-africa", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },
      { source: "/event/billets-salon-made-in-africa/", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },
      { source: "/event/:slug", destination: "/saison-culturelle-africaine/:slug", permanent: true },
      { source: "/event/:slug/", destination: "/saison-culturelle-africaine/:slug", permanent: true },
      // Anciennes routes /events/*
      { source: "/events", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/events/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/events/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/evenements", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/evenements/", destination: "/saison-culturelle-africaine", permanent: true },
      // Ancien contact
      { source: "/contact", destination: "/nous-contacter", permanent: true },
      { source: "/contact/", destination: "/nous-contacter", permanent: true },
      // Ancien salon-made (URL tronquée dans Google)
      { source: "/salon-made-in-africa", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },
      // Anciennes URLs légales avec trailing slash
      { source: "/conditions-generales-de-ventes/", destination: "/conditions-generales-de-ventes", permanent: true },
      { source: "/conditions-generales-dutilisation/", destination: "/conditions-generales-dutilisation", permanent: true },
      { source: "/politique-dannulation-et-remboursement/", destination: "/politique-dannulation-et-remboursement", permanent: true },
      // Blog ancien
      { source: "/sortir-a-paris/:slug*", destination: "/lafropeen", permanent: true },
      // Sitemap cassé
      { source: "/dreamteamafrica.com/sitemap.xml", destination: "/sitemap.xml", permanent: true },

      // ── Anciennes URLs WordPress 404 (Google Search Console) ──
      // Pages d'accueil
      { source: "/accueil", destination: "/", permanent: true },
      { source: "/accueil/", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/$", destination: "/", permanent: true },

      // Archives WordPress
      { source: "/2025/:path*", destination: "/lafropeen", permanent: true },
      { source: "/2024/:path*", destination: "/lafropeen", permanent: true },
      { source: "/page/:path*", destination: "/saison-culturelle-africaine", permanent: true },

      // Anciens événements supprimés
      { source: "/africa-bbq-fontenay-sous-bois-2026", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/africa-bbq-fontenay-sous-bois-2026/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/festival-du-conte-africain-paris", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/festival-du-conte-africain-paris/", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/festival-du-conte-africain-paris-2025", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/festival-du-conte-africain-paris-2025/", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/salon-made-in-africa-paris", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },
      { source: "/salon-made-in-africa-paris/", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },

      // Anciens packs exposants
      { source: "/pack-exposants-foire-dafrique-paris", destination: "/exposants", permanent: true },
      { source: "/pack-exposants-foire-dafrique-paris/", destination: "/exposants", permanent: true },
      { source: "/event/pack-professionnel-fashion-week-africa", destination: "/exposants", permanent: true },
      { source: "/event/pack-professionnel-fashion-week-africa/", destination: "/exposants", permanent: true },

      // Anciennes pages légales/cookies
      { source: "/politiques-de-cookies", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/politiques-de-cookies/", destination: "/politique-de-confidentialite", permanent: true },

      // Ancien blog WordPress
      { source: "/beurre-de-vache/:path*", destination: "/lafropeen", permanent: true },
      { source: "/categorie/:path*", destination: "/lafropeen", permanent: true },

      // Ancien festival-du-conte-africain event avec UTM (le base path gère les query params)
      { source: "/event/festival-du-conte-africain", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/event/festival-du-conte-africain/", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },

      // Slugs inexistants redirigés par /event/:slug vers /saison-culturelle-africaine/:slug
      { source: "/saison-culturelle-africaine/pack-professionnel-fashion-week-africa", destination: "/exposants", permanent: true },
      { source: "/saison-culturelle-africaine/billets-le-grand-defile-zulu", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/saison-culturelle-africaine/billets-salon-made-in-africa", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },

      // ── Wildcards blog WordPress (cosmétique, art, lifestyle) → /lafropeen ──
      { source: "/huile-de-chebe/:path*", destination: "/lafropeen", permanent: true },
      { source: "/huile-de-coco/:path*", destination: "/lafropeen", permanent: true },
      { source: "/beurre-de-karite/:path*", destination: "/lafropeen", permanent: true },
      { source: "/beurre-de-cacao/:path*", destination: "/lafropeen", permanent: true },
      { source: "/cosmetique-afrique/:path*", destination: "/lafropeen", permanent: true },
      { source: "/art-africain/:path*", destination: "/lafropeen", permanent: true },
      { source: "/balade-sur-la-seine/:path*", destination: "/lafropeen", permanent: true },
      { source: "/dream-team-africa/:path*", destination: "/lafropeen", permanent: true },
      { source: "/posts/:path*", destination: "/lafropeen", permanent: true },
      { source: "/post/:path*", destination: "/lafropeen", permanent: true },
      { source: "/blog", destination: "/lafropeen", permanent: true },
      { source: "/blog/", destination: "/lafropeen", permanent: true },
      { source: "/blog/:path*", destination: "/lafropeen", permanent: true },
      { source: "/hello-world", destination: "/lafropeen", permanent: true },
      { source: "/hello-world/", destination: "/lafropeen", permanent: true },

      // Pages individuelles ancien blog
      { source: "/huile-de-chebe", destination: "/lafropeen", permanent: true },
      { source: "/huile-de-coco", destination: "/lafropeen", permanent: true },
      { source: "/beurre-de-karite", destination: "/lafropeen", permanent: true },
      { source: "/beurre-de-cacao", destination: "/lafropeen", permanent: true },
      { source: "/cosmetique-afrique", destination: "/lafropeen", permanent: true },
      { source: "/art-africain", destination: "/lafropeen", permanent: true },
      { source: "/balade-sur-la-seine", destination: "/lafropeen", permanent: true },

      // ── Wildcards événements anciens → pages correspondantes ──
      { source: "/salon-made-in-africa/:path*", destination: "/saison-culturelle-africaine/salon-made-in-africa", permanent: true },
      { source: "/foire-dafrique-paris/:path*", destination: "/saison-culturelle-africaine/foire-dafrique-paris", permanent: true },
      { source: "/fashion-week-africa-paris/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/festival-du-conte-africain/:path*", destination: "/saison-culturelle-africaine/festival-conte-africain", permanent: true },
      { source: "/juste-une-danse/:path*", destination: "/saison-culturelle-africaine/juste-une-danse", permanent: true },
      { source: "/africa-bbq/:path*", destination: "/saison-culturelle-africaine", permanent: true },

      // ── Billetterie & paiement anciens ──
      { source: "/billetterie-en-ligne", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/billetterie-en-ligne/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/billetterie-en-ligne/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/paiement-carte-fashion-week-africa", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/paiement-carte-fashion-week-africa/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/paiement-carte-fashion-week-africa/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/recuperer-mon-billet", destination: "/dashboard/tickets", permanent: true },
      { source: "/recuperer-mon-billet/", destination: "/dashboard/tickets", permanent: true },
      { source: "/commande-de-stands", destination: "/exposants", permanent: true },
      { source: "/commande-de-stands/", destination: "/exposants", permanent: true },

      // ── Anciennes pages diverses ──
      { source: "/activite/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/nos-activites-planifiees", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/nos-activites-planifiees/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/election-miss-diaspora-paris", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/election-miss-diaspora-paris/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/evasion-paris-lusury/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/foire-de-paris/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/contactez-nous", destination: "/nous-contacter", permanent: true },
      { source: "/contactez-nous/", destination: "/nous-contacter", permanent: true },

      // ── Layouts / WordPress system / shop ──
      { source: "/layouts/:path*", destination: "/", permanent: true },
      { source: "/shop", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/shop/", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/shop/:path*", destination: "/saison-culturelle-africaine", permanent: true },
      { source: "/tf_header_footer/:path*", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },

      // ── Archives année supplémentaires ──
      { source: "/2023/:path*", destination: "/lafropeen", permanent: true },
      { source: "/2022/:path*", destination: "/lafropeen", permanent: true },
      { source: "/2021/:path*", destination: "/lafropeen", permanent: true },
      { source: "/2020/:path*", destination: "/lafropeen", permanent: true },
    ];
  },
};

export default nextConfig;
