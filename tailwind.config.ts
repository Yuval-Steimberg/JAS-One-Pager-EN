import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ── Just A Second — warm, bright, natural identity ──
        // Bases (warm off-white → recycled paper → sand → stone)
        ivory: "#FBF8F1", // primary background (almost-white, warm)
        cream: "#F5EEDF", // recycled-paper tone
        sand: "#EBDCC1", // natural sand
        stone: "#E2DBCC", // light stone
        // Accents inspired by recycled materials
        clay: {
          DEFAULT: "#BE6A45", // muted terracotta (primary accent)
          600: "#A1532F",
          400: "#D2895F",
          100: "#F1DED1",
        },
        sage: {
          DEFAULT: "#8C9A6A", // soft olive / sage (secondary accent)
          600: "#6F7D4E",
          300: "#B3BE94",
          100: "#E6EAD6",
        },
        claywood: "#9A6A4A", // subtle wood/brown — accent ONLY, never a base
        // Ink & text
        ink: {
          DEFAULT: "#26382C", // deep forest green — strong headings / rare dark band
          900: "#1B2A20", // darkest (footer)
          700: "#33483A",
        },
        charcoal: "#3A352D", // body text
      },
      fontFamily: {
        sans: ["Heebo", "system-ui", "sans-serif"],
        display: ["Frank Ruhl Libre", "Heebo", "serif"],
      },
      fontSize: {
        "fluid-hero": "clamp(2.75rem, 9vw, 8rem)",
        "fluid-h2": "clamp(1.85rem, 4.5vw, 3.5rem)",
        "fluid-h3": "clamp(1.25rem, 2.5vw, 1.75rem)",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(58,53,45,0.05), 0 14px 36px rgba(58,53,45,0.07)",
        lift: "0 20px 54px rgba(58,53,45,0.14)",
        clay: "0 16px 40px rgba(190,106,69,0.26)",
      },
      borderRadius: { xl2: "1.25rem" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        "scroll-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: { "scroll-bounce": "scroll-bounce 2s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
