"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import CommandPalette from "./CommandPalette";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <MobileNav />
      <CommandPalette />
      <main className="min-h-screen pb-20 pt-14 lg:pt-0 lg:pl-[260px]">
        <div className="page-enter">{children}</div>
      </main>
    </>
  );
}
