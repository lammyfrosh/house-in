"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

type PropertyStatus = "pending" | "approved" | "rejected";

type PropertyForm = {
  title: string;
  purpose: string;
  propertyType: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  parkingSpaces: string;
  size: string;
  state: string;
  area: string;
  city: string;
  description: string;
  featured: boolean;
};

export default function AddPropertyPage() {
  const router = useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PropertyForm>({
    title: "",
    purpose: "rent",
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parkingSpaces: "",
    size: "",
    state: "",
    area: "",
    city: "",
    description: "",
    featured: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("housein_token");
          localStorage.removeItem("housein_user");
          router.push("/signin");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(error);
        setMessage("Could not verify your session.");
        setMessageType("error");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [API, router]);

  useEffect(() => {
    if (selectedImages.length === 0) {
      setImagePreviews([]);
      return;
    }

    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  useEffect(() => {
    if (!selectedVideo) {
      setVideoPreview("");
      return;
    }

    const url = URL.createObjectURL(selectedVideo);
    setVideoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedVideo]);

  const roleLabel = useMemo(() => {
    const role = String(user?.role || "").toLowerCase().trim();

    if (role === "superadmin" || role === "super_admin") return "Super Admin";
    if (role === "admin") return "Admin";
    return user?.role || "User";
  }, [user]);

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

  function handleImagesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  }

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedVideo(file);
  }

  function removeImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (selectedImages.length === 0) {
      setMessage("Please upload at least one property image.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();

      // must match backend createProperty names exactly
      formData.append("title", form.title.trim());
      formData.append("purpose", form.purpose);
      formData.append("propertyType", form.propertyType.trim());
      formData.append("price", form.price || "0");
      formData.append("bedrooms", form.bedrooms || "0");
      formData.append("bathrooms", form.bathrooms || "0");
      formData.append("toilets", form.toilets || "0");
      formData.append("parkingSpaces", form.parkingSpaces || "0");
      formData.append("size", form.size.trim());
      formData.append("state", form.state.trim());
      formData.append("area", form.area.trim());
      formData.append("city", form.city.trim());
      formData.append("description", form.description.trim());
      formData.append("featured", String(form.featured));

      // backend supports both image and images
      if (selectedImages[0]) {
        formData.append("image", selectedImages[0]);
      }

      if (selectedImages.length > 1) {
        selectedImages.slice(1).forEach((file) => {
          formData.append("images", file);
        });
      }

      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }

      const res = await fetch(`${API}/api/properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create property");
      }

      const createdStatus: PropertyStatus =
        data.status || data.property?.status || "pending";

      setMessage(
        createdStatus === "approved"
          ? "Property created successfully and is now live."
          : "Property created successfully and is awaiting approval."
      );
      setMessageType("success");

      setForm({
        title: "",
        purpose: "rent",
        propertyType: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        toilets: "",
        parkingSpaces: "",
        size: "",
        state: "",
        area: "",
        city: "",
        description: "",
        featured: false,
      });

      setSelectedImages([]);
      setSelectedVideo(null);

      setTimeout(() => {
        router.push("/admin/properties");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not create property"
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--color-text-muted)]">
              Checking your session...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
              Property Submission
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
              Add New Property
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Create a new property listing with multiple images, optional video,
              and all the details needed for a strong presentation.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500">
              Logged In As
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
              {user?.full_name || "Unknown user"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
          </div>
        </div>

        {message && (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm shadow-sm ${
              messageType === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]"
        >
          <section className="space-y-6">
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Core Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Property Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    placeholder="e.g. Luxury 4 Bedroom Detached Duplex"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                    <option value="shortlet">Shortlet</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Property Type
                  </label>
                  <input
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    placeholder="e.g. Duplex, Apartment, Bungalow"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Size
                  </label>
                  <input
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    placeholder="e.g. 650 sqm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Property Features
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Bedrooms
                  </label>
                  <input
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Bathrooms
                  </label>
                  <input
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={form.bathrooms}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Toilets
                  </label>
                  <input
                    name="toilets"
                    type="number"
                    min="0"
                    value={form.toilets}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Parking Spaces
                  </label>
                  <input
                    name="parkingSpaces"
                    type="number"
                    min="0"
                    value={form.parkingSpaces}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Location & Description
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Area / District
                  </label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={7}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    placeholder="Write a compelling property description..."
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Listing Controls
              </h2>

              <div className="mt-5 space-y-4">
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-[var(--color-text-main)]">
                    Mark as Featured Listing
                  </span>
                </label>

                <div className="rounded-2xl bg-gray-50 p-4 text-xs text-[var(--color-text-muted)]">
                  The first uploaded image becomes the primary listing image.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Property Images
              </h2>

              <div className="mt-5">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />
                        <div className="flex items-center justify-between bg-white px-3 py-2 text-xs">
                          <span className="font-semibold text-[var(--color-text-main)]">
                            {index === 0 ? "Primary image" : `Image ${index + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="font-semibold text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                    Upload one or more property images
                  </div>
                )}

                <label className="mt-4 block text-sm font-semibold text-[var(--color-text-main)]">
                  Property Images <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  You can upload multiple images. The first one will be used as
                  the main listing image.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Property Video
              </h2>

              <div className="mt-5">
                {videoPreview ? (
                  <video
                    controls
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-black"
                  >
                    <source src={videoPreview} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                    Optional video upload
                  </div>
                )}

                <label className="mt-4 block text-sm font-semibold text-[var(--color-text-main)]">
                  Property Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Creating Property..." : "Create Property"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/admin/properties")}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}