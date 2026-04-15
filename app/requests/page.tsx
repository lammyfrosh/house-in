"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BedDouble,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

type PublicRequest = {
  id: number;
  title: string;
  state: string;
  area: string;
  city?: string | null;
  purpose: "rent" | "sale" | "shortlet";
  property_type: string;
  bedrooms?: string | null;
  budget: string;
  description: string;
  status: "new" | "pending" | "matched" | "completed" | "closed";
  created_at?: string;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  title: string;
  purpose: "rent" | "sale" | "shortlet";
  propertyType: string;
  budget: string;
  state: string;
  area: string;
  city: string;
  bedrooms: string;
  description: string;
};

type LoggedInUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

function purposeBadge(purpose: string) {
  if (purpose === "rent") return "FOR RENT";
  if (purpose === "sale") return "FOR SALE";
  return "SHORTLET";
}

function readablePurpose(purpose: string) {
  if (purpose === "rent") return "For Rent";
  if (purpose === "sale") return "For Sale";
  return "Shortlet";
}

function statusTone(status: string) {
  if (status === "matched") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function formatPostedDate(value?: string) {
  if (!value) return "Recently posted";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RequestsPage() {
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [me, setMe] = useState<LoggedInUser | null>(null);

  const [stateFilter, setStateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");

  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    phone: "",
    title: "",
    purpose: "rent",
    propertyType: "",
    budget: "",
    state: "",
    area: "",
    city: "",
    bedrooms: "",
    description: "",
  });

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch(`${API}/api/requests`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not fetch requests");
        }

        setRequests(data.requests || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRequests(false);
      }
    }

    loadRequests();
  }, [API]);

  useEffect(() => {
    async function hydrateUser() {
      const token = localStorage.getItem("housein_token");
      if (!token) return;

      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) return;

        const user = data.user as LoggedInUser;
        setMe(user);

        setForm((prev) => ({
          ...prev,
          full_name: prev.full_name || user.full_name || "",
          email: prev.email || user.email || "",
        }));
      } catch (error) {
        console.error(error);
      }
    }

    hydrateUser();
  }, [API]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const stateMatches = stateFilter
        ? request.state.toLowerCase() === stateFilter.toLowerCase()
        : true;

      const areaMatches = areaFilter
        ? `${request.area} ${request.city || ""}`
            .toLowerCase()
            .includes(areaFilter.toLowerCase())
        : true;

      const purposeMatches = purposeFilter
        ? request.purpose.toLowerCase() === purposeFilter.toLowerCase()
        : true;

      return stateMatches && areaMatches && purposeMatches;
    });
  }, [requests, stateFilter, areaFilter, purposeFilter]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        purpose: form.purpose,
        propertyType: form.propertyType.trim(),
        budget: form.budget.trim(),
        state: form.state.trim(),
        area: form.area.trim(),
        city: form.city.trim(),
        bedrooms: form.bedrooms.trim(),
        description: form.description.trim(),
      };

      const res = await fetch(`${API}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not submit request");
      }

      setSuccessMessage(
        data.message ||
          "Your request has been submitted successfully. Our team will review it and contact you if a matching property becomes available."
      );

      setForm({
        full_name: me?.full_name || "",
        email: me?.email || "",
        phone: "",
        title: "",
        purpose: "rent",
        propertyType: "",
        budget: "",
        state: "",
        area: "",
        city: "",
        bedrooms: "",
        description: "",
      });

      const refresh = await fetch(`${API}/api/requests`, {
        cache: "no-store",
      });
      const refreshedData = await refresh.json();
      if (refresh.ok) {
        setRequests(refreshedData.requests || []);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Could not submit request"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#f6f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 xl:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
              <ShieldCheck size={14} />
              Requests Marketplace
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Tell us the kind of property you need
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Submit a detailed request and let our team keep an eye out for
              the right property. Once a suitable option becomes available, you
              can be contacted quickly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Open Requests
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {loadingRequests ? "..." : requests.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Matching Focus
                </p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  Rent, Sale & Shortlet
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Feedback
                </p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  Admin-reviewed requests
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
                  Submit Request
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Request a property
                </h2>
              </div>

              <div className="rounded-2xl bg-teal-50 p-3 text-[#0f766e]">
                <Send size={20} />
              </div>
            </div>

            {successMessage && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Full Name
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 px-3">
                  <User size={18} className="text-slate-400" />
                  <input
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    required
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 px-3">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Phone Number
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 px-3">
                  <Phone size={18} className="text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                    placeholder="0803 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Purpose
                </label>
                <select
                  value={form.purpose}
                  onChange={(e) =>
                    updateField(
                      "purpose",
                      e.target.value as "rent" | "sale" | "shortlet"
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="shortlet">Shortlet</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Request Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="e.g. Looking for a 3 Bedroom Duplex in Lekki"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Property Type
                </label>
                <input
                  value={form.propertyType}
                  onChange={(e) => updateField("propertyType", e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="Duplex, Apartment, Land..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Budget
                </label>
                <input
                  value={form.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="₦20m - ₦35m or ₦3m / year"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  State
                </label>
                <input
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="Lagos"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Area / LGA
                </label>
                <input
                  value={form.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="Lekki"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  City
                </label>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="Lagos"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Bedrooms
                </label>
                <input
                  value={form.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                  placeholder="2+, 3+, 4..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  placeholder="Describe the kind of property, location preference, estate preference, finishing, parking needs, and any other important detail."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting Request..." : "Submit Request"}
                  {!submitting && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 xl:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
              Request Feed
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Active property requests
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Explore current public requests to understand what people are
              actively searching for on the platform.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse Listings
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-12">
          <div className="relative md:col-span-3">
            <input
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
              placeholder="State"
            />
          </div>

          <div className="relative md:col-span-4">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm outline-none"
              placeholder="Area / LGA"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
            >
              <option value="">All purposes</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
              <option value="shortlet">Shortlet</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setStateFilter("");
              setAreaFilter("");
              setPurposeFilter("");
            }}
            className="h-12 rounded-2xl bg-slate-900 px-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white transition hover:opacity-90 md:col-span-2"
          >
            Reset
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {loadingRequests ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <MessageSquareText size={24} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  No requests found
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  There are no matching public requests for the current filter.
                  Try changing the filters or post a fresh request above.
                </p>
              </div>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700">
                        {purposeBadge(request.purpose)}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${statusTone(
                          request.status
                        )}`}
                      >
                        {request.status.replace("_", " ")}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 size={12} />
                        {formatPostedDate(request.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      {request.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
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
                        <BedDouble size={15} />
                        {request.bedrooms || "Flexible beds"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {request.description}
                    </p>
                  </div>

                  <div className="w-full shrink-0 xl:w-[260px]">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        Request Summary
                      </p>

                      <div className="mt-4 space-y-3 text-sm text-slate-700">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Purpose</span>
                          <span className="font-semibold">
                            {readablePurpose(request.purpose)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Type</span>
                          <span className="font-semibold text-right">
                            {request.property_type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Status</span>
                          <span className="font-semibold capitalize">
                            {request.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/search"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Browse Listings
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-teal-50 p-3 text-[#0f766e]">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                How feedback works
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Once a request is submitted, it is visible to the admin team for
                review. Requests can then be tracked internally with statuses
                like new, pending, matched, completed, or closed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}