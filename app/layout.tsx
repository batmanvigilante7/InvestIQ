import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FolioAI — AI-Powered Investing Workspace",
  description:
    "Build, track, and refine investment theses with clarity. Turn ideas into structured conviction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
        <Navbar />
        <Sidebar />
        <main className="pt-16 lg:pl-56">{children}</main>
      </body>
    </html>
  );
}
