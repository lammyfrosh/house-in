import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fcfcfc] px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[var(--color-text-main)]">
          404
        </h1>

        <p className="mt-3 text-lg font-semibold text-[var(--color-text-main)]">
          Page Not Found
        </p>

        <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
          The page you are looking for may have been moved, deleted, or the link
          may be incorrect.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white"
          >
            Go Home
          </Link>

          <Link
            href="/search"
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </main>
  );
}