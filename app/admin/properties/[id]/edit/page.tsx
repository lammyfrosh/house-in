"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
};

type PropertyForm = {
  title: string;
  purpose: string;
  property_type: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  parking_spaces: string;
  size: string;
  state: string;
  area: string;
  city: string;
  description: string;
  featured: boolean;
  status: PropertyStatus;
};

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);

  const [form, setForm] = useState<PropertyForm>({
    title: "",
    purpose: "rent",
    property_type: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parking_spaces: "",
    size: "",
    state: "",
    area: "",
    city: "",
    description: "",
    featured: false,
    status: "pending",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const existingImage = useMemo(() => {
    if (imagePreview) return imagePreview;
    return property?.image_url || "";
  }, [imagePreview, property?.image_url]);

  const existingVideo = useMemo(() => {
    if (videoPreview) return videoPreview;
    return property?.video_url || "";
  }, [videoPreview, property?.video_url]);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      if (!propertyId) {
        setMessage("Invalid property ID.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      try {
        // Check auth
        const meRes = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) {
          router.push("/signin");
          return;
        }

        // 🔥 LOAD PROPERTY (FIXED)
        const res = await fetch(`${API}/api/properties/admin/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load property");
        }

        const p: Property = data.property || data;
        setProperty(p);

        setForm({
          title: p.title || "",
          purpose: p.purpose || "rent",
          property_type: p.property_type || "",
          price: String(p.price ?? ""),
          bedrooms: String(p.bedrooms ?? ""),
          bathrooms: String(p.bathrooms ?? ""),
          toilets: String(p.toilets ?? ""),
          parking_spaces: String(p.parking_spaces ?? ""),
          size: p.size || "",
          state: p.state || "",
          area: p.area || "",
          city: p.city || "",
          description: p.description || "",
          featured: Boolean(p.featured),
          status: p.status || "pending",
        });
      } catch (error) {
        console.error(error);
        setMessage("Could not load property");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API, propertyId, router]);

  useEffect(() => {
    if (!selectedImage) return setImagePreview("");
    const url = URL.createObjectURL(selectedImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedVideo) return setVideoPreview("");
    const url = URL.createObjectURL(selectedVideo);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedVideo]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");
    if (!token) return router.push("/signin");

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (selectedImage) formData.append("image", selectedImage);
      if (selectedVideo) formData.append("video", selectedVideo);

      // 🔥 UPDATE PROPERTY
      const res = await fetch(`${API}/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Property updated successfully");
      setMessageType("success");

      setTimeout(() => {
        router.push("/admin/properties");
      }, 800);
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Edit Property</h1>

      {message && (
        <p
          className={`mt-3 ${
            messageType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-3"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-3"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3"
          />

          <button className="bg-black text-white px-6 py-3">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </main>
  );
}