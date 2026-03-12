"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

type MeUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function ManageAdminsPage() {
  const router = useRouter();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [me, setMe] = useState<MeUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  async function loadAdmins(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load admins");
    }

    setAdmins(data.admins || data.users || []);
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const meData = await meRes.json();

        if (!meRes.ok) {
          localStorage.removeItem("housein_token");
          localStorage.removeItem("housein_user");
          router.push("/signin");
          return;
        }

        if (meData.user?.role !== "super_admin") {
          router.push("/admin");
          return;
        }

        setMe(meData.user);
        await loadAdmins(token);
      } catch (error) {
        console.error(error);
        setMessage("Could not connect to backend");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API_BASE_URL, router]);

  async function handleCreateAdmin(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not create admin.");
        setSubmitting(false);
        return;
      }

      setMessage("Admin created successfully.");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("admin");

      await loadAdmins(token);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAdmin(id: number) {
    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not delete admin.");
        setDeletingId(null);
        return;
      }

      setMessage("Admin removed successfully.");
      await loadAdmins(token);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-600">Loading admin management...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Super Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            Manage Admins
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Create admin accounts and manage access to the platform.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
        >
          Back to Admin
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Create Admin
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Signed in as {me?.full_name}
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleCreateAdmin}>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {message && (
              <div
                className={`rounded-xl px-3 py-3 text-sm ${
                  message.toLowerCase().includes("success")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-xl bg-[var(--color-primary-dark)] text-sm font-bold uppercase text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Existing Admins
          </h2>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-600"
                    >
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="bg-gray-50">
                      <td className="rounded-l-xl px-4 py-4 text-sm font-medium text-[var(--color-text-main)]">
                        {admin.full_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">
                        {admin.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--color-text-main)]">
                        {admin.role}
                      </td>
                      <td className="rounded-r-xl px-4 py-4 text-right">
                        {me?.id === admin.id ? (
                          <span className="text-xs font-semibold text-gray-400">
                            Current user
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            disabled={deletingId === admin.id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            {deletingId === admin.id ? "Removing..." : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}