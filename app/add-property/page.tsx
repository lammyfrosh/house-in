"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

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
  otherState: string;
  area: string;
  city: string;
  description: string;
  contactPhone: string;
  featured: boolean;
};

const MAX_TOTAL_IMAGES = 10;
const VIDEO_TRIM_SECONDS = 60;

const FEATURED_STATES = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Edo",
  "Delta",
  "Anambra",
  "Enugu",
  "Imo",
  "Abia",
];

const ALL_NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const OTHER_STATES = ALL_NIGERIA_STATES.filter(
  (state) => !FEATURED_STATES.includes(state)
);

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
    otherState: "",
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
  const isProcessingVideo = saving && Boolean(selectedVideo);

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

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "state" && value !== "other") {
        next.otherState = "";
      }

      return next;
    });
  }

  function handleImagesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nextTotal = selectedImages.length + files.length;

    if (nextTotal > MAX_TOTAL_IMAGES) {
      setMessage(
        `You can upload a maximum of ${MAX_TOTAL_IMAGES} images in total.`
      );
      setMessageType("error");
      e.target.value = "";
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
    setMessage("");
    setMessageType("");
    e.target.value = "";
  }

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedVideo(null);
      return;
    }

    setSelectedVideo(file);
    setMessage(
      `Video selected. It will be automatically trimmed to the first ${VIDEO_TRIM_SECONDS} seconds after submission.`
    );
    setMessageType("success");
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

    if (selectedImages.length > MAX_TOTAL_IMAGES) {
      setMessage(
        `You can upload a maximum of ${MAX_TOTAL_IMAGES} images in total.`
      );
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

    const resolvedState =
      form.state === "other" ? form.otherState.trim() : form.state.trim();

    if (!resolvedState) {
      setMessage("Please select the state where the property is located.");
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
      formData.append("state", resolvedState);
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
        otherState: "",
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
              Create a new property listing with up to 10 images, one optional
              video that will be automatically trimmed to the first{" "}
              {VIDEO_TRIM_SECONDS} seconds, and structured location details for
              properties across Nigeria.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-main)]">
              {user
                ? `${user.full_name} • ${roleLabel}`
                : "Authenticated session"}
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

        {isProcessingVideo && (
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-800 shadow-sm">
            <div className="flex items-start gap-3">
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
              <div>
                <p className="font-semibold">
                  Uploading property and processing video...
                </p>
                <p className="mt-1 leading-6 text-blue-700">
                  Please keep this page open. Videos may take a little longer
                  while the system prepares the first {VIDEO_TRIM_SECONDS}{" "}
                  seconds for your listing.
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]"
        >
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
                      form.priceOnRequest
                        ? "Call for Price enabled"
                        : "e.g. 25000000"
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
                    min="0"
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
                    min="0"
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
                    min="0"
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
                    min="0"
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
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  >
                    <option value="">Select State</option>
                    {FEATURED_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Other States
                  </label>
                  <select
                    name="otherState"
                    value={form.otherState}
                    onChange={handleChange}
                    disabled={form.state !== "other"}
                    className={`h-12 w-full rounded-xl border px-4 outline-none transition ${
                      form.state === "other"
                        ? "border-[var(--color-border)] bg-white focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                        : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    }`}
                  >
                    <option value="">Select Other State</option>
                    {OTHER_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Choose from featured states or select Other to open the full
                    list.
                  </p>
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
                    placeholder="e.g. Lekki, Ajah, Wuse, GRA"
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
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
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
                    disabled={saving}
                    className="block w-full text-sm text-[var(--color-text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Upload up to {MAX_TOTAL_IMAGES} images in total, including
                    the main image.
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
                          disabled={saving}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
                    disabled={saving}
                    className="block w-full text-sm text-[var(--color-text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Videos longer than 1 minute will be automatically trimmed to
                    the first 60 seconds after upload.
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
                Make sure your title is clear, your location is accurate, and
                your description highlights the strongest selling points of the
                property.
              </p>

              <p>
                The contact phone number you enter will be used for direct calls
                and WhatsApp enquiries from interested buyers or tenants.
              </p>

              <p>
                State selection is now structured to keep your listings clean,
                consistent, and easier to search across the platform.
              </p>

              <p>
                You can upload up to {MAX_TOTAL_IMAGES} images and one optional
                video. Uploaded videos will be automatically trimmed to the first{" "}
                {VIDEO_TRIM_SECONDS} seconds.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {selectedVideo
                    ? "Uploading and processing video..."
                    : "Submitting Property..."}
                </span>
              ) : (
                "Submit Property"
              )}
            </button>

            {isProcessingVideo && (
              <p className="mt-3 text-center text-xs leading-5 text-[var(--color-text-muted)]">
                This may take a little longer because a video is being prepared.
              </p>
            )}
          </aside>
        </form>
      </div>
    </main>
  );
}