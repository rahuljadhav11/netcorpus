import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // All brand shades driven by CSS variables — switching data-theme on <html>
        // flips every brand-* Tailwind class site-wide with no JS class toggling.
        brand: {
          50:  "rgb(var(--brand-50)  / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        "card":       "0 2px 12px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)",
        "card-hover": "0 6px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.05)",
        "card-lg":    "0 16px 48px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
