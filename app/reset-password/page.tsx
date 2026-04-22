"use client";

import { Suspense, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

function ResetPasswordContent() {
  const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("This reset link is invalid or missing.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not reset password");
      }

      setSuccessMessage(
        data.message || "Password reset successful. You can now sign in."
      );
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/signin");
      }, 1600);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Could not reset password"
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
              Password Reset
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Set a fresh password for your account
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              Choose a strong new password to regain secure access to your
              House-In account.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
                Reset Password
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
                Create a new password
              </h2>
            </div>

            {!token && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This reset link is missing a valid token. Please request a new
                password reset email.
              </div>
            )}

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
                  New Password
                </label>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-500 transition hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                  Confirm New Password
                </label>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your new password"
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-500 transition hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Resetting password..." : "Reset Password"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              Back to{" "}
              <Link
                href="/signin"
                className="font-semibold text-[var(--color-primary-dark)] hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f6f8fb] flex items-center justify-center">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-6 py-4 text-sm text-[var(--color-text-muted)] shadow-sm">
            Loading reset page...
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}