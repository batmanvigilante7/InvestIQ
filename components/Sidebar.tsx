"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Sidebar() {
  const pathname = usePathname();
  const theses = useStore((s) => s.theses);
  const signals = useStore((s) => s.signals);

  if (pathname === "/") return null;

  const avgConfidence = Math.round(
    theses.reduce((acc, t) => acc + t.confidence, 0) / theses.length
  );

  const navItems = [
    { href: "/dashboard", label: "All Theses", icon: "📊" },
    {
      href: "/dashboard?status=active",
      label: "Active",
      icon: "🟢",
      count: theses.filter((t) => t.status === "active").length,
    },
    {
      href: "/dashboard?status=conviction",
      label: "Conviction",
      icon: "🔥",
      count: theses.filter((t) => t.status === "conviction").length,
    },
    {
      href: "/dashboard?status=reviewing",
      label: "Reviewing",
      icon: "🔍",
      count: theses.filter((t) => t.status === "reviewing").length,
    },
  ];

  const bottomNavItems = [
    {
      href: "/signals",
      label: "Signals",
      icon: "📡",
      count: signals.length,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 hidden w-56 border-r border-slate-800 bg-slate-950 p-4 lg:block">
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Theses
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mb-6 border-t border-slate-800 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Intelligence
        </p>
        <nav className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Quick Stats
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Total Theses</span>
            <span className="text-white">{theses.length}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Avg Confidence</span>
            <span className="text-brand-green">{avgConfidence}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Signals</span>
            <span className="text-white">{signals.length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
