"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: number;
  title: string;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    fetch(`${API}/api/properties/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <button
        onClick={() => router.push("/add-property")}
        className="mb-6 bg-black text-white px-4 py-2 rounded"
      >
        Add Property
      </button>

      <div className="space-y-3">
        {properties.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <h2 className="font-semibold">{p.title}</h2>
            <p>Status: {p.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}