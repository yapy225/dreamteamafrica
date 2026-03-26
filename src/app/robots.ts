import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://dreamteamafrica.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
          "/auth",
          "/cart",
          "/mes-billets",
          "/check",
          "/resa-exposants",
          "/exposants/reservation",
          "/exposants/confirmation",
          "/exposants/profil",
          "/billetterie-exposants",
          "/casting",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
