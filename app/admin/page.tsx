"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  PlusSquare,
  Building2,
  Globe,
  ArrowRight,
  Layers3,
  BadgeCheck,
  Scale,
} from "lucide-react";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();

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
        setMessage("Your admin session is active.");
      } catch (error) {
        console.error(error);
        setMessage("Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [API_BASE_URL, router]);

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

  const quickModules = [
    {
      title: "Add Property",
      text: "Create a new property listing with images and optional video.",
      href: "/add-property",
      icon: PlusSquare,
      badge: "Create",
    },
    {
      title: "Property Listings",
      text: "View, edit, approve, reject, or remove property listings.",
      href: "/admin/properties",
      icon: Building2,
      badge: "Manage",
    },
    {
      title: "Manage Users",
      text: "View all registered users and see every property uploaded by each user.",
      href: "/admin/users",
      icon: Users,
      badge: "Users",
    },
    {
      title: "Manage Admins",
      text: "Control admin access and manage trusted team members.",
      href: "/admin/admins",
      icon: ShieldCheck,
      badge: "Access",
    },
    {
      title: "Manage Builders",
      text: "Add, edit, and delete prominent builders displayed on the home page.",
      href: "/admin/builders",
      icon: Building2,
      badge: "Builders",
    },
    {
      title: "Manage Legal Providers",
      text: "Add, edit, and delete legal service providers displayed on the home page.",
      href: "/admin/legal-providers",
      icon: Scale,
      badge: "Legal",
    },
    {
      title: "View Website",
      text: "Open the public website and review the live experience.",
      href: "/",
      icon: Globe,
      badge: "Live Site",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f766e] via-[#0f766e] to-[#14b8a6]" />
          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                  Admin Dashboard
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {loading
                    ? "Loading dashboard..."
                    : `Welcome, ${user?.full_name?.split(" ")[0] || "Admin"}`}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  Manage listings, users, admin access, and key platform operations from one central dashboard.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/add-property"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
                >
                  Add Property
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/admin/users"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Open Users
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Logged In User
            </p>
            <div className="rounded-2xl bg-teal-50 p-2 text-[#0f766e]">
              <Users size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-bold text-slate-900">
            {loading ? "Loading..." : user?.full_name || "Unknown"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Checking..." : user?.email || "No email found"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Access Level
            </p>
            <div className="rounded-2xl bg-teal-50 p-2 text-[#0f766e]">
              <ShieldCheck size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-bold text-slate-900">
            {loading ? "Loading..." : roleLabel}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Property, user, admin, and homepage content management access
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Session Status
            </p>
            <div className="rounded-2xl bg-green-50 p-2 text-green-700">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-bold text-slate-900">
            {loading ? "Checking..." : "Active"}
          </p>

          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
              Main Modules
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Everything important in one place
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use these modules to manage the platform quickly and confidently.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <Layers3 size={16} />
            Clean and simple interface
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickModules.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-teal-50 p-3 text-[#0f766e]">
                    <Icon size={22} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    {card.badge}
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-semibold text-slate-900">
                  {card.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.text}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e]">
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
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
            Overview
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Built for daily admin work
          </h3>

          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
            <p>
              This dashboard is designed to help admins manage listings, users, admin access, and homepage content without unnecessary complexity.
            </p>
            <p>
              The most important actions are easy to find, the layout is clear, and the navigation stays straightforward.
            </p>
            <p>
              That makes it easier to move quickly and keep the platform properly managed.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
            Quick Actions
          </p>

          <div className="mt-4 space-y-3">
            <Link
              href="/add-property"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Add a new property listing</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/properties"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Open property listings</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>View all users</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/admins"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Manage admin accounts</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/builders"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Manage prominent builders</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/legal-providers"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Manage legal providers</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Open public website</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 rounded-2xl bg-teal-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-[#0f766e] shadow-sm">
                <BadgeCheck size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Admin tools ready
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Property management, user oversight, admin control, homepage content, and core navigation are all available from this dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}