"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
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
  Trash2,
} from "lucide-react";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

type AdminRecord = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at?: string;
};

export default function ManageAdminsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [messageSession, setMessageSession] = useState("Checking session...");

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminsError, setAdminsError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  /* ---------- Session & role check ---------- */
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
        setMessageSession("Welcome back. Your admin workspace is ready.");

        // If not super admin, redirect away
        const currentRole = String(data.user.role || "").toLowerCase().trim();
        if (
          currentRole !== "superadmin" &&
          currentRole !== "super_admin"
        ) {
          router.push("/admin"); // go to main dashboard
          return;
        }
      } catch (error) {
        console.error(error);
        setMessageSession("Could not connect to backend");
      } finally {
        setLoadingSession(false);
      }
    }

    checkAuth();
  }, [API_BASE_URL, router]);

  const normalizedRole = useMemo(() => {
    return String(user?.role || "").toLowerCase().trim();
  }, [user]);

  const isSuperAdmin = useMemo(() => {
    return normalizedRole === "superadmin" || normalizedRole === "super_admin";
  }, [normalizedRole]);

  const roleLabel = useMemo(() => {
    if (normalizedRole === "superadmin" || normalizedRole === "super_admin") {
      return "Super Admin";
    }
    if (normalizedRole === "admin") return "Admin";
    return user?.role || "User";
  }, [normalizedRole, user]);

  /* ---------- Load admins ---------- */
  useEffect(() => {
    async function fetchAdmins() {
      const token = localStorage.getItem("housein_token");
      if (!token) return;

      setLoadingAdmins(true);
      setAdminsError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not fetch admins");
        }

        setAdmins(data.admins || []);
      } catch (err) {
        console.error(err);
        setAdminsError("Failed to load admins");
      } finally {
        setLoadingAdmins(false);
      }
    }

    if (!loadingSession && isSuperAdmin) {
      fetchAdmins();
    }
  }, [API_BASE_URL, loadingSession, isSuperAdmin]);

  /* ---------- Form handlers ---------- */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    // simple validation
    if (!form.full_name || !form.email || !form.password) {
      setCreateError("All fields are required");
      return;
    }

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not create admin");
      }

      setCreateSuccess("Admin created successfully");
      setForm({ full_name: "", email: "", password: "" });

      // reload admins list
      const listRes = await fetch(`${API_BASE_URL}/api/auth/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listData = await listRes.json();
      if (listRes.ok) {
        setAdmins(listData.admins || []);
      }
    } catch (err) {
      console.error(err);
      setCreateError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  }

  /* ---------- Delete admin ---------- */
  async function handleDelete(id: number) {
    const confirm = window.confirm(
      "Are you sure you want to delete this admin? This cannot be undone."
    );
    if (!confirm) return;

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // Refresh list
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error
          ? err.message
          : "Error deleting admin. Try again."
      );
    }
  }

  /* ---------- Sidebar nav ----------
     Use same logic as dashboard but hide or keep items based on role. */
  const navItems = [
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
    ...(isSuperAdmin
      ? [
          {
            label: "Manage Admins",
            href: "/admin/admins",
            icon: Users,
            description: "Create and manage admin accounts",
          },
        ]
      : []),
    {
      label: "View Website",
      href: "/",
      icon: Globe,
      description: "Open the public website",
    },
  ] as {
    label: string;
    href: string;
    icon: any;
    description: string;
  }[];

  /* ---------- Render ---------- */
  return (
    <main className="min-h-screen bg-[var(--color-primary)]/10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
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
                Manage admin accounts, properties, and the website.
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
                            active
                              ? "text-white/80"
                              : "text-[var(--color-text-muted)]"
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
                {loadingSession
                  ? "Loading session..."
                  : user?.full_name || "Unknown user"}
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {loadingSession ? "Please wait..." : user?.email || "No email"}
              </p>

              <button
                onClick={() => {
                  localStorage.removeItem("housein_token");
                  localStorage.removeItem("housein_user");
                  router.push("/signin");
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {/* Header */}
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
                        {loadingSession
                          ? "Loading..."
                          : `Manage Admins — ${user?.full_name?.split(" ")[0] || "Admin"
                            }`}
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                        Create new admins, remove old ones, and control who has
                        access to the platform.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Link
                        href="/admin"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:opacity-90"
                      >
                        Dashboard
                        <ArrowRight size={16} />
                      </Link>

                      <Link
                        href="/admin/properties"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                      >
                        Properties
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session and role cards */}
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
                  {loadingSession ? "Loading..." : user?.full_name || "Unknown"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {loadingSession ? "Checking..." : user?.email || "No email"}
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
                  {loadingSession ? "Loading..." : roleLabel}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {isSuperAdmin
                    ? "Full admin and access control"
                    : "Limited access"}
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
                  {loadingSession ? "Checking..." : "Active"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {messageSession}
                </p>
              </div>
            </div>

            {/* Create admin form */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                    New Admin
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)]">
                    Add a new admin account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Super admins can create additional admin accounts. Choose a
                    strong password, and share securely.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreate}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                <div className="sm:col-span-2">
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    required
                  />
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    required
                  />
                </div>

                <div>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    required
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {creating ? "Creating..." : "Create Admin"}
                  </button>
                </div>

                {/* messages */}
                {createError && (
                  <p className="sm:col-span-3 text-red-600 text-sm">
                    {createError}
                  </p>
                )}
                {createSuccess && (
                  <p className="sm:col-span-3 text-green-700 text-sm">
                    {createSuccess}
                  </p>
                )}
              </form>
            </div>

            {/* Admins table */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                Existing Admins
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)]">
                Manage accounts
              </h2>

              {loadingAdmins ? (
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  Loading admins...
                </p>
              ) : adminsError ? (
                <p className="mt-4 text-sm text-red-600">{adminsError}</p>
              ) : admins.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  No admins found.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-left text-sm">
                    <thead>
                      <tr>
                        <th className="border-b border-[var(--color-border)] px-4 py-2">
                          Name
                        </th>
                        <th className="border-b border-[var(--color-border)] px-4 py-2">
                          Email
                        </th>
                        <th className="border-b border-[var(--color-border)] px-4 py-2">
                          Role
                        </th>
                        <th className="border-b border-[var(--color-border)] px-4 py-2">
                          Created
                        </th>
                        <th className="border-b border-[var(--color-border)] px-4 py-2">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((a) => (
                        <tr key={a.id}>
                          <td className="border-b border-[var(--color-border)] px-4 py-2">
                            {a.full_name}
                          </td>
                          <td className="border-b border-[var(--color-border)] px-4 py-2">
                            {a.email}
                          </td>
                          <td className="border-b border-[var(--color-border)] px-4 py-2">
                            {a.role}
                          </td>
                          <td className="border-b border-[var(--color-border)] px-4 py-2">
                            {a.created_at
                              ? new Date(a.created_at).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border-b border-[var(--color-border)] px-4 py-2">
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}