import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        // All chromatic tokens flow through CSS variables defined in
        // globals.css. The `.dark` class on <html> swaps those variables,
        // so every utility that references them (text-text, bg-surface,
        // border-border, etc.) updates without component-level changes.
        bg: "var(--bg)",
        surface: { DEFAULT: "var(--surface)", elevated: "var(--surface-elevated)" },
        border: { DEFAULT: "var(--border)", strong: "var(--border-strong)" },
        text: { DEFAULT: "var(--text)", muted: "var(--text-muted)", subtle: "var(--text-subtle)" },
        // Accent stays orange in both modes — readable on warm-light and warm-dark alike.
        accent: { from: "#FF6B33", via: "#FF5B22", to: "#E04A14", DEFAULT: "#FF5B22" },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "Satoshi", "sans-serif"],
      },
      borderRadius: { sm: "6px", md: "10px", lg: "14px", xl: "20px", "2xl": "28px" },
      boxShadow: {
        // Shadow variables swap with theme — softer + warmer in light, near-flat in dark.
        "glow-violet": "var(--shadow-card)",
        "glow-cyan":   "var(--shadow-card)",
        "inset-hi":    "var(--shadow-inset)",
        card:          "var(--shadow-card)",
        "card-hover":  "var(--shadow-card-hover)",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(180deg, #FF6B33 0%, #FF5B22 100%)",
        aurora:
          "radial-gradient(60% 50% at 20% 30%, rgba(255,91,34,0.06), transparent 60%), radial-gradient(50% 40% at 80% 20%, rgba(255,107,51,0.05), transparent 60%)",
      },
      transitionTimingFunction: { "out-quart": "cubic-bezier(0.22,1,0.36,1)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,91,34,0.25)" },
          "50%":     { boxShadow: "0 0 0 10px rgba(255,91,34,0)" },
        },
        "gradient-shift": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-up": "fade-up 420ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
