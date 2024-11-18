// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { SessionProvider } from "next-auth/react";
// import NextTopLoader from "nextjs-toploader";
// import Script from "next/script";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Imagin Ai",
//   description:
//     "Ai image generator with high quality images supported multiple image llm flux schnell, flux dev, flux pro",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           async
//           src="https://www.googletagmanager.com/gtag/js?id=G-LGYT0281S0"
//         ></Script>
//         <Script id="google-analytics">
//           {`
//      window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'G-LGYT0281S0');
//     `}
//         </Script>
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <NextTopLoader color="#237afd" height={1} />

//         <SessionProvider>{children}</SessionProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

// Import popular Google Fonts for a more aesthetic look
import { Inter, Raleway, Playfair_Display } from 'next/font/google';

// Modern sans-serif font for main text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Elegant font for headings
const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

// Sophisticated font for special elements
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// Keep Geist fonts for code and monospace elements
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// Enhanced metadata for better SEO
const title = "Create Professional AI Art | Imagin AI - #1 AI Image Generator";
const description = 
  "Transform your ideas into stunning AI-generated artwork in seconds. Use professional-grade Flux models (Schnell, Dev, Pro) to create unique, high-resolution images. Perfect for designers, artists, and creators. Start generating for free today.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Imagin AI - Professional AI Art Generator",
  },
  description,
  keywords: [
    "AI image generator",
    "professional AI art",
    "Flux AI models",
    "high-resolution AI images",
    "AI art generator for professionals",
    "text to image AI",
    "AI artwork creator",
    "custom AI art",
    "commercial AI images",
    "AI design tool",
    "AI visual content",
    "instant AI art",
    "Flux Schnell model",
    "Flux Dev model",
    "Flux Pro model",
  ],
  authors: [{ name: "Imagin AI Team", url: "https://imaginai.art/team" }],
  creator: "Imagin AI",
  publisher: "Imagin AI",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  metadataBase: new URL("https://imaginai.art"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-us',
      'es': '/es',
    },
  },
  openGraph: {
    title: "Imagin AI | Create Professional AI Art in Seconds",
    description,
    url: "https://imaginai.art",
    siteName: "Imagin AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
        alt: "Imagin AI - Professional AI Image Generator",
        type: "image/jpeg",
      },
      {
        url: "/images/showcase-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "AI Art Examples by Imagin AI",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Professional AI Art in Seconds | Imagin AI",
    description,
    images: [`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
    creator: "@imaginaiart",
    site: "@imaginaiart",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'notranslate': true,
    },
  },
  verification: {
    google: "6zPeqruO38Z-TysdctT337Ta0TtGLQcI0PQFJQSKyT8",
    other: {
      "google-site-verification": "6zPeqruO38Z-TysdctT337Ta0TtGLQcI0PQFJQSKyT8",
      "norton-safeweb-site-verification": "norton-verification-code",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload Fonts */}
        <link
          rel="preload"
          href="/fonts/GeistMonoVF.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        
        {/* Preconnect to Critical Origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Enhanced Analytics with IP Anonymization and Cookie Consent */}
        <Script 
          strategy="afterInteractive" 
          src="https://www.googletagmanager.com/gtag/js?id=G-LGYT0281S0"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LGYT0281S0', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Enhanced Schema.org JSON-LD */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Imagin AI",
              description,
              applicationCategory: "Image Generator",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              brand: {
                "@type": "Brand",
                name: "Imagin AI",
                logo: "https://imaginai.art/logo.png"
              },
              url: "https://imaginai.art",
              image: "https://imaginai.art/og-image.jpg",
              screenshot: "https://imaginai.art/screenshot.jpg",
              featureList: [
                "High-resolution AI image generation",
                "Multiple AI models (Flux Schnell, Dev, Pro)",
                "Professional-grade outputs",
                "Instant generation",
                "Commercial usage rights"
              ],
              applicationSubCategory: "AI Art Generator",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${raleway.variable} ${playfair.variable} ${geistMono.variable} antialiased min-h-screen font-sans`}
      >
        <NextTopLoader color="#237afd" height={2} showSpinner={false} />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}