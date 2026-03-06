import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "House-In | Property for Sale, Rent & Shortlet in Nigeria",
    template: "%s | House-In",
  },
  description:
    "Find verified properties for sale, rent and shortlet across Lagos, Abuja, Rivers and other Nigerian states.",
  keywords: [
    "Nigeria property",
    "houses for sale Nigeria",
    "apartments for rent Lagos",
    "shortlet Lagos",
    "real estate Nigeria",
    "property website Nigeria",
  ],
  openGraph: {
    title: "House-In | Property for Sale, Rent & Shortlet in Nigeria",
    description:
      "Search verified houses, apartments, land and shortlet properties across Nigeria.",
    url: "https://house-in.online",
    siteName: "House-In",
    type: "website",
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}