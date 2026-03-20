"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function verify() {
      try {
        const resolvedParams = await searchParams;
        const token = resolvedParams?.token;

        if (!token) {
          setStatus("error");
          setMessage("Verification token is missing.");
          return;
        }

        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

        const res = await fetch(
          `${apiBase}/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Verification failed."
        );
      }
    }

    verify();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
          House-In Verification
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
          Email Verification
        </h1>

        <p
          className={`mt-4 text-sm leading-6 ${
            status === "success"
              ? "text-green-700"
              : status === "error"
              ? "text-red-700"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          {message}
        </p>

        <div className="mt-6">
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}