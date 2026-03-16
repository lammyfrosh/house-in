"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("housein_token");
    localStorage.removeItem("housein_user");
    router.push("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text-main)]">
          House-In Admin
        </h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div>{children}</div>
    </div>
  );
}