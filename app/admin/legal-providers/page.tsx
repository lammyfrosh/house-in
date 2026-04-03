"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type LegalProvider = {
  id: number;
  name: string;
  logo_url: string;
  website?: string | null;
  created_at?: string;
};

type FormState = {
  name: string;
  website: string;
};

export default function AdminLegalProvidersPage() {
  const router = useRouter();
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [legalProviders, setLegalProviders] = useState<LegalProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    website: "",
  });

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    async function loadLegalProviders() {
      const token = localStorage.getItem("housein_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API}/api/partners/legal-providers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load legal providers");
        }

        setLegalProviders(data.legalProviders || []);
      } catch (error) {
        console.error(error);
        setMessage("Could not load legal service providers.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    loadLegalProviders();
  }, [API, router]);

  useEffect(() => {
    if (!selectedLogo) {
      setLogoPreview("");
      return;
    }

    const url = URL.createObjectURL(selectedLogo);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedLogo]);

  function resetForm() {
    setForm({
      name: "",
      website: "",
    });
    setSelectedLogo(null);
    setLogoPreview("");
    setEditingId(null);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedLogo(file);
  }

  function startEdit(item: LegalProvider) {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      website: item.website || "",
    });
    setSelectedLogo(null);
    setLogoPreview(item.logo_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    if (!form.name.trim()) {
      setMessage("Legal provider name is required.");
      setMessageType("error");
      return;
    }

    if (!editingId && !selectedLogo) {
      setMessage("Legal provider logo is required.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("website", form.website.trim());

      if (selectedLogo) {
        formData.append("logo", selectedLogo);
      }

      const url = editingId
        ? `${API}/api/partners/legal-providers/${editingId}`
        : `${API}/api/partners/legal-providers`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not save legal provider");
      }

      if (editingId && data.legalProvider) {
        setLegalProviders((prev) =>
          prev.map((item) => (item.id === editingId ? data.legalProvider : item))
        );
        setMessage("Legal provider updated successfully.");
      } else if (data.legalProvider) {
        setLegalProviders((prev) => [data.legalProvider, ...prev]);
        setMessage("Legal provider added successfully.");
      }

      setMessageType("success");
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not save legal provider"
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLegalProvider(item: LegalProvider) {
    const token = localStorage.getItem("housein_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${item.name}? This will remove the legal provider from the homepage.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(
        `${API}/api/partners/legal-providers/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete legal provider");
      }

      setLegalProviders((prev) => prev.filter((entry) => entry.id !== item.id));
      setMessage("Legal provider deleted successfully.");
      setMessageType("success");

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete legal provider"
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
            Legal Service Providers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Add, edit, and remove legal service providers that should appear on the home page.
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
              {editingId ? "Edit Legal Provider" : "Add Legal Provider"}
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
                Legal Provider Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="e.g. Aluko & Oyebode"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Website
              </label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] px-4 outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-main)]">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
              />
            </div>

            {logoPreview && (
              <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4">
                <img
                  src={logoPreview}
                  alt="Legal provider logo preview"
                  className="h-24 max-w-full object-contain"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus size={16} />
              {saving
                ? editingId
                  ? "Updating Legal Provider..."
                  : "Adding Legal Provider..."
                : editingId
                ? "Update Legal Provider"
                : "Add Legal Provider"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Existing Legal Providers
          </h2>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4 text-sm text-[var(--color-text-muted)]">
                Loading legal providers...
              </div>
            ) : legalProviders.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#f8fafc] p-4 text-sm text-[var(--color-text-muted)]">
                No legal providers added yet.
              </div>
            ) : (
              legalProviders.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[#fcfcfd] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white p-3">
                      <img
                        src={item.logo_url}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--color-text-main)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {item.website || "No website added"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLegalProvider(item)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 size={14} />
                      {deletingId === item.id ? "Deleting..." : "Delete"}
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