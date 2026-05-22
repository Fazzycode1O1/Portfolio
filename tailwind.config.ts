import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        bg: "#07070B",
        surface: { DEFAULT: "#0F0F14", elevated: "#16161E" },
        border: { DEFAULT: "rgba(255,255,255,0.08)", strong: "rgba(255,255,255,0.14)" },
        text: { DEFAULT: "#F4F4F7", muted: "#A0A0AE", subtle: "#6B6B7A" },
        accent: { from: "#7C5CFF", via: "#4F8BFF", to: "#4FE0FF" },
        success: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171",
        info: "#60A5FA",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "Satoshi", "sans-serif"],
      },
      borderRadius: { sm: "6px", md: "10px", lg: "16px", xl: "24px", "2xl": "32px" },
      boxShadow: {
        "glow-violet": "0 0 40px rgba(124,92,255,0.35)",
        "glow-cyan": "0 0 40px rgba(79,224,255,0.30)",
        "inset-hi": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, #7C5CFF 0%, #4F8BFF 50%, #4FE0FF 100%)",
        aurora:
          "radial-gradient(60% 50% at 20% 30%, rgba(124,92,255,0.30), transparent 60%), radial-gradient(50% 40% at 80% 20%, rgba(79,139,255,0.25), transparent 60%), radial-gradient(40% 40% at 50% 80%, rgba(79,224,255,0.20), transparent 60%)",
      },
      transitionTimingFunction: { "out-quart": "cubic-bezier(0.22,1,0.36,1)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(124,92,255,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(124,92,255,0)" },
        },
        "gradient-shift": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-up": "fade-up 520ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
