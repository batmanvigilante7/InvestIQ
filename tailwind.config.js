/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-0": "#050508",
        "bg-1": "#0a0a10",
        "bg-2": "#101018",
        "bg-3": "#16161f",
        "bg-4": "#1c1c28",
        "border": "rgba(255, 255, 255, 0.06)",
        "border-hover": "rgba(255, 255, 255, 0.12)",
        "text-0": "#f0f0f5",
        "text-1": "rgba(240, 240, 245, 0.7)",
        "text-2": "rgba(240, 240, 245, 0.45)",
        "accent": "#6366f1",
        "accent-dim": "rgba(99, 102, 241, 0.15)",
        "success": "#22c55e",
        "success-dim": "rgba(34, 197, 94, 0.12)",
        "destructive": "#ef4444",
        "destructive-dim": "rgba(239, 68, 68, 0.12)",
        "warning": "#f59e0b",
        "warning-dim": "rgba(245, 158, 11, 0.12)",
        "info": "#06b6d4",
        "info-dim": "rgba(6, 182, 212, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
