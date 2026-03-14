"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AddPropertyPage() {
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("rent");
  const [propertyType, setPropertyType] = useState("apartment");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [toilets, setToilets] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [size, setSize] = useState("");
  const [stateName, setStateName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
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
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
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
        setMessage("Could not connect to backend");
        setMessageType("error");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [API_BASE_URL, router]);

  function resetForm() {
    setTitle("");
    setPurpose("rent");
    setPropertyType("apartment");
    setPrice("");
    setBedrooms("");
    setBathrooms("");
    setToilets("");
    setParkingSpaces("");
    setSize("");
    setStateName("");
    setArea("");
    setCity("");
    setDescription("");
    setFeatured(false);
    setMainImageFile(null);
    setGalleryFiles([]);
    setVideoFile(null);

    const imageInput = document.getElementById("image") as HTMLInputElement | null;
    const imagesInput = document.getElementById("images") as HTMLInputElement | null;
    const videoInput = document.getElementById("video") as HTMLInputElement | null;

    if (imageInput) imageInput.value = "";
    if (imagesInput) imagesInput.value = "";
    if (videoInput) videoInput.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (
      !title.trim() ||
      !purpose.trim() ||
      !propertyType.trim() ||
      !price.trim() ||
      !stateName.trim() ||
      !area.trim() ||
      !city.trim()
    ) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    if (!mainImageFile && galleryFiles.length === 0) {
      setMessage("Please upload at least one property image.");
      setMessageType("error");
      return;
    }

    if (videoFile && videoFile.size > 50 * 1024 * 1024) {
      setMessage("Video file must not be more than 50MB.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("purpose", purpose);
      formData.append("propertyType", propertyType);
      formData.append("price", price);
      formData.append("bedrooms", bedrooms || "0");
      formData.append("bathrooms", bathrooms || "0");
      formData.append("toilets", toilets || "0");
      formData.append("parkingSpaces", parkingSpaces || "0");
      formData.append("size", size.trim());
      formData.append("state", stateName.trim());
      formData.append("area", area.trim());
      formData.append("city", city.trim());
      formData.append("description", description.trim());
      formData.append("featured", String(featured));

      if (mainImageFile) {
        formData.append("image", mainImageFile);
      }

      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (videoFile) {
        formData.append("video", videoFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not create property.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      setMessage("Property created successfully.");
      setMessageType("success");
      resetForm();
      setLoading(false);

      setTimeout(() => {
        router.push("/admin/properties");
      }, 1200);
    } catch (error) {
      console.error("Create property error:", error);
      setMessage("Could not connect to backend");
      setMessageType("error");
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-600">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            Add Property
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Create a new property listing with multiple images and optional short video.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-main)]">
          {user ? `Signed in as ${user.full_name}` : "Admin session"}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Luxury 4 Bedroom Duplex"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Purpose *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="shortlet">Shortlet</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Property Type *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              >
                <option value="apartment">Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
                <option value="terrace">Terrace</option>
                <option value="detached-house">Detached House</option>
                <option value="semi-detached-house">Semi-Detached House</option>
                <option value="land">Land</option>
                <option value="office-space">Office Space</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Price *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="250000000"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="4"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="5"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Toilets
              </label>
              <input
                type="number"
                min="0"
                value={toilets}
                onChange={(e) => setToilets(e.target.value)}
                placeholder="5"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Parking Spaces
              </label>
              <input
                type="number"
                min="0"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(e.target.value)}
                placeholder="3"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Size
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="650 sqm"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-main)]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured Property
              </label>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                State *
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Lagos"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Area *
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Lekki Phase 1"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lagos"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]"
              >
                Main Property Image
              </label>
              <input
                id="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setMainImageFile(file);
                }}
                className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
              />
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Optional if you upload gallery images below. The first available image becomes the main image.
              </p>
            </div>

            <div>
              <label
                htmlFor="images"
                className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]"
              >
                Gallery Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setGalleryFiles(files);
                }}
                className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
              />
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Upload multiple property pictures here.
              </p>
            </div>

            <div>
              <label
                htmlFor="video"
                className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]"
              >
                Short Video
              </label>
              <input
                id="video"
                type="file"
                accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setVideoFile(file);
                }}
                className="mt-2 block w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
              />
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Optional. Maximum file size: 50MB.
              </p>
            </div>
          </div>

          {(mainImageFile || galleryFiles.length > 0 || videoFile) && (
            <div className="rounded-xl border border-[var(--color-border)] bg-gray-50 p-4">
              <p className="text-sm font-semibold text-[var(--color-text-main)]">
                Selected media
              </p>

              <div className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                {mainImageFile && <p>Main image: {mainImageFile.name}</p>}
                {galleryFiles.length > 0 && (
                  <p>Gallery images selected: {galleryFiles.length}</p>
                )}
                {videoFile && <p>Video: {videoFile.name}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
              Description
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a clear and attractive property description..."
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-3 py-3 outline-none focus:border-[var(--color-primary-dark)]"
            />
          </div>

          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-[var(--color-primary-dark)] px-6 text-sm font-bold uppercase text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Create Property"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="h-11 rounded-xl border border-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
            >
              Back to Admin
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
