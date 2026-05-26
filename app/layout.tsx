import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FolioAI — Investing Companion",
  description:
    "Intelligent portfolio management with AI-powered insights. Track convictions, analyze behavior, manage governance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />
          <Sidebar />
          <main className="pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-[260px] min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
