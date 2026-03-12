"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PropertyStatus = "pending" | "approved" | "rejected";

type Property = {
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
  status: PropertyStatus;
  created_by_name?: string;
};

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);

  async function loadProperties(token: string) {
    const res = await fetch(`${API}/api/properties/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load properties");
    }

    setProperties(data.properties || []);
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

        setUser(meData.user);
        await loadProperties(token);
      } catch (error) {
        console.error(error);
        setMessage("Could not load properties");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API, router]);

  async function updateStatus(id: number, status: PropertyStatus) {
    const token = localStorage.getItem("housein_token");

    if (!token) return;

    setActionId(id);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/properties/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        setActionId(null);
        return;
      }

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );

      setMessage(`Property ${status} successfully.`);
    } catch (error) {
      console.error(error);
      setMessage("Could not update property status");
    } finally {
      setActionId(null);
    }
  }

  async function deleteProperty(id: number) {
    const token = localStorage.getItem("housein_token");

    if (!token) return;
    if (!window.confirm("Delete this property?")) return;

    setActionId(id);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Delete failed");
        setActionId(null);
        return;
      }

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setMessage("Property deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not delete property");
    } finally {
      setActionId(null);
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  function statusClasses(status: PropertyStatus) {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Admin Property Control
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-main)] sm:text-3xl">
            Manage Properties
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Review all listings, manage approval status, and remove unwanted properties.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-main)]">
            {user ? `Signed in as ${user.full_name}` : "Admin session"}
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            message.toLowerCase().includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-8 space-y-5">
        {loading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-muted)]">
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-muted)]">
            No properties found.
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white"
            >
              <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
                <div className="border-b border-[var(--color-border)] bg-gray-50 lg:border-b-0 lg:border-r">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-60 w-full object-cover lg:h-full"
                    />
                  ) : (
                    <div className="flex h-60 items-center justify-center px-4 text-center text-sm text-[var(--color-text-muted)] lg:h-full">
                      No property image uploaded
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
                          {property.title}
                        </h2>

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

                      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                        {property.area}, {property.city}, {property.state}
                      </p>

                      <p className="mt-3 text-lg font-bold text-[var(--color-text-main)]">
                        {formatPrice(property.price)}
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

                      {property.created_by_name && (
                        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                          Created by: {property.created_by_name}
                        </p>
                      )}

                      {property.description && (
                        <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
                          {property.description}
                        </p>
                      )}

                      {property.video_url && (
                        <div className="mt-5">
                          <p className="mb-2 text-sm font-semibold text-[var(--color-text-main)]">
                            Property Video
                          </p>
                          <video
                            controls
                            className="w-full rounded-xl border border-[var(--color-border)] bg-black"
                          >
                            <source src={property.video_url} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-2 xl:w-40">
                      <button
                        onClick={() => updateStatus(property.id, "approved")}
                        disabled={actionId === property.id}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(property.id, "rejected")}
                        disabled={actionId === property.id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => updateStatus(property.id, "pending")}
                        disabled={actionId === property.id}
                        className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => deleteProperty(property.id)}
                        disabled={actionId === property.id}
                        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}