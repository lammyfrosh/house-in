"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";

type RegisteredUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("housein_token");
    const storedUser = localStorage.getItem("housein_user");

    if (!token || !storedUser) return;

    try {
      const user: RegisteredUser = JSON.parse(storedUser);
      const role = String(user?.role || "").toLowerCase().trim();

      if (role === "admin" || role === "superadmin" || role === "super_admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.removeItem("housein_token");
      localStorage.removeItem("housein_user");
    }
  }, [router]);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("housein_token", data.token);
      localStorage.setItem("housein_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not create account");
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
              House-In Registration
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Create your property account
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              Register as an external user to submit property listings, track
              approval status, and manage your own property activity from your
              dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <h2 className="text-lg font-semibold">Submit Properties</h2>
              <p className="mt-2 text-sm text-white/80">
                Upload your property details and media from your own account.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <h2 className="text-lg font-semibold">Track Approval</h2>
              <p className="mt-2 text-sm text-white/80">
                See whether your property is pending, approved, or rejected.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
                Register
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Fill in your details to get started.
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                  Full Name
                </label>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>

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

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-main)]">
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              Already have an account?{" "}
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