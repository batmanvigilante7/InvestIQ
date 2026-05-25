"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("folioai_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored).email);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("folioai_user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green font-bold text-slate-950">
            F
          </div>
          <span className="text-lg font-semibold text-white">FolioAI</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`text-sm transition-colors ${
              pathname === "/dashboard"
                ? "text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-400 sm:inline">
                {user}
              </span>
              <button
                onClick={handleLogout}
                className="h-8 w-8 rounded-full bg-brand-green text-xs font-bold text-slate-950"
                title="Logout"
              >
                {user.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-green px-4 py-1.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
