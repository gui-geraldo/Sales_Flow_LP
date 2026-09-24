import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        gray: {
          950: "#0A0C0E",
          0: "#FFFFFF",
          25: "#FCFCFD",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: { bg: "#ECFDF3", DEFAULT: "#16A34A", text: "#15803D" },
        warning: { bg: "#FFF7ED", DEFAULT: "#F59E0B", text: "#B45309" },
        error: { bg: "#FEF2F2", DEFAULT: "#EF4444", text: "#B91C1C" },
        info: { bg: "#EFF6FF", DEFAULT: "#3B82F6", text: "#2563EB" },
        purple: { bg: "#F5F3FF", DEFAULT: "#8B5CF6", text: "#6D28D9" },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,40,.04)",
        md: "0 2px 8px rgba(16,24,40,.06)",
        lg: "0 12px 24px rgba(16,24,40,.08)",
      },
      maxWidth: {
        container: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
