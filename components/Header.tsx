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

  useEffect(() => {
    const storedUser = localStorage.getItem("housein_user");
    const storedToken = localStorage.getItem("housein_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    router.push("/signin");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-primary-dark)] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          House-In
        </Link>

        <nav className="hidden gap-6 text-sm font-semibold lg:flex">
          <Link href="/for-sale">For Sale</Link>
          <Link href="/for-rent">For Rent</Link>
          <Link href="/shortlet">Shortlet</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/admin"
                className="rounded-lg border border-white/30 px-3 py-2 text-xs"
              >
                Dashboard
              </Link>

              <Link
                href="/add-property"
                className="rounded-lg bg-white px-3 py-2 text-xs text-[var(--color-primary-dark)]"
              >
                Add Property
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs opacity-80 hover:opacity-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-sm">
                Sign In
              </Link>

              <Link
                href="/add-property"
                className="rounded-lg bg-white px-3 py-2 text-xs text-[var(--color-primary-dark)]"
              >
                Add Property
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}