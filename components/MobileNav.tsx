"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  FileText,
  Briefcase,
  Brain,
  Shield,
  BookOpen,
  Menu,
  X,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/theses", label: "Theses", icon: FileText },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/behavior", label: "Behavior", icon: Brain },
  { href: "/governance", label: "Governance", icon: Shield },
  { href: "/memory", label: "Memory", icon: BookOpen },
];

const bottomNav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/theses", label: "Theses", icon: FileText },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/new-thesis", label: "New", icon: Plus },
  { href: "/behavior", label: "Behavior", icon: Brain },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-2 text-text-1 transition-colors hover:text-text-0 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-bg-1 border-r border-border flex flex-col">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-bold text-white text-sm">
                  F
                </div>
                <span className="text-sm font-semibold text-text-0">FolioAI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-text-2 hover:text-text-0"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  New Thesis
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Bottom tab bar on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-bg-1/95 backdrop-blur-md lg:hidden">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                isActive ? "text-accent" : "text-text-2"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
