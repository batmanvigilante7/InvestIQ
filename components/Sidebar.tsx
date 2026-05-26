"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Briefcase,
  Brain,
  Shield,
  BookOpen,
  Plus,
  Search,
} from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/theses", label: "Theses", icon: FileText },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/behavior", label: "Behavior", icon: Brain },
  { href: "/governance", label: "Governance", icon: Shield },
  { href: "/memory", label: "Memory", icon: BookOpen },
];

export default function Sidebar({
  onCommandPaletteOpen,
}: {
  onCommandPaletteOpen?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-[260px] flex-col border-r border-border bg-bg-1 lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-bold text-white text-sm">
          F
        </div>
        <div>
          <p className="text-sm font-semibold text-text-0">FolioAI</p>
          <p className="text-[10px] text-text-2">v17 Economic Digital Twin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Search trigger */}
        <button
          onClick={onCommandPaletteOpen}
          className="mb-4 flex w-full items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-2 transition-colors hover:border-border-hover hover:text-text-1"
        >
          <Search size={14} />
          <span>Search</span>
          <kbd className="ml-auto rounded border border-border bg-bg-4 px-1.5 py-0.5 text-[10px] text-text-2">
            /
          </kbd>
        </button>

        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent-dim text-accent"
                      : "text-text-1 hover:bg-bg-3 hover:text-text-0"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          <Link
            href="/new-thesis"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            <Plus size={16} />
            New Thesis
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-[10px] text-text-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          AI Active
          <span className="ml-auto">Stage 17</span>
        </div>
      </div>
    </aside>
  );
}
