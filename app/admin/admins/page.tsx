"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusSquare,
  Building2,
  Users,
  Globe,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
};

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("Checking session...");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("housein_token");
          localStorage.removeItem("housein_user");
          router.push("/signin");
          return;
        }

        setUser(data.user);
        setMessage("Welcome back. Your admin workspace is ready.");
      } catch (error) {
        console.error(error);
        setMessage("Could not connect to backend");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [API_BASE_URL, router]);

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    router.push("/signin");
  }

  const roleLabel = useMemo(() => {
    const role = String(user?.role || "").toLowerCase().trim();

    if (role === "superadmin" || role === "super_admin") {
      return "Super Admin";
    }

    if (role === "admin") {
      return "Admin";
    }

    return user?.role || "User";
  }, [user]);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Overview and quick access",
    },
    {
      label: "Add Property",
      href: "/add-property",
      icon: PlusSquare,
      description: "Create a new property listing",
    },
    {
      label: "Property Listings",
      href: "/admin/properties",
      icon: Building2,
      description: "Manage uploaded properties",
    },
    {
      label: "Manage Admins",
      href: "/admin/admins",
      icon: Users,
      description: "Create and manage admin accounts",
    },
    {
      label: "View Website",
      href: "/",
      icon: Globe,
      description: "Open the public website",
    },
  ];

  const actionCards = [
    {
      title: "Add Property",
      text: "Upload a new property with images and optional video.",
      href: "/add-property",
      icon: PlusSquare,
      badge: "Fast action",
    },
    {
      title: "Property Listings",
      text: "View all uploaded listings and manage their status.",
      href: "/admin/properties",
      icon: Building2,
      badge: "Core module",
    },
    {
      title: "Manage Admins",
      text: "Create new admins and control who can access the platform.",
      href: "/admin/admins",
      icon: Users,
      badge: "Access control",
    },
    {
      title: "View Website",
      text: "Check the public-facing website experience instantly.",
      href: "/",
      icon: Globe,
      badge: "Public site",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-primary)]/10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <div className="border-b border-[var(--color-border)] pb-5">
              <div className="inline-flex rounded-2xl bg-[var(--color-primary)]/20 p-3 text-[var(--color-primary-dark)]">
                <Briefcase size={22} />
              </div>

              <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
                House-In Control
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)]">
                Admin Panel
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                A clean and simple workspace for managing properties, admins, and the website.
              </p>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
                Navigation
              </p>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition ${
                        active
                          ? "bg-[var(--color-primary-dark)] text-white shadow-sm"
                          : "text-[var(--color-text-main)] hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 rounded-xl p-2 ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p
                          className={`mt-1 text-xs leading-5 ${
                            active ? "text-white/80" : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-gray-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
                Session
              </p>

              <p className="mt-2 text-sm font-semibold text-[var(--color-text-main)]">
                {loading ? "Loading session..." : user?.full_name || "Unknown user"}
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {loading ? "Please wait..." : user?.email || "No email found"}
              </p>

              <button
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-dark)] to-[var(--color-primary)] opacity-95" />
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        <Sparkles size={14} />
                        Premium Admin Workspace
                      </div>

                      <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                        {loading
                          ? "Loading dashboard..."
                          : `Welcome, ${user?.full_name?.split(" ")[0] || "Admin"}`}
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                        Manage properties, control admin access, and keep the platform organised from one simple dashboard.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Link
                        href="/add-property"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:opacity-90"
                      >
                        Add Property
                        <ArrowRight size={16} />
                      </Link>

                      <Link
                        href="/admin/properties"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                      >
                        Open Listings
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
                    Logged In User
                  </p>
                  <div className="rounded-xl bg-[var(--color-primary)]/20 p-2 text-[var(--color-primary-dark)]">
                    <Users size={18} />
                  </div>
                </div>

                <p className="mt-4 text-xl font-bold text-[var(--color-text-main)]">
                  {loading ? "Loading..." : user?.full_name || "Unknown"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {loading ? "Checking..." : user?.email || "No email found"}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
                    Access Level
                  </p>
                  <div className="rounded-xl bg-[var(--color-primary)]/20 p-2 text-[var(--color-primary-dark)]">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <p className="mt-4 text-xl font-bold text-[var(--color-text-main)]">
                  {loading ? "Loading..." : roleLabel}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Property and admin management access
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
                    Session Status
                  </p>
                  <div className="rounded-xl bg-green-100 p-2 text-green-700">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <p className="mt-4 text-xl font-bold text-[var(--color-text-main)]">
                  {loading ? "Checking..." : "Active"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {message}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                    Main Modules
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)]">
                    Everything important in one place
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Use these sections to manage the platform quickly and confidently.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {actionCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="rounded-2xl bg-[var(--color-primary)]/20 p-3 text-[var(--color-primary-dark)]">
                          <Icon size={22} />
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                          {card.badge}
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-[var(--color-text-main)]">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                        {card.text}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-dark)]">
                        Open module
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                  Owner-Friendly Dashboard
                </p>

                <h3 className="mt-3 text-2xl font-bold text-[var(--color-text-main)]">
                  Simple, clear, and easy to understand
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  <p>
                    This dashboard is designed so that anyone can understand the major actions without needing technical knowledge.
                  </p>
                  <p>
                    The key tasks are shown as large cards, the navigation is always visible, and each module clearly explains what it does.
                  </p>
                  <p>
                    That makes the experience feel premium while still remaining practical for daily use.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                  Quick Actions
                </p>

                <div className="mt-4 space-y-3">
                  <Link
                    href="/add-property"
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-4 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    <span>Add a new property listing</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/admin/properties"
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-4 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    <span>Open property listings</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/admin/admins"
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-4 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    <span>Manage admin accounts</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-4 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    <span>Open public website</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
