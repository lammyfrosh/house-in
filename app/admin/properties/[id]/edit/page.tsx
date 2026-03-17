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
  gallery_images?: string[];
  featured?: number | boolean;
  status: PropertyStatus;
  created_by_name?: string;
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

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState("");

  const existingImages = useMemo(() => {
    if (imagePreviews.length > 0) return imagePreviews;

    if (property?.gallery_images && property.gallery_images.length > 0) {
      return property.gallery_images;
    }

    if (property?.image_url) {
      return [property.image_url];
    }

    return [];
  }, [imagePreviews, property?.gallery_images, property?.image_url]);

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
        const meRes = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) {
          localStorage.removeItem("housein_token");
          localStorage.removeItem("housein_user");
          router.push("/signin");
          return;
        }

        const res = await fetch(`${API}/api/properties/admin/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load property");
        }

        const loadedProperty: Property = data.property || data;
        setProperty(loadedProperty);

        setForm({
          title: loadedProperty.title || "",
          purpose: loadedProperty.purpose || "rent",
          property_type: loadedProperty.property_type || "",
          price: String(loadedProperty.price ?? ""),
          bedrooms: String(loadedProperty.bedrooms ?? ""),
          bathrooms: String(loadedProperty.bathrooms ?? ""),
          toilets: String(loadedProperty.toilets ?? ""),
          parking_spaces: String(loadedProperty.parking_spaces ?? ""),
          size: loadedProperty.size || "",
          state: loadedProperty.state || "",
          area: loadedProperty.area || "",
          city: loadedProperty.city || "",
          description: loadedProperty.description || "",
          featured: Boolean(loadedProperty.featured),
          status: loadedProperty.status || "pending",
        });
      } catch (error) {
        console.error(error);
        setMessage(
          error instanceof Error ? error.message : "Could not load property"
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [API, propertyId, router]);

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

    const objectUrl = URL.createObjectURL(selectedVideo);
    setVideoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
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

  function handleImagesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  }

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedVideo(file);
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (!propertyId) {
      setMessage("Invalid property ID.");
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
      formData.append("property_type", form.property_type.trim());
      formData.append("price", form.price || "0");
      formData.append("bedrooms", form.bedrooms || "0");
      formData.append("bathrooms", form.bathrooms || "0");
      formData.append("toilets", form.toilets || "0");
      formData.append("parking_spaces", form.parking_spaces || "0");
      formData.append("size", form.size.trim());
      formData.append("state", form.state.trim());
      formData.append("area", form.area.trim());
      formData.append("city", form.city.trim());
      formData.append("description", form.description.trim());
      formData.append("featured", String(form.featured ? 1 : 0));
      formData.append("status", form.status);

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

      const res = await fetch(`${API}/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update property");
      }

      const updatedProperty: Property = data.property || {
        ...(property as Property),
        ...form,
        featured: form.featured ? 1 : 0,
      };

      setProperty(updatedProperty);
      setSelectedImages([]);
      setSelectedVideo(null);

      setMessage("Property updated successfully.");
      setMessageType("success");

      setTimeout(() => {
        router.push("/admin/properties");
      }, 900);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not update property"
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
              Admin Property Editor
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
              Edit Property
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Update listing details, replace the image gallery or video, and
              keep the property presentation polished and production-ready.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/admin/properties")}
              className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text-main)] shadow-sm transition hover:bg-gray-50"
            >
              Back to Properties
            </button>

            {property?.slug && property.status === "approved" ? (
              <button
                type="button"
                onClick={() => router.push(`/property/${property.slug}`)}
                className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                View Live Listing
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-gray-400 shadow-sm cursor-not-allowed"
                title="Only approved properties can be viewed on the live website"
              >
                Not Live Yet
              </button>
            )}
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

        {loading ? (
          <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-text-muted)] shadow-sm">
            Loading property editor...
          </div>
        ) : !property ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm">
            Property not found.
          </div>
        ) : (
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
                      name="property_type"
                      value={form.property_type}
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
                      name="parking_spaces"
                      type="number"
                      min="0"
                      value={form.parking_spaces}
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
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary-dark)]"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

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
                    If you upload new images here, the current gallery will be
                    replaced with the new selection. The first uploaded image
                    becomes the primary listing image.
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Property Image Gallery
                </h2>

                <div className="mt-5">
                  {existingImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {existingImages.map((img, index) => (
                        <div
                          key={`${img}-${index}`}
                          className="overflow-hidden rounded-2xl border border-[var(--color-border)]"
                        >
                          <img
                            src={img}
                            alt={`Property image ${index + 1}`}
                            className="h-36 w-full object-cover"
                          />
                          <div className="bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-main)]">
                            {index === 0 ? "Primary image" : `Image ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                      No image selected
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                      New images selected. Saving this form will replace the
                      current image gallery.
                    </div>
                  )}

                  <label className="mt-4 block text-sm font-semibold text-[var(--color-text-main)]">
                    Replace Image Gallery
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                  />

                  {selectedImages.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedImages.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                        >
                          <span className="truncate">
                            {index === 0 ? "Primary: " : ""}
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="font-semibold text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Property Video
                </h2>

                <div className="mt-5">
                  {existingVideo ? (
                    <video
                      controls
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-black"
                    >
                      <source src={existingVideo} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                      No video selected
                    </div>
                  )}

                  <label className="mt-4 block text-sm font-semibold text-[var(--color-text-main)]">
                    Replace Video
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
                    {saving ? "Saving Changes..." : "Save Property Changes"}
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
        )}
      </div>
    </main>
  );
}