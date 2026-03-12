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
  state: string;
  area: string;
  city: string;
  description: string;
  status: PropertyStatus;
  created_by_name?: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    loadProperties(token)
      .catch(() => setMessage("Could not load properties"))
      .finally(() => setLoading(false));
  }, [router]);

  async function updateStatus(id: number, status: PropertyStatus) {
    const token = localStorage.getItem("housein_token");

    if (!token) return;

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
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    setMessage(`Property ${status} successfully.`);
  }

  async function deleteProperty(id: number) {
    const token = localStorage.getItem("housein_token");

    if (!token) return;

    if (!window.confirm("Delete this property?")) return;

    const res = await fetch(`${API}/api/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Delete failed");
      return;
    }

    setProperties((prev) => prev.filter((p) => p.id !== id));
    setMessage("Property deleted successfully.");
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function statusClasses(status: PropertyStatus) {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Admin Property Control
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            Manage Properties
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Review submitted properties, approve or reject them, and delete unwanted listings.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm">
          {message}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                      {property.title}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClasses(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {property.area}, {property.city}, {property.state}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[var(--color-text-main)]">
                    {formatPrice(property.price)}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                    <span>Purpose: {property.purpose}</span>
                    <span>Type: {property.property_type}</span>
                    <span>Bedrooms: {property.bedrooms}</span>
                    <span>Bathrooms: {property.bathrooms}</span>
                  </div>

                  {property.created_by_name && (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      Created by: {property.created_by_name}
                    </p>
                  )}

                  {property.description && (
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                      {property.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(property.id, "approved")}
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(property.id, "rejected")}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateStatus(property.id, "pending")}
                    className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => deleteProperty(property.id)}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
                  >
                    Delete
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