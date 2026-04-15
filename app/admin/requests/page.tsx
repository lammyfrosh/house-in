"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User2,
} from "lucide-react";

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

type RequestItem = {
  id: number;
  user_id?: number | null;
  full_name: string;
  email: string;
  phone?: string | null;
  title: string;
  purpose: "rent" | "sale" | "shortlet";
  property_type: string;
  budget: string;
  state: string;
  area: string;
  city?: string | null;
  bedrooms?: string | null;
  description: string;
  status: "new" | "pending" | "matched" | "completed" | "closed";
  admin_note?: string | null;
  created_at?: string;
  updated_at?: string;
};

type RequestCounts = {
  total: number;
  new: number;
  pending: number;
  matched: number;
  completed: number;
  closed: number;
};

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

function purposeLabel(purpose: string) {
  if (purpose === "rent") return "For Rent";
  if (purpose === "sale") return "For Sale";
  return "Shortlet";
}

function statusClass(status: string) {
  if (status === "new") return "bg-sky-50 text-sky-700 border-sky-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "matched") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "completed") return "bg-violet-50 text-violet-700 border-violet-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function AdminRequestsPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [counts, setCounts] = useState<RequestCounts>({
    total: 0,
    new: 0,
    pending: 0,
    matched: 0,
    completed: 0,
    closed: 0,
  });
  const [message, setMessage] = useState("Checking admin session...");
  const [activeStatus, setActiveStatus] = useState("all");
  const [savingId, setSavingId] = useState<number | null>(null);

  async function fetchRequests(token: string) {
    const res = await fetch(`${API}/api/requests/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch requests");
    }

    setRequests(data.requests || []);
    setCounts(
      data.counts || {
        total: 0,
        new: 0,
        pending: 0,
        matched: 0,
        completed: 0,
        closed: 0,
      }
    );
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const meRes = await fetch(`${API}/api/auth/me`, {
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

        const role = String(meData.user?.role || "").toLowerCase().trim();
        if (
          role !== "admin" &&
          role !== "superadmin" &&
          role !== "super_admin"
        ) {
          router.push("/dashboard");
          return;
        }

        setUser(meData.user);
        await fetchRequests(token);
        setMessage("Request management is ready.");
      } catch (error) {
        console.error(error);
        setMessage("Could not load requests right now.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API, router]);

  const filteredRequests = useMemo(() => {
    if (activeStatus === "all") return requests;
    return requests.filter((request) => request.status === activeStatus);
  }, [requests, activeStatus]);

  async function updateStatus(requestId: number, status: string) {
    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setSavingId(requestId);

      const res = await fetch(`${API}/api/requests/admin/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not update request status");
      }

      await fetchRequests(token);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not update request status"
      );
    } finally {
      setSavingId(null);
    }
  }

  const statusChips = [
    { key: "all", label: "All", count: counts.total },
    { key: "new", label: "New", count: counts.new },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "matched", label: "Matched", count: counts.matched },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "closed", label: "Closed", count: counts.closed },
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
                  Requests Dashboard
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {loading
                    ? "Loading requests..."
                    : `Manage property requests efficiently`}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  Review incoming requests, track demand, and update progress
                  from new to matched or completed.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/requests"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
                >
                  Open Requests Page
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Back to Admin
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statusChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setActiveStatus(chip.key)}
            className={`rounded-3xl border p-5 text-left shadow-sm transition ${
              activeStatus === chip.key
                ? "border-[#0f766e] bg-teal-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              {chip.label}
            </p>
            <p className="mt-4 text-2xl font-bold text-slate-900">
              {loading ? "..." : chip.count}
            </p>
          </button>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
              Request Queue
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Incoming leads and property demand
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {user ? `Signed in as ${user.full_name}` : "Loading user..."}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                <CheckCircle2 size={22} />
              </div>
              <h4 className="mt-4 text-xl font-bold text-slate-900">
                No requests in this view
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                There are currently no requests under the selected status filter.
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700">
                        {purposeLabel(request.purpose)}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${statusClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 size={12} />
                        {formatDate(request.created_at)}
                      </span>
                    </div>

                    <h4 className="mt-3 text-xl font-bold text-slate-900">
                      {request.title}
                    </h4>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-3">
                      <span className="inline-flex items-center gap-2">
                        <User2 size={15} />
                        {request.full_name}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} />
                        {request.email}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Phone size={15} />
                        {request.phone || "No phone provided"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <MapPin size={15} />
                        {request.area}, {request.city ? `${request.city}, ` : ""}
                        {request.state}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <BadgeDollarSign size={15} />
                        {request.budget}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck size={15} />
                        {request.property_type}
                        {request.bedrooms ? ` • ${request.bedrooms} beds` : ""}
                      </span>
                    </div>

                    <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        Request Details
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-full shrink-0 xl:w-[280px]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        Update Status
                      </p>

                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                        disabled={savingId === request.id}
                        className="mt-4 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                      >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="matched">Matched</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>

                      <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                        {savingId === request.id
                          ? "Updating request status..."
                          : "Status changes are saved immediately for admin tracking."}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <a
                          href={`mailto:${request.email}?subject=${encodeURIComponent(
                            `Regarding your property request: ${request.title}`
                          )}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          Email Requester
                          <ArrowRight size={16} />
                        </a>

                        {request.phone && (
                          <a
                            href={`tel:${request.phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Call Requester
                            <ArrowRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}