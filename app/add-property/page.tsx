"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

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
  priceOnRequest: boolean;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  parkingSpaces: string;
  size: string;
  state: string;
  area: string;
  city: string;
  description: string;
  contactPhone: string;
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
    priceOnRequest: false,
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parkingSpaces: "",
    size: "",
    state: "",
    area: "",
    city: "",
    description: "",
    contactPhone: "",
    featured: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const normalizedRole = useMemo(() => {
    return String(user?.role || "").toLowerCase().trim();
  }, [user]);

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "super_admin";

  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

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
          window.dispatchEvent(new Event("housein-auth-changed"));
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
    if (normalizedRole === "superadmin" || normalizedRole === "super_admin") {
      return "Super Admin";
    }
    if (normalizedRole === "admin") {
      return "Admin";
    }
    return "User";
  }, [normalizedRole]);

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
    if (files.length === 0) return;

    setSelectedImages((prev) => [...prev, ...files]);
    e.target.value = "";
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

    if (!form.priceOnRequest && !form.price.trim()) {
      setMessage("Please enter a price or turn on Call for Price.");
      setMessageType("error");
      return;
    }

    if (!form.contactPhone.trim()) {
      setMessage("Please enter a contact phone number.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("purpose", form.purpose);
      formData.append("propertyType", form.propertyType.trim());
      formData.append("price", form.priceOnRequest ? "0" : form.price || "0");
      formData.append("priceOnRequest", String(form.priceOnRequest));
      formData.append("bedrooms", form.bedrooms || "0");
      formData.append("bathrooms", form.bathrooms || "0");
      formData.append("toilets", form.toilets || "0");
      formData.append("parkingSpaces", form.parkingSpaces || "0");
      formData.append("size", form.size.trim());
      formData.append("state", form.state.trim());
      formData.append("area", form.area.trim());
      formData.append("city", form.city.trim());
      formData.append("description", form.description.trim());
      formData.append("contactPhone", form.contactPhone.trim());
      formData.append("featured", String(form.featured));

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
        data.status || data.property?.status || "approved";

      setMessage(
        createdStatus === "approved"
          ? "Property created successfully and is now live."
          : "Property created successfully."
      );
      setMessageType("success");

      setForm({
        title: "",
        purpose: "rent",
        propertyType: "",
        price: "",
        priceOnRequest: false,
        bedrooms: "",
        bathrooms: "",
        toilets: "",
        parkingSpaces: "",
        size: "",
        state: "",
        area: "",
        city: "",
        description: "",
        contactPhone: "",
        featured: false,
      });

      setSelectedImages([]);
      setSelectedVideo(null);

      setTimeout(() => {
        router.push(dashboardHref);
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
              Checking your session.
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-main)]">
              {user ? `${user.full_name} • ${roleLabel}` : "Authenticated session"}
            </div>

            <button
              onClick={() => router.push(dashboardHref)}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Property Details
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Property Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. Luxury 4 Bedroom Duplex"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  >
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                    <option value="shortlet">Shortlet</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Property Type
                  </label>
                  <input
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. Duplex, Apartment, Land"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required={!form.priceOnRequest}
                    disabled={form.priceOnRequest}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder={
                      form.priceOnRequest ? "Call for Price enabled" : "e.g. 25000000"
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 08031234567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] px-4 py-3 text-sm text-[var(--color-text-main)]">
                    <input
                      type="checkbox"
                      name="priceOnRequest"
                      checked={form.priceOnRequest}
                      onChange={handleChange}
                    />
                    Use Call for Price instead of showing a fixed amount
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Toilets
                  </label>
                  <input
                    type="number"
                    name="toilets"
                    value={form.toilets}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={form.parkingSpaces}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Size
                  </label>
                  <input
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. 650 sqm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. Lagos"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Area
                  </label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. Lekki"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="e.g. Lagos"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="Write a compelling property description..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] px-4 py-3 text-sm text-[var(--color-text-main)]">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                    />
                    Mark this property as featured
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Media Uploads
              </h2>

              <div className="mt-5 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Property Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="block w-full text-sm text-[var(--color-text-main)]"
                  />
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Upload one main image and as many gallery images as you want.
                  </p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8fafc]"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-44 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Property Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="block w-full text-sm text-[var(--color-text-main)]"
                  />
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Optional video upload for a richer listing presentation.
                  </p>
                </div>

                {videoPreview && (
                  <video
                    controls
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-black"
                  >
                    <source src={videoPreview} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
              Submission Guide
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--color-text-muted)]">
              <p>
                Make sure your title is clear, your location is accurate, and your
                description highlights the strongest selling points of the property.
              </p>

              <p>
                The contact phone number you enter will be used for direct calls
                and WhatsApp enquiries from interested buyers or tenants.
              </p>

              <p>
                Strong images and a short video can dramatically improve how
                premium your listing feels.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Submitting Property..." : "Submit Property"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}