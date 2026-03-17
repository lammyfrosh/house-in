"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  PlusSquare,
  Building2,
  Users,
  Globe,
  LogOut,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
    match: (pathname: string) => pathname === "/admin",
  },
  {
    label: "Add Property",
    href: "/add-property",
    icon: PlusSquare,
    match: (pathname: string) => pathname === "/add-property",
  },
  {
    label: "Property Listings",
    href: "/admin/properties",
    icon: Building2,
    match: (pathname: string) => pathname.startsWith("/admin/properties"),
  },
  {
    label: "Manage Admins",
    href: "/admin/admins",
    icon: Users,
    match: (pathname: string) => pathname.startsWith("/admin/admins"),
  },
  {
    label: "View Website",
    href: "/",
    icon: Globe,
    match: (pathname: string) => pathname === "/",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    router.push("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="bg-[#0f7c75] px-5 py-8 text-white">
          <div className="mb-10 px-2">
            <Link href="/admin" className="text-2xl font-extrabold tracking-tight">
              House-In
            </Link>
            <p className="mt-2 text-sm text-white/75">Admin Panel</p>
          </div>

          <div>
            <p className="px-3 text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">
              Main Navigation
            </p>

            <nav className="mt-5 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.match(pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-[22px] px-4 py-4 transition ${
                      isActive
                        ? "bg-white text-[#0f7c75] shadow-sm"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isActive
                            ? "bg-[#0f7c75]/10 text-[#0f7c75]"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <span
                        className={`truncate text-sm font-bold sm:text-[15px] ${
                          isActive ? "text-[#0f7c75]" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <span
                      className={`text-lg ${
                        isActive ? "text-[#0f7c75]/60" : "text-white/70"
                      }`}
                    >
                      ›
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-[20px] border border-white/15 px-4 py-4 text-left text-white transition hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <LogOut size={20} />
                </div>
                <span className="text-sm font-semibold">Logout</span>
              </div>
              <span className="text-white/70">›</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}