"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
          Sign In
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Super admin access for managing listings and admins.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest">
                Email
              </label>

              <input
                type="email"
                className="mt-2 h-11 w-full rounded-xl border px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest">
                Password
              </label>

              <input
                type="password"
                className="mt-2 h-11 w-full rounded-xl border px-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-[var(--color-primary-dark)] text-white font-bold uppercase text-sm"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-sm">
              Back to{" "}
              <Link
                href="/"
                className="text-[var(--color-primary-dark)] underline"
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