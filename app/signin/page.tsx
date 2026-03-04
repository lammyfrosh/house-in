import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
          Sign In
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Access your account to manage listings and requests.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <form className="space-y-4">
            <div>
              <label className="text-xs font-extrabold tracking-widest uppercase text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold tracking-widest uppercase text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
              />
            </div>

            <button
              type="button"
              className="h-11 w-full rounded-xl bg-[var(--color-primary-dark)] text-xs font-extrabold tracking-widest uppercase text-white hover:opacity-90"
            >
              Sign In
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-[var(--color-primary-dark)] hover:underline"
              >
                Forgot password?
              </Link>

              <Link
                href="/register"
                className="text-[var(--color-primary-dark)] hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-4 text-xs text-[var(--color-text-muted)]">
          Demo mode: Authentication will be connected after UI sign-off.
        </p>
      </div>
    </main>
  );
}