"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserCircle2, LogOut, PlusCircle } from "lucide-react";

type StoredUser = {
  id: number | string;
  full_name: string;
  email: string;
  role: string;
};

function parseJsonSafely(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeUser(candidate: any): StoredUser | null {
  if (!candidate || typeof candidate !== "object") return null;

  const id =
    candidate.id ??
    candidate.user_id ??
    candidate.userId ??
    candidate._id ??
    "";

  const full_name =
    candidate.full_name ??
    candidate.fullName ??
    candidate.name ??
    candidate.username ??
    "";

  const email = candidate.email ?? "";
  const role = candidate.role ?? candidate.user_role ?? "user";

  if (!id && !full_name && !email) return null;

  return {
    id,
    full_name: String(full_name || "").trim(),
    email: String(email || "").trim(),
    role: String(role || "user").trim(),
  };
}

function getStoredAuthUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const possibleUserKeys = [
    "housein_user",
    "user",
    "auth_user",
    "currentUser",
    "house_in_user",
  ];

  const possibleTokenKeys = [
    "housein_token",
    "token",
    "auth_token",
    "accessToken",
    "house_in_token",
  ];

  const token = possibleTokenKeys
    .map((key) => localStorage.getItem(key))
    .find(Boolean);

  if (!token) return null;

  for (const key of possibleUserKeys) {
    const raw = localStorage.getItem(key);
    const parsed = parseJsonSafely(raw);

    const normalizedDirect = normalizeUser(parsed);
    if (normalizedDirect) return normalizedDirect;

    const normalizedNested =
      normalizeUser(parsed?.user) ||
      normalizeUser(parsed?.data?.user) ||
      normalizeUser(parsed?.data);

    if (normalizedNested) return normalizedNested;
  }

  return null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function loadUser() {
      const resolvedUser = getStoredAuthUser();
      setUser(resolvedUser);
    }

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("housein-auth-changed", loadUser as EventListener);
    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener(
        "housein-auth-changed",
        loadUser as EventListener
      );
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUser(getStoredAuthUser());
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

  const shortName = useMemo(() => {
    const rawName =
      user?.full_name?.trim() ||
      user?.email?.trim()?.split("@")[0] ||
      "Account";

    const first = rawName.split(" ")[0]?.trim();
    return first || "Account";
  }, [user]);

  function handleLogout() {
    const keysToRemove = [
      "housein_token",
      "token",
      "auth_token",
      "accessToken",
      "house_in_token",
      "housein_user",
      "user",
      "auth_user",
      "currentUser",
      "house_in_user",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="House-In Home"
        >
          <Image
            src="/logo-light.png"
            alt="House-In"
            width={190}
            height={56}
            className="h-auto w-[150px] object-contain sm:w-[170px] lg:w-[190px]"
            priority
          />
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

        <div className="hidden items-center gap-3 md:flex md:shrink-0">
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
                className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{ color: "#0f172a" }}
              >
                <PlusCircle size={16} />
                <span style={{ color: "#0f172a" }}>Add Property</span>
              </Link>

              <Link
                href={dashboardHref}
                className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                style={{ color: "#ffffff" }}
                title={user.full_name || user.email || "My Account"}
              >
                <UserCircle2 size={17} className="text-white/80" />
                <span
                  className="max-w-[120px] truncate"
                  style={{ color: "#ffffff" }}
                >
                  {shortName}
                </span>
              </Link>

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
                className="inline-flex min-w-[118px] items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-bold transition hover:opacity-90"
                style={{ color: "#0f172a" }}
              >
                <span style={{ color: "#0f172a" }}>Sign Up</span>
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
              <Image
                src="/logo-light.png"
                alt="House-In"
                width={170}
                height={50}
                className="h-auto w-[150px] object-contain"
                priority
              />
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
                    className="block rounded-xl bg-white px-3 py-3 text-sm font-semibold transition hover:opacity-90"
                    style={{ color: "#0f172a" }}
                  >
                    Add Property
                  </Link>

                  <div className="rounded-xl border border-white/20 px-3 py-3">
                    <p className="text-sm font-semibold text-white">
                      {user.full_name || shortName}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      {user.email || "Logged in user"}
                    </p>
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
                    className="block rounded-xl bg-white px-3 py-3 text-sm font-semibold transition hover:opacity-90"
                    style={{ color: "#0f172a" }}
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