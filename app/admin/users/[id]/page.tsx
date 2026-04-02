"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, ShieldCheck, Trash2 } from "lucide-react";

type UserDetails = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at?: string;
  is_verified?: number | boolean;
};

type UserProperty = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: "pending" | "approved" | "rejected";
  image_url?: string;
};

type Stats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<UserDetails | null>(null);
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API}/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          // ✅ SAFE HANDLING IF USER DOES NOT EXIST
          setMessage("User not found or has been deleted.");
          setUser(null);
          return;
        }

        setUser(data.user || null);
        setProperties(data.properties || []);
        setStats(
          data.stats || {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          }
        );
      } catch (error) {
        console.error(error);
        setMessage("Could not load this user.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) loadData();
  }, [API, router, userId]);

  const verifiedText = useMemo(() => {
    return Number(user?.is_verified) === 1 ? "Verified" : "Not Verified";
  }, [user]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  async function deleteUser() {
    if (!user) return;

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.full_name}?\n\nThis will permanently delete this user AND all ${stats.total} properties uploaded by them.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch(`${API}/api/auth/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      alert(
        `${user.full_name} deleted successfully.\n${data.deletedPropertiesCount || 0
        } properties removed.`
      );

      router.push("/admin/users");
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {loading ? "Loading..." : user?.full_name || "User Details"}
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="border px-4 py-2 rounded"
          >
            Back
          </button>

          {user && (
            <button
              onClick={deleteUser}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Trash2 size={16} />
              {deleting ? "Deleting..." : "Delete User"}
            </button>
          )}
        </div>
      </div>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      {!loading && user && (
        <>
          <div className="mt-6 border p-4 rounded">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {verifiedText}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">Properties</h2>

            {properties.length === 0 ? (
              <p>No properties uploaded.</p>
            ) : (
              properties.map((p) => (
                <div key={p.id} className="border p-3 mb-2 rounded">
                  <p className="font-semibold">{p.title}</p>
                  <p>{formatPrice(p.price)}</p>
                  <p>Status: {p.status}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}