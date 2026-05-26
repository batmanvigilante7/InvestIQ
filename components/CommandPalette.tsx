"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const pages = [
  { href: "/home", label: "Home", shortcut: "H" },
  { href: "/theses", label: "Theses", shortcut: "T" },
  { href: "/portfolio", label: "Portfolio", shortcut: "P" },
  { href: "/behavior", label: "Behavior", shortcut: "B" },
  { href: "/governance", label: "Governance", shortcut: "G" },
  { href: "/memory", label: "Memory", shortcut: "M" },
  { href: "/new-thesis", label: "New Thesis", shortcut: "N" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  const filtered = pages.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.href.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setActiveIdx(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={16} className="text-text-2" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && filtered[activeIdx]) {
                navigate(filtered[activeIdx].href);
              }
            }}
            placeholder="Jump to..."
            className="flex-1 bg-transparent text-sm text-text-0 outline-none placeholder:text-text-2"
          />
          <button
            onClick={() => setOpen(false)}
            className="rounded p-1 text-text-2 hover:text-text-0"
          >
            <X size={14} />
          </button>
        </div>
        <ul className="max-h-64 overflow-y-auto py-1">
          {filtered.map((page, idx) => (
            <li key={page.href}>
              <button
                onClick={() => navigate(page.href)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                  idx === activeIdx
                    ? "bg-accent-dim text-text-0"
                    : "text-text-1 hover:bg-bg-3"
                }`}
              >
                <span>{page.label}</span>
                <kbd className="rounded border border-border bg-bg-4 px-1.5 py-0.5 text-[10px] text-text-2">
                  {page.shortcut}
                </kbd>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-text-2">
              No results found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
