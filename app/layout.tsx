import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutShell from "../components/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://house-in.online";
const siteName = "House-In";
const siteTitle = "House-In | Property Search Platform";
const siteDescription =
  "House-In helps you find houses, apartments, land, and shortlet properties across Nigeria with a simple and reliable property search experience.";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | House-In",
  },
  description: siteDescription,
  keywords: [
    "houses for rent Nigeria",
    "property for sale Nigeria",
    "shortlet Nigeria",
    "real estate Nigeria",
    "apartments Nigeria",
    "Nigeria property platform",
    "Lagos property",
    "Abuja property",
    "buy house in Nigeria",
    "rent apartment in Nigeria",
  ],
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "A5Q4rRWWs3af2Zk84JLWjd903P5mB1EIm-5RTZI4fRs",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/hero-v2.jpg",
        width: 1600,
        height: 900,
        alt: "House-In property platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/hero-v2.jpg"],
  },
  category: "real estate",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}

        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}