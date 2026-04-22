"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not process request");
      }

      setSuccessMessage(
        data.message ||
          "If an account exists for this email, a reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not process forgot password request"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-[var(--color-primary-dark)] px-10 py-12 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
              <ShieldCheck size={14} />
              Account Recovery
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Reset your password securely
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              Enter the email address linked to your House-In account and we
              will send you a secure password reset link.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
                Forgot Password
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
                Recover access
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                We will email you a password reset link if your account exists.
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                  Email Address
                </label>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending reset link..." : "Send Reset Link"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="font-semibold text-[var(--color-primary-dark)] hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}