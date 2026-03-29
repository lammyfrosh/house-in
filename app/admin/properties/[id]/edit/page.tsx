"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Scissors } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type PropertyStatus = "pending" | "approved" | "rejected";

type GalleryImageRecord = {
  id: number;
  image_url: string;
};

type Property = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  price_on_request?: number | boolean;
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
  gallery_images?: string[];
  gallery_image_records?: GalleryImageRecord[];
};

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
  featured: boolean;
  status: PropertyStatus;
};

function isPriceOnRequest(value: unknown) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    String(value).toLowerCase() === "true"
  );
}

function getExtension(filename: string) {
  const match = filename.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : ".mp4";
}

export default function AdminEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);

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
    featured: false,
    status: "approved",
  });

  const [existingGalleryImages, setExistingGalleryImages] = useState<
    GalleryImageRecord[]
  >([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState("");

  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [trimStart, setTrimStart] = useState("0");
  const [trimEnd, setTrimEnd] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [loadingCurrentVideo, setLoadingCurrentVideo] = useState(false);
  const [trimmingVideo, setTrimmingVideo] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    async function loadProperty() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API}/api/properties/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load property");
        }

        const p: Property = data.property;
        setProperty(p);

        setForm({
          title: p.title || "",
          purpose: p.purpose || "rent",
          propertyType: p.property_type || "",
          price: String(p.price ?? ""),
          priceOnRequest: isPriceOnRequest(p.price_on_request),
          bedrooms: String(p.bedrooms ?? ""),
          bathrooms: String(p.bathrooms ?? ""),
          toilets: String(p.toilets ?? ""),
          parkingSpaces: String(p.parking_spaces ?? ""),
          size: p.size || "",
          state: p.state || "",
          area: p.area || "",
          city: p.city || "",
          description: p.description || "",
          featured: Boolean(p.featured),
          status: p.status || "approved",
        });

        if (p.gallery_image_records && p.gallery_image_records.length > 0) {
          setExistingGalleryImages(p.gallery_image_records);
        } else if (p.gallery_images && p.gallery_images.length > 0) {
          setExistingGalleryImages(
            p.gallery_images.map((imageUrl, index) => ({
              id: -(index + 1),
              image_url: imageUrl,
            }))
          );
        } else if (p.image_url) {
          setExistingGalleryImages([{ id: -1, image_url: p.image_url }]);
        } else {
          setExistingGalleryImages([]);
        }
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

    if (id) {
      loadProperty();
    }
  }, [API, id, router]);

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

  useEffect(() => {
    if (videoDuration > 0 && !trimEnd) {
      setTrimEnd(String(Math.floor(videoDuration)));
    }
  }, [videoDuration, trimEnd]);

  const existingImage = useMemo(() => property?.image_url || "", [property]);

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

  function removeSelectedImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedVideo(file);
    setTrimStart("0");
    setTrimEnd("");
    setVideoDuration(0);
  }

  async function deleteExistingImage(imageId: number) {
    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    if (imageId < 0) {
      setMessage("Please save the property once before deleting fallback images.");
      setMessageType("error");
      return;
    }

    setDeletingImageId(imageId);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(`${API}/api/properties/${id}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete image");
      }

      const updatedProperty: Property = data.property;
      setProperty(updatedProperty);

      if (
        updatedProperty.gallery_image_records &&
        updatedProperty.gallery_image_records.length > 0
      ) {
        setExistingGalleryImages(updatedProperty.gallery_image_records);
      } else if (
        updatedProperty.gallery_images &&
        updatedProperty.gallery_images.length > 0
      ) {
        setExistingGalleryImages(
          updatedProperty.gallery_images.map((imageUrl, index) => ({
            id: -(index + 1),
            image_url: imageUrl,
          }))
        );
      } else {
        setExistingGalleryImages([]);
      }

      setMessage("Image deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete image"
      );
      setMessageType("error");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function loadFfmpeg() {
    if (ffmpegRef.current) return ffmpegRef.current;

    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = new FFmpeg();

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    ffmpegRef.current = ffmpeg;
    setFfmpegReady(true);
    return ffmpeg;
  }

  async function loadCurrentVideoIntoEditor() {
    if (!property?.video_url) {
      setMessage("No existing property video found.");
      setMessageType("error");
      return;
    }

    setLoadingCurrentVideo(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(property.video_url);
      if (!response.ok) {
        throw new Error("Could not load the current property video.");
      }

      const blob = await response.blob();
      const ext = getExtension(property.video_url);
      const file = new File([blob], `current-property-video${ext}`, {
        type: blob.type || "video/mp4",
      });

      setSelectedVideo(file);
      setTrimStart("0");
      setTrimEnd("");
      setVideoDuration(0);
      setMessage("Current property video loaded. You can trim it now.");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load the current property video"
      );
      setMessageType("error");
    } finally {
      setLoadingCurrentVideo(false);
    }
  }

  async function trimSelectedVideo() {
    if (!selectedVideo) {
      setMessage("Please select or load a video first before trimming.");
      setMessageType("error");
      return;
    }

    const start = Number(trimStart);
    const end = Number(trimEnd);

    if (Number.isNaN(start) || Number.isNaN(end)) {
      setMessage("Trim start and end must be valid numbers.");
      setMessageType("error");
      return;
    }

    if (start < 0 || end <= start) {
      setMessage("Trim end must be greater than trim start.");
      setMessageType("error");
      return;
    }

    if (videoDuration > 0 && end > videoDuration) {
      setMessage("Trim end cannot be greater than the video duration.");
      setMessageType("error");
      return;
    }

    setTrimmingVideo(true);
    setMessage("");
    setMessageType("");

    try {
      const ffmpeg = await loadFfmpeg();

      const inputExt = getExtension(selectedVideo.name);
      const inputName = `input${inputExt}`;
      const outputName = `trimmed${inputExt}`;

      await ffmpeg.writeFile(inputName, await fetchFile(selectedVideo));
      await ffmpeg.exec([
        "-ss",
        String(start),
        "-to",
        String(end),
        "-i",
        inputName,
        "-c",
        "copy",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);

      if (typeof data === "string") {
        throw new Error("Unexpected text output while trimming video.");
      }

      const outputBytes = data as unknown as Uint8Array;
      const copiedBytes = new Uint8Array(outputBytes);

      const trimmedBlob = new Blob([copiedBytes], {
        type: selectedVideo.type || "video/mp4",
      });

      const trimmedFile = new File(
        [trimmedBlob],
        `trimmed-${selectedVideo.name.replace(/\.[^.]+$/, "")}${inputExt}`,
        {
          type: selectedVideo.type || "video/mp4",
        }
      );

      setSelectedVideo(trimmedFile);
      setMessage("Video trimmed successfully. Save changes to upload it.");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage("Video trimming failed. Please try a shorter clip.");
      setMessageType("error");
    } finally {
      setTrimmingVideo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    if (!form.priceOnRequest && !form.price.trim()) {
      setMessage("Please enter a price or turn on Call for Price.");
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
      formData.append("featured", String(form.featured));
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

      const res = await fetch(`${API}/api/properties/${id}`, {
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

      setMessage("Property updated successfully.");
      setMessageType("success");

      setTimeout(() => {
        router.push("/admin/properties");
      }, 1000);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--color-text-muted)]">
              Loading property...
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
              Admin Property Editor
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
              Edit Property
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Update property details, replace media, trim the video, and manage listing status.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/properties")}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
          >
            Back to Manage Properties
          </button>
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
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
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
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] px-4 py-3 text-sm text-[var(--color-text-main)]">
                    <input
                      type="checkbox"
                      name="priceOnRequest"
                      checked={form.priceOnRequest}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    Hide public price and show “Call for Price” instead
                  </label>
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
                  />
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
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Location
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Area / LGA
                  </label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
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
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Description
              </h2>

              <div className="mt-5">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Listing Controls
              </h2>

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] px-4 py-3 text-sm text-[var(--color-text-main)]">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Mark as featured
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Existing Images
              </h2>

              {existingGalleryImages.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  No existing gallery images found.
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {existingGalleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8fafc]"
                    >
                      <img
                        src={image.image_url}
                        alt={`Existing image ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => deleteExistingImage(image.id)}
                        disabled={deletingImageId === image.id}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-sm transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label={`Delete existing image ${index + 1}`}
                      >
                        <X size={14} />
                      </button>

                      <div className="bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-main)]">
                        {index === 0 ? "Current primary image" : `Existing image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                Upload New Images
              </h2>

              {existingImage && selectedImages.length === 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-[var(--color-text-main)]">
                    Current Main Image
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8fafc]">
                    <img
                      src={existingImage}
                      alt="Current property"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="block w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
                />
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Upload one or multiple images. You can remove any selected one individually before saving.
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {imagePreviews.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8fafc]"
                      >
                        <img
                          src={src}
                          alt={`Selected image ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-sm transition hover:bg-black/80"
                          aria-label={`Remove selected image ${index + 1}`}
                        >
                          <X size={14} />
                        </button>

                        <div className="bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-main)]">
                          {index === 0 ? "Primary new image" : `New image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Video
                </h2>

                {property?.video_url && !selectedVideo && (
                  <button
                    type="button"
                    onClick={loadCurrentVideoIntoEditor}
                    disabled={loadingCurrentVideo}
                    className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingCurrentVideo ? "Loading..." : "Load Current Video"}
                  </button>
                )}
              </div>

              {property?.video_url && !videoPreview && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black">
                  <video
                    controls
                    className="w-full"
                    onLoadedMetadata={(e) =>
                      setVideoDuration(e.currentTarget.duration || 0)
                    }
                  >
                    <source src={property.video_url} />
                  </video>
                </div>
              )}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                  Upload New Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="block w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
                />
              </div>

              {videoPreview && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black">
                  <video
                    controls
                    className="w-full"
                    onLoadedMetadata={(e) =>
                      setVideoDuration(e.currentTarget.duration || 0)
                    }
                  >
                    <source src={videoPreview} />
                  </video>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4">
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-[var(--color-primary-dark)]" />
                  <h3 className="text-sm font-semibold text-[var(--color-text-main)]">
                    Trim Video Before Saving
                  </h3>
                </div>

                <p className="mt-2 text-xs leading-6 text-[var(--color-text-muted)]">
                  Select or load a video first, choose the start and end time in seconds,
                  then trim it. After trimming, click Save Changes to upload the trimmed version.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[var(--color-text-main)]">
                      Start Time (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={trimStart}
                      onChange={(e) => setTrimStart(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[var(--color-text-main)]">
                      End Time (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-[var(--color-text-muted)]">
                  {videoDuration > 0
                    ? `Detected video duration: ${videoDuration.toFixed(1)} seconds`
                    : "Video duration will appear after the video loads."}
                </div>

                <button
                  type="button"
                  onClick={trimSelectedVideo}
                  disabled={trimmingVideo}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {trimmingVideo
                    ? ffmpegReady
                      ? "Trimming Video..."
                      : "Preparing Trimmer..."
                    : "Trim Selected Video"}
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}