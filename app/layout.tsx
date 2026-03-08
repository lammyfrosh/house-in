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
    default: "House-In | Property Search Platform",
    template: "%s | House-In",
  },
  description:
    "House-In helps you find houses, apartments, land, and shortlet properties across Nigeria with a simple and reliable property search experience.",
  keywords: [
    "houses for rent Nigeria",
    "property for sale Nigeria",
    "shortlet Nigeria",
    "real estate Nigeria",
    "apartments Nigeria",
    "Nigeria property platform",
  ],
  openGraph: {
    title: "House-In Property Platform",
    description:
      "Search houses, apartments, land, and shortlet listings across Nigeria.",
    type: "website",
    url: "https://house-in.online",
    siteName: "House-In",
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