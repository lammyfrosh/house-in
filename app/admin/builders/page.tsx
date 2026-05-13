"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type IndustryUpdate = {
  id: number;
  category: "builder" | "legal";
  title: string;
  description?: string | null;
  image_url?: string | null;
  source_url: string;
  source_name?: string | null;
  status?: "draft" | "published";
  created_at?: string;
  updated_at?: string;
};

type FormState = {
  title: string;
  description: string;
  image_url: string;
  source_url: string;
  source_name: string;
  status: "draft" | "published";
};

const CATEGORY = "builder" as const;
const PAGE_TITLE = "Manage Builder Updates";
const ADD_TITLE = "Add Builder Update";
const EDIT_TITLE = "Edit Builder Update";
const EMPTY_TEXT = "No builder updates added yet.";
const LOAD_ERROR = "Could not load builder updates.";
const SAVE_ERROR = "Could not save builder update.";

const emptyForm: FormState = {
  title: "",
  description: "",
  image_url: "",
  source_url: "",
  source_name: "",
  status: "published",
};

function formatDate(value?: string) {
  if (!value) return "Recently added";

  try {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Recently added";
  }
}

export default function AdminBuildersPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [updates, setUpdates] = useState<IndustryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    async function loadUpdates() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(
          `${API}/api/industry-updates?category=${CATEGORY}&limit=50&includeDrafts=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || LOAD_ERROR);
        }

        setUpdates(data.updates || []);
      } catch (error) {
        console.error(error);
        setMessage(LOAD_ERROR);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    loadUpdates();
  }, [API, router]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function startEdit(update: IndustryUpdate) {
    setEditingId(update.id);

    setForm({
      title: update.title || "",
      description: update.description || "",
      image_url: update.image_url || "",
      source_url: update.source_url || "",
      source_name: update.source_name || "",
      status: update.status === "draft" ? "draft" : "published",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generatePreview() {
    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (!form.source_url.trim()) {
      setMessage("Paste the article link first.");
      setMessageType("error");
      return;
    }

    setGeneratingPreview(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(`${API}/api/industry-updates/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: form.source_url.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not generate preview");
      }

      const preview = data.preview || {};

      setForm((prev) => ({
        ...prev,
        title: preview.title || prev.title,
        description: preview.description || prev.description,
        image_url: preview.image_url || prev.image_url,
        source_url: preview.source_url || prev.source_url,
        source_name: preview.source_name || prev.source_name,
      }));

      setMessage("Preview generated successfully. You can edit before saving.");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not generate preview"
      );
      setMessageType("error");
    } finally {
      setGeneratingPreview(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (!form.source_url.trim()) {
      setMessage("Article link is required.");
      setMessageType("error");
      return;
    }

    if (!form.title.trim()) {
      setMessage("Article title is required. Generate preview or type it manually.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        category: CATEGORY,
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim(),
        source_url: form.source_url.trim(),
        source_name: form.source_name.trim(),
        status: form.status,
      };

      const url = editingId
        ? `${API}/api/industry-updates/${editingId}`
        : `${API}/api/industry-updates`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || SAVE_ERROR);
      }

      if (editingId && data.update) {
        setUpdates((prev) =>
          prev.map((item) => (item.id === editingId ? data.update : item))
        );
        setMessage("Update saved successfully.");
      } else if (data.update) {
        setUpdates((prev) => [data.update, ...prev]);
        setMessage("Update added successfully.");
      }

      setMessageType("success");
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : SAVE_ERROR);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUpdate(update: IndustryUpdate) {
    const token = localStorage.getItem("housein_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${update.title}"? This will remove the update from the homepage.`
    );

    if (!confirmed) return;

    setDeletingId(update.id);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(`${API}/api/industry-updates/${update.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete update");
      }

      setUpdates((prev) => prev.filter((item) => item.id !== update.id));
      setMessage("Update deleted successfully.");
      setMessageType("success");

      if (editingId === update.id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete update"
      );
      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
            Home Page Content
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
            {PAGE_TITLE}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Paste an article link, generate a WhatsApp-style preview, review it,
            then publish it to the home page.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
        >
          Back to Admin Dashboard
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

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
              {editingId ? EDIT_TITLE : ADD_TITLE}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
              >
                <X size={14} />
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Article Link
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  name="source_url"
                  value={form.source_url}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  placeholder="https://example.com/original-article"
                />

                <button
                  type="button"
                  onClick={generatePreview}
                  disabled={generatingPreview}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {generatingPreview ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  {generatingPreview ? "Generating..." : "Generate Preview"}
                </button>
              </div>
            </div>

            {form.image_url || form.title || form.description ? (
              <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[#f8fafc]">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Preview thumbnail"
                    className="h-52 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
                    {form.source_name || "Preview"}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[var(--color-text-main)]">
                    {form.title || "Article title will appear here"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {form.description || "Article description will appear here."}
                  </p>
                </div>
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Article Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Generated automatically, but editable"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Source Name
              </label>
              <input
                name="source_name"
                value={form.source_name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Generated automatically, but editable"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Image URL
              </label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Generated automatically, but editable"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Short Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Generated automatically, but editable"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus size={16} />
              {saving
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update"
                : "Publish Update"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Existing Updates
          </h2>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4 text-sm text-[var(--color-text-muted)]">
                Loading updates...
              </div>
            ) : updates.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4 text-sm text-[var(--color-text-muted)]">
                {EMPTY_TEXT}
              </div>
            ) : (
              updates.map((update) => (
                <div
                  key={update.id}
                  className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#fcfcfd]"
                >
                  <div className="grid gap-4 p-4 sm:grid-cols-[150px_1fr]">
                    <div className="h-32 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                      {update.image_url ? (
                        <img
                          src={update.image_url}
                          alt={update.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-[var(--color-text-muted)]">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            update.status === "draft"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {update.status || "published"}
                        </span>

                        <span className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(update.created_at)}
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-[var(--color-text-main)]">
                        {update.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                        {update.description || "No description added"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <span>{update.source_name || "No source name"}</span>

                        <a
                          href={update.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary-dark)] hover:underline"
                        >
                          Open article
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--color-border)] bg-white px-4 py-3">
                    <button
                      onClick={() => startEdit(update)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUpdate(update)}
                      disabled={deletingId === update.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 size={14} />
                      {deletingId === update.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}