import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Providers from "@/components/layout/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dream Team Africa — Culture africaine à Paris",
    template: "%s | Dream Team Africa",
  },
  description:
    "La plateforme de référence pour la promotion de la culture africaine à Paris. Événements, marketplace artisanale, journal L'Afropéen.",
  keywords: [
    "culture africaine",
    "Paris",
    "événements",
    "marketplace",
    "artisanat africain",
    "diaspora",
    "afrique",
    "artisans",
    "journal afropéen",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Dream Team Africa",
    title: "Dream Team Africa — Culture africaine à Paris",
    description:
      "Événements exclusifs, marketplace artisanale et journal de la diaspora. La culture africaine rayonne à Paris.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/logo-dta.png`,
        width: 800,
        height: 800,
        alt: "Dream Team Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Team Africa",
    description:
      "Événements, marketplace artisanale et journal de la diaspora africaine à Paris.",
    images: [`${siteUrl}/logo-dta.png`],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${outfit.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
