import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dream Team Africa",
    short_name: "DTA",
    description:
      "La plateforme de référence pour la promotion de la culture africaine à Paris.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F4",
    theme_color: "#8B6F4E",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
