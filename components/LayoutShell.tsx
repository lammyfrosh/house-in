"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/add-property");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}