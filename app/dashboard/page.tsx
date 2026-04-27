"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Info,
  MessageCircle,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

type Property = {
  id: number;
  title: string;
  status: "pending" | "approved" | "rejected" | string;
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number | boolean;
  created_at?: string;
};

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

const ADMIN_WHATSAPP_NUMBER = "2348075990912";

export default function DashboardPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setNotifications(data.notifications || []);
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

  const stats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter((p) => p.status === "approved").length;
    const pending = properties.filter((p) => p.status === "pending").length;
    const rejectedNotifications = notifications.filter((n) =>
      String(n.title || "").toLowerCase().includes("rejected")
    ).length;

    return { total, approved, pending, rejectedNotifications };
  }, [properties, notifications]);

  function badgeClass(status: string) {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }
    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }
    return "bg-yellow-100 text-yellow-700";
  }

  function notificationTone(type: string) {
    if (type === "warning") {
      return "border-red-200 bg-red-50";
    }
    if (type === "success") {
      return "border-green-200 bg-green-50";
    }
    return "border-slate-200 bg-slate-50";
  }

  function notificationIcon(type: string) {
    if (type === "warning") {
      return <XCircle size={18} className="text-red-600" />;
    }
    if (type === "success") {
      return <CheckCircle2 size={18} className="text-green-600" />;
    }
    return <Info size={18} className="text-slate-600" />;
  }

  function formatDate(value?: string) {
    if (!value) return "Recently";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function handleWhatsAppAdmin() {
    const firstName = user?.full_name?.split(" ")?.[0] || "there";
    const message = `Hello admin, this is ${firstName}. I need help with my House-In property listing/account.`;
    const url = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  }

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
        <div className="rounded-3xl bg-[var(--color-primary-dark)] px-6 py-8 text-white shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/75">
                External User Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Welcome back
                {user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Manage your submitted properties, track approval status, and
                stay informed through notifications from the admin team.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push("/add-property")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
              >
                <PlusCircle size={16} className="text-[#0f766e]" />
                Add Property
              </button>

              <button
                onClick={handleWhatsAppAdmin}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <MessageCircle size={16} />
                WhatsApp Admin
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <RefreshCw size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-main)]">
                Listing Renewal Notice
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                To keep House-In listings fresh, accurate, and helpful for
                property seekers, properties that have stayed on the platform
                for up to two months may need to be uploaded again if they are
                still available.
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--color-text-muted)]">
              Total Active Listings
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              <p className="text-sm text-[var(--color-text-muted)]">Approved</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              {stats.approved}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-yellow-600" />
              <p className="text-sm text-[var(--color-text-muted)]">Pending</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-red-600" />
              <p className="text-sm text-[var(--color-text-muted)]">
                Rejection Notifications
              </p>
            </div>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              {stats.rejectedNotifications}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
                  My Properties
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Keep an eye on every active listing you have submitted.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-[#fcfcfd] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                          {property.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                          Listing ID: #{property.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeClass(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                    No active properties right now
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Start by submitting your first property listing or check your
                    notifications for recent admin updates.
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      onClick={() => router.push("/add-property")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <PlusCircle size={16} />
                      Submit Property
                    </button>

                    <button
                      onClick={handleWhatsAppAdmin}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                    >
                      <MessageCircle size={16} />
                      Chat Admin on WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-primary)]/10 p-3 text-[var(--color-primary-dark)]">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Important updates from the platform and admin team.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-2xl border p-4 ${notificationTone(
                      notification.type
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {notificationIcon(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="text-sm font-semibold text-[var(--color-text-main)]">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[#fcfcfd] p-6 text-center">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    No notifications yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}