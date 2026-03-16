"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

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
    "House-In helps you find houses, apartments, land, and shortlet properties across Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/add-property");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {!isAdminRoute && <Header />}

          <main className="flex-1">{children}</main>

          {!isAdminRoute && <Footer />}
        </div>
      </body>
    </html>
  );
}