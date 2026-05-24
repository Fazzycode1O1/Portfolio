import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        // All chromatic tokens flow through CSS variables in globals.css.
        // Light mode dropped for the Graphite/Atelier rebrand — see G1 notes.
        bg: "var(--bg)",
        surface: { DEFAULT: "var(--surface)", elevated: "var(--surface-elevated)" },
        card: "var(--card)",
        steel: "var(--steel)",
        border: { DEFAULT: "var(--border)", strong: "var(--border-strong)" },
        text: { DEFAULT: "var(--text)", muted: "var(--text-muted)", subtle: "var(--text-subtle)" },

        // Atelier accents — sparingly applied. signal is the primary accent;
        // moss reserved for "alive" indicators; copper reserved for one
        // signature accent moment per page.
        signal: {
          DEFAULT: "var(--signal)",
          soft: "var(--signal-soft)",
          bright: "var(--signal-bright)",
        },
        moss:   "var(--moss)",
        copper: "var(--copper)",

        // Back-compat: `accent.*` tokens now collapse to within-hue steel
        // variants instead of cyan→blue→purple. Existing consumers (gradients,
        // utilities) keep working without import changes.
        accent: {
          from: "var(--signal-bright)",
          via:  "var(--signal)",
          to:   "var(--signal-soft)",
          DEFAULT: "var(--signal)",
        },

        success: "var(--success)",
        warning: "var(--warning)",
        danger:  "var(--danger)",
        info:    "var(--info)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "Satoshi", "sans-serif"],
      },
      borderRadius: { sm: "6px", md: "10px", lg: "14px", xl: "20px", "2xl": "28px" },
      boxShadow: {
        "elev-1":      "var(--elev-1)",
        "elev-2":      "var(--elev-2)",
        "elev-3":      "var(--elev-3)",

        // New Atelier glows.
        "glow-signal": "var(--glow-signal)",
        "glow-moss":   "var(--glow-moss)",
        "glow-copper": "var(--glow-copper)",

        // Back-compat aliases — point at Atelier values so existing callers
        // re-color automatically until G2 sweeps them. G2 removes the
        // historical names entirely.
        "glow-blue":   "var(--glow-signal)",
        "glow-cyan":   "var(--glow-moss)",
        "glow-purple": "var(--glow-copper)",
        "glow-violet": "var(--elev-2)",

        "inset-hi":    "var(--shadow-inset)",
        card:          "var(--shadow-card)",
        "card-hover":  "var(--shadow-card-hover)",
      },
      backgroundImage: {
        // No more rainbow. Within-hue steel ramp — subtle value shift, atmospheric.
        "accent-gradient":
          "linear-gradient(135deg, var(--signal-bright) 0%, var(--signal) 50%, var(--signal-soft) 100%)",
        aurora:
          "radial-gradient(60% 50% at 20% 30%, rgba(107,143,168,0.08), transparent 60%), radial-gradient(50% 40% at 80% 20%, rgba(184,149,111,0.05), transparent 60%)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.22,1,0.36,1)",
        "out-expo":  "cubic-bezier(0.16,1,0.3,1)",
      },
      transitionDuration: {
        fast: "180ms",
        base: "320ms",
        slow: "520ms",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        // Recolored to signal blue. Used for live/active indicators.
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(107,143,168,0.30)" },
          "50%":     { boxShadow: "0 0 0 10px rgba(107,143,168,0)" },
        },
        "gradient-shift": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        blink: { "0%,55%": { opacity: "1" }, "60%,100%": { opacity: "0" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-up": "fade-up 420ms cubic-bezier(0.22,1,0.36,1) both",
        blink: "blink 1.05s steps(1,end) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
