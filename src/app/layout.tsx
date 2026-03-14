import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Providers from "@/components/layout/Providers";
import "./globals.css";

const GTM_ID = "GTM-N5GGFDFK";
const FB_PIXEL_ID = "502775309263991";

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
  },
  twitter: {
    card: "summary_large_image",
    site: "@dreamteamafrica",
    title: "Dream Team Africa",
    description:
      "Événements, marketplace artisanale et journal de la diaspora africaine à Paris.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
          fbq('set', 'autoConfig', true, '${FB_PIXEL_ID}');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{display: "none"}}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      </head>
      <body
        className={`${cormorant.variable} ${outfit.variable} antialiased`}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
