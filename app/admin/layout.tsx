"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  Building2,
  Users,
  Globe,
  LogOut,
  Briefcase,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Add Property",
      href: "/add-property",
      icon: PlusSquare,
    },
    {
      label: "Property Listings",
      href: "/admin/properties",
      icon: Building2,
    },
    {
      label: "Manage Admins",
      href: "/admin/admins",
      icon: Users,
    },
    {
      label: "View Website",
      href: "/",
      icon: Globe,
    },
  ];

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    router.push("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-[#0f766e] text-white">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <Briefcase size={22} />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">
                    House-In
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Admin Portal</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/75">
                Premium control center for managing listings, admins, and platform activity.
              </p>
            </div>

            <div className="flex-1 px-4 py-5">
              <p className="px-3 text-xs font-extrabold uppercase tracking-[0.18em] text-white/60">
                Main Navigation
              </p>

              <nav className="mt-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/admin") ||
                    (item.href === "/admin" && pathname === "/admin");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                        active
                          ? "bg-white text-[#0f766e] shadow-sm"
                          : "text-white/85 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-xl p-2 ${
                            active
                              ? "bg-[#0f766e]/10 text-[#0f766e]"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>

                      <ChevronRight size={16} className={active ? "opacity-100" : "opacity-60"} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/10 px-4 py-5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
                  House-In Control Panel
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  Administrative Workspace
                </h1>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Clean, simple, and owner-friendly
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}