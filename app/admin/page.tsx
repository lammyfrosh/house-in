"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        setMessage("Welcome to the super admin portal.");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage("Could not connect to backend");
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Super Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            House-In Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Manage listings, approvals, and admin users from one place.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
            Logged In User
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
            {loading ? "Loading..." : user?.full_name || "Unknown"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {loading ? "" : user?.email}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
            Role
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
            {loading ? "Loading..." : user?.role || "Unknown"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Full property and admin control
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
            Status
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
            {loading ? "Checking..." : "Active"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/add-property"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Add Property
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Post a new property listing directly to the system.
          </p>
        </Link>

        <Link
          href="/admin/properties"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Manage Listings
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Approve, reject, or delete submitted properties.
          </p>
        </Link>

        <Link
          href="/admin/admins"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Manage Admins
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Create and remove admin accounts.
          </p>
        </Link>

        <Link
          href="/"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            View Website
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Return to the public-facing property site.
          </p>
        </Link>
      </div>
    </main>
  );
}