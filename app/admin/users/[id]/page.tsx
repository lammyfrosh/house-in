"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

type UserDetails = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at?: string;
  is_verified?: number | boolean;
};

type UserProperty = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  parking_spaces?: number;
  size?: string;
  state: string;
  area: string;
  city: string;
  description: string;
  image_url?: string;
  video_url?: string;
  featured?: number | boolean;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
};

type Stats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<UserDetails | null>(null);
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API}/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load user details");
        }

        setUser(data.user || null);
        setProperties(data.properties || []);
        setStats(
          data.stats || {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          }
        );
      } catch (error) {
        console.error(error);
        setMessage("Could not load this user and their properties.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadData();
    }
  }, [API, router, userId]);

  const verifiedText = useMemo(() => {
    return Number(user?.is_verified) === 1 ? "Verified" : "Not Verified";
  }, [user]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  function formatRole(role?: string) {
    const clean = String(role || "").toLowerCase().trim();

    if (clean === "superadmin" || clean === "super_admin") return "Super Admin";
    if (clean === "admin") return "Admin";
    return "User";
  }

  function statusClasses(status: UserProperty["status"]) {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  }

  function canViewLive(status: UserProperty["status"]) {
    return status === "approved";
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
            User Detail
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
            {loading ? "Loading user..." : user?.full_name || "User Details"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            See this user’s account details and every property they have uploaded.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/users")}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
        >
          Back to All Users
        </button>
      </div>

      {message && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      {!loading && user && (
        <>
          <section className="mt-6 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                    {user.full_name}
                  </h2>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                    {formatRole(user.role)}
                  </span>

                  {Number(user.is_verified) === 1 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
                      {verifiedText}
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase text-yellow-700">
                      {verifiedText}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={14} />
                    {user.email}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={14} />
                    User ID: {user.id}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4 xl:w-[440px]">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-text-main)]">
                    {stats.total}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                    Approved
                  </p>
                  <p className="mt-1 text-lg font-bold text-green-700">
                    {stats.approved}
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                    Pending
                  </p>
                  <p className="mt-1 text-lg font-bold text-yellow-700">
                    {stats.pending}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-700">
                    Rejected
                  </p>
                  <p className="mt-1 text-lg font-bold text-red-700">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 space-y-5">
            {properties.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-muted)] shadow-sm">
                This user has not uploaded any properties yet.
              </div>
            ) : (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
                >
                  <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                    <div className="border-b border-[var(--color-border)] bg-slate-50 lg:border-b-0 lg:border-r">
                      {property.image_url ? (
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="h-56 w-full object-cover lg:h-full"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center px-4 text-center text-sm text-[var(--color-text-muted)] lg:h-full">
                          No property image uploaded
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                              {property.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClasses(
                                property.status
                              )}`}
                            >
                              {property.status}
                            </span>

                            {Boolean(property.featured) && (
                              <span className="rounded-full bg-[var(--color-primary-dark)]/10 px-3 py-1 text-xs font-bold uppercase text-[var(--color-primary-dark)]">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-lg font-bold text-[var(--color-text-main)]">
                            {formatPrice(property.price)}
                          </p>

                          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                            {property.area}, {property.city}, {property.state}
                          </p>

                          <div className="mt-4 grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2 xl:grid-cols-3">
                            <span>Purpose: {property.purpose}</span>
                            <span>Type: {property.property_type}</span>
                            <span>Bedrooms: {property.bedrooms ?? 0}</span>
                            <span>Bathrooms: {property.bathrooms ?? 0}</span>
                            <span>Toilets: {property.toilets ?? 0}</span>
                            <span>Parking: {property.parking_spaces ?? 0}</span>
                            {property.size ? <span>Size: {property.size}</span> : null}
                          </div>

                          {property.description && (
                            <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
                              {property.description}
                            </p>
                          )}
                        </div>

                        <div className="flex w-full flex-col gap-2 xl:w-56">
                          {canViewLive(property.status) ? (
                            <button
                              onClick={() => router.push(`/property/${property.slug}`)}
                              className="rounded-2xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                            >
                              View Live Property
                            </button>
                          ) : (
                            <button
                              onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
                              className="rounded-2xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                            >
                              Review in Admin
                            </button>
                          )}

                          <button
                            onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
                            className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                          >
                            Edit Property
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}