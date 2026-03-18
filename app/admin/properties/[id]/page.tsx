"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Property = {
  id: number;
  title: string;
  price: number;
  state: string;
  city: string;
  area: string;
  description: string;
  image_url?: string;
  status: string;
};

export default function AdminPropertyPreviewPage() {
  const router = useRouter();
  const params = useParams();

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(
          `${API}/api/properties/admin/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setProperty(data.property);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [API, params.id, router]);

  if (loading) {
    return <div className="p-6">Loading property...</div>;
  }

  if (!property) {
    return <div className="p-6">Property not found</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600 underline"
      >
        ← Back
      </button>

      <div className="rounded-2xl border bg-white p-6">
        {property.image_url && (
          <img
            src={property.image_url}
            alt={property.title}
            className="mb-5 h-64 w-full rounded-xl object-cover"
          />
        )}

        <h1 className="text-2xl font-bold">{property.title}</h1>

        <p className="mt-2 text-gray-600">
          {property.area}, {property.city}, {property.state}
        </p>

        <p className="mt-3 text-xl font-semibold">
          ₦{Number(property.price || 0).toLocaleString()}
        </p>

        <p className="mt-4 text-sm text-gray-700">{property.description}</p>

        <p className="mt-4 text-sm font-semibold">
          Status:{" "}
          <span className="capitalize">{property.status}</span>
        </p>
      </div>
    </main>
  );
}