"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: number;
  title: string;
  status: string;
};

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedRole = useMemo(() => {
    return String(user?.role || "").toLowerCase().trim();
  }, [user]);

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "super_admin";

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("housein_token");
      const storedUser = localStorage.getItem("housein_user");

      if (!token) {
        router.push("/signin");
        return;
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const role = String(parsedUser?.role || "").toLowerCase().trim();
          if (
            role === "admin" ||
            role === "superadmin" ||
            role === "super_admin"
          ) {
            router.push("/admin");
            return;
          }
        } catch (error) {
          console.error(error);
        }
      }

      try {
        const res = await fetch(`${API}/api/properties/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load your properties");
        }

        setProperties(data.properties || []);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "Could not load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [API, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--color-text-muted)]">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
              External User Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              My Properties
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              View all the properties you have submitted and track their approval
              status.
            </p>
          </div>

          <button
            onClick={() => router.push("/add-property")}
            className="rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add Property
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property.id}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                      {property.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Status:{" "}
                      <span className="font-semibold capitalize">
                        {property.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                No properties yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                You have not submitted any property listing yet.
              </p>
              <button
                onClick={() => router.push("/add-property")}
                className="mt-5 rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Submit Your First Property
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}