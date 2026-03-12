"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function loadUser() {
      try {
        const storedUser = localStorage.getItem("housein_user");
        const storedToken = localStorage.getItem("housein_token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    setUser(null);
    setMobileOpen(false);
    router.push("/signin");
    router.refresh();
  }

  function formatRole(role?: string) {
    const normalized = String(role || "").toLowerCase().trim();

    if (normalized === "super_admin" || normalized === "superadmin") {
      return "Super Admin";
    }

    if (normalized === "admin") {
      return "Admin";
    }

    return "User";
  }

  return (
    <header className="bg-[var(--color-primary-dark)] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight">
          House-In
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-extrabold uppercase tracking-widest lg:flex">
          <Link href="/for-sale" className="hover:opacity-90">
            For Sale
          </Link>
          <Link href="/for-rent" className="hover:opacity-90">
            For Rent
          </Link>
          <Link href="/shortlet" className="hover:opacity-90">
            Shortlet
          </Link>
          <Link href="/requests" className="hover:opacity-90">
            Requests
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-right">
                <p className="text-xs font-bold text-white">
                  {user.full_name}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                  {formatRole(user.role)}
                </p>
              </div>

              <Link
                href="/admin"
                className="rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Dashboard
              </Link>

              <Link
                href="/add-property"
                className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)] hover:opacity-90"
              >
                Add Property
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Register
              </Link>

              <Link
                href="/signin"
                className="rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Sign In
              </Link>

              <Link
                href="/add-property"
                className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)] hover:opacity-90"
              >
                Add Property
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex rounded-xl border border-white/30 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white lg:hidden"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/20 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            {user ? (
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-sm font-bold text-white">{user.full_name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                  {formatRole(user.role)}
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 text-sm font-bold">
              <Link
                href="/for-sale"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-center hover:bg-white/10"
              >
                For Sale
              </Link>

              <Link
                href="/for-rent"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-center hover:bg-white/10"
              >
                For Rent
              </Link>

              <Link
                href="/shortlet"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-center hover:bg-white/10"
              >
                Shortlet
              </Link>

              <Link
                href="/requests"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-center hover:bg-white/10"
              >
                Requests
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-white/30 px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest hover:bg-white/10"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-property"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)] hover:opacity-90"
                  >
                    Add Property
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-white/30 px-4 py-3 text-sm font-extrabold uppercase tracking-widest hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-white/30 px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest hover:bg-white/10"
                  >
                    Register
                  </Link>

                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-white/30 px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest hover:bg-white/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/add-property"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)] hover:opacity-90"
                  >
                    Add Property
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}