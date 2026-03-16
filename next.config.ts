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
    value: "max-age=31536000; includeSubDomains",
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
    ];
  },
};

export default nextConfig;
