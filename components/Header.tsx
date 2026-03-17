"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserCircle2, LogOut } from "lucide-react";

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function loadUser() {
      try {
        const storedUser = localStorage.getItem("housein_user");
        const storedToken = localStorage.getItem("housein_token");

        if (!storedUser || !storedToken) {
          setUser(null);
          return;
        }

        const parsedUser: StoredUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const normalizedRole = useMemo(() => {
    return String(user?.role || "").toLowerCase().trim();
  }, [user]);

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "super_admin";

  const dashboardHref = isAdmin ? "/admin" : "/dashboard";
  const addPropertyHref = "/add-property";

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    setUser(null);
    router.push("/");
  }

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/for-sale", label: "For Sale" },
    { href: "/for-rent", label: "For Rent" },
    { href: "/shortlet", label: "Shortlet" },
    { href: "/search", label: "Search" },
  ];

  const authedLinks = [
    { href: dashboardHref, label: "Dashboard" },
    { href: addPropertyHref, label: "Add Property" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[var(--color-text-main)]"
        >
          HOUSE-IN
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {publicLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-[var(--color-primary-dark)]"
                    : "text-[var(--color-text-main)] hover:text-[var(--color-primary-dark)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
              >
                Dashboard
              </Link>

              <Link
                href={addPropertyHref}
                className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Add Property
              </Link>

              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2">
                <UserCircle2 size={18} className="text-gray-500" />
                <span className="max-w-[140px] truncate text-sm font-medium text-[var(--color-text-main)]">
                  {user.full_name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="space-y-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-[var(--color-text-main)] transition hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {authedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-gray-50"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="rounded-xl border border-[var(--color-border)] px-3 py-3">
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">
                      {user.full_name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-xl border border-[var(--color-border)] px-3 py-3 text-left text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-xl bg-[var(--color-primary-dark)] px-3 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Sign Up
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