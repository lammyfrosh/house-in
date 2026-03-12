"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("housein_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("housein_token", data.token);
      localStorage.setItem("housein_user", JSON.stringify(data.user));

      setMessage("Login successful. Redirecting...");
      setLoading(false);

      router.push("/admin");
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("Could not connect to backend");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
          Admin Access
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-text-main)]">
          Sign In
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Admin and super admin access for managing listings and platform operations.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Email
              </label>

              <input
                type="email"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                Password
              </label>

              <input
                type="password"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {message && (
              <div
                className={`rounded-xl px-3 py-3 text-sm ${
                  message.toLowerCase().includes("successful")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-[var(--color-primary-dark)] text-sm font-bold uppercase text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-sm text-[var(--color-text-muted)]">
              Back to{" "}
              <Link
                href="/"
                className="font-semibold text-[var(--color-primary-dark)] underline"
              >
                Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}