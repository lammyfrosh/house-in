"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Users,
  Trash2,
} from "lucide-react";

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role?: string | null;
  created_at?: string;
  is_verified?: number | boolean;
  property_count: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
};

type SessionUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [actionId, setActionId] = useState<number | null>(null);

  const displayedUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const role = String(user.role || "").toLowerCase().trim();

      // Exclude only clear admin roles.
      if (
        role === "admin" ||
        role === "superadmin" ||
        role === "super_admin"
      ) {
        return false;
      }

      return true;
    });
  }, [allUsers]);

  const totals = useMemo(() => {
    return {
      users: displayedUsers.length,
      properties: displayedUsers.reduce(
        (sum, user) => sum + Number(user.property_count || 0),
        0
      ),
      verified: displayedUsers.filter((user) => Number(user.is_verified) === 1)
        .length,
    };
  }, [displayedUsers]);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const [meRes, usersRes] = await Promise.all([
          fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const meData = await meRes.json();
        const usersData = await usersRes.json();

        if (!meRes.ok) {
          localStorage.removeItem("housein_token");
          localStorage.removeItem("housein_user");
          router.push("/signin");
          return;
        }

        if (!usersRes.ok) {
          throw new Error(usersData.message || "Could not load users");
        }

        setSessionUser(meData.user);
        setAllUsers(Array.isArray(usersData.users) ? usersData.users : []);
        setMessage("All external users loaded successfully.");
        setMessageType("success");
      } catch (error) {
        console.error(error);
        setMessage("Could not load platform users.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API, router]);

  function formatRole(role?: string | null) {
    const clean = String(role || "").toLowerCase().trim();

    if (clean === "superadmin" || clean === "super_admin") return "Super Admin";
    if (clean === "admin") return "Admin";
    if (!clean) return "User";
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  async function deleteUser(user: AdminUser) {
    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.full_name}?\n\nThis will also permanently delete all properties uploaded by this user, including related images and videos.`
    );

    if (!confirmed) return;

    setActionId(user.id);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(`${API}/api/auth/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete user");
      }

      setAllUsers((prev) => prev.filter((item) => item.id !== user.id));

      setMessage(
        `${user.full_name} deleted successfully. ${Number(
          data.deletedPropertiesCount || 0
        )} properties removed.`
      );
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete user"
      );
      setMessageType("error");
    } finally {
      setActionId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
            Platform Users
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
            External Users and Upload Activity
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            View external users, their verification status, and delete users
            together with all properties uploaded by them when necessary.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
        >
          Back to Admin Dashboard
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Total Users
            </p>
            <div className="rounded-2xl bg-teal-50 p-2 text-[var(--color-primary-dark)]">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[var(--color-text-main)]">
            {totals.users}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Total Uploaded Properties
            </p>
            <div className="rounded-2xl bg-teal-50 p-2 text-[var(--color-primary-dark)]">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[var(--color-text-main)]">
            {totals.properties}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Verified Accounts
            </p>
            <div className="rounded-2xl bg-green-50 p-2 text-green-700">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[var(--color-text-main)]">
            {totals.verified}
          </p>
        </div>
      </div>

      {sessionUser && (
        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-main)] shadow-sm">
          Signed in as <span className="font-semibold">{sessionUser.full_name}</span>
        </div>
      )}

      {message && (
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            messageType === "success"
              ? "bg-green-50 text-green-700"
              : messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-muted)] shadow-sm">
            Loading users...
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-muted)] shadow-sm">
            No external users found.
          </div>
        ) : (
          displayedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
                      {user.full_name}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                      {formatRole(user.role)}
                    </span>

                    {Number(user.is_verified) === 1 ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase text-yellow-700">
                        Not Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={14} />
                      {user.email}
                    </span>
                    <span>Joined: {formatDate(user.created_at)}</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Total
                      </p>
                      <p className="mt-1 text-lg font-bold text-[var(--color-text-main)]">
                        {Number(user.property_count) || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                        Approved
                      </p>
                      <p className="mt-1 text-lg font-bold text-green-700">
                        {Number(user.approved_count) || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-yellow-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                        Pending
                      </p>
                      <p className="mt-1 text-lg font-bold text-yellow-700">
                        {Number(user.pending_count) || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-red-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-red-700">
                        Rejected
                      </p>
                      <p className="mt-1 text-lg font-bold text-red-700">
                        {Number(user.rejected_count) || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3 lg:w-56">
                  <button
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    View User
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => deleteUser(user)}
                    disabled={actionId === user.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Trash2 size={16} />
                    {actionId === user.id ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}