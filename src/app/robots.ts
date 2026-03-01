import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
