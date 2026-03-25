"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserCircle2, LogOut, PlusCircle } from "lucide-react";

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
    window.addEventListener("housein-auth-changed", loadUser as EventListener);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener(
        "housein-auth-changed",
        loadUser as EventListener
      );
    };
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

  const roleLabel =
    normalizedRole === "superadmin" || normalizedRole === "super_admin"
      ? "Super Admin"
      : normalizedRole === "admin"
      ? "Admin"
      : "User";

  const shortName = user?.full_name?.trim()
    ? user.full_name.trim().split(" ")[0]
    : roleLabel;

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    window.dispatchEvent(new Event("housein-auth-changed"));
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-primary-dark)] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-white"
          aria-label="House-In Home"
        >
          <div className="relative h-11 w-[170px] sm:h-12 sm:w-[200px]">
            <Image
              src="/logo-light.png"
              alt="House-In"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {publicLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active ? "text-white" : "text-white/80 hover:text-white"
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
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Dashboard
              </Link>

              <Link
                href={addPropertyHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
              >
                <PlusCircle size={16} />
                Add Property
              </Link>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white">
                <UserCircle2 size={17} className="text-white/80" />
                <span>{shortName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-white/20 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--color-primary-dark)] md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-4">
              <div className="relative h-10 w-[170px]">
                <Image
                  src="/logo-light.png"
                  alt="House-In"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href={addPropertyHref}
                    className="block rounded-xl bg-white px-3 py-3 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
                  >
                    Add Property
                  </Link>

                  <div className="rounded-xl border border-white/20 px-3 py-3">
                    <p className="text-sm font-semibold text-white">{shortName}</p>
                    <p className="mt-1 text-xs text-white/70">{user.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-xl border border-white/20 px-3 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="block rounded-xl bg-white px-3 py-3 text-sm font-semibold text-[#0f766e] transition hover:opacity-90"
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