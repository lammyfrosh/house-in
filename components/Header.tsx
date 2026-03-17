"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    setUser(null);
    router.push("/signin");
  }

  const navLinks = [
    { href: "/for-sale", label: "For Sale" },
    { href: "/for-rent", label: "For Rent" },
    { href: "/shortlet", label: "Shortlet" },
  ];

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-teal-700 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight transition hover:opacity-90"
        >
          House-In
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/admin"
                className="rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Dashboard
              </Link>

              <Link
                href="/add-property"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-white/90"
              >
                Add Property
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/90 transition hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-white/90 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/add-property"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-white/90"
              >
                Add Property
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white lg:hidden"
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-teal-700 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-3">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-property"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700"
                  >
                    Add Property
                  </Link>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-sm font-medium text-white/90 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-white/90 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/add-property"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700"
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