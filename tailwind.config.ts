import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ── Just A Second brand palette (warm, editorial, recycled-material) ──
        forest: {
          DEFAULT: "#333D36", // deep green — primary ink / dark sections
          900: "#1B2520",
          700: "#2A332D",
          500: "#4A574E",
          300: "#7C887F",
        },
        ember: {
          DEFAULT: "#E88225", // warm orange accent
          600: "#D4681F",
          400: "#F09A4C",
          100: "#FBE7D3",
        },
        cream: {
          DEFAULT: "#FFFCF5", // warm off-white background
          200: "#F6F1E7", // paper / cardboard tone
          300: "#ECE3D2", // soft kraft
        },
        clay: "#B5805A", // wood / terracotta secondary
        sand: "#D9C9A8",
      },
      fontFamily: {
        sans: ["Heebo", "system-ui", "sans-serif"],
        display: ["Frank Ruhl Libre", "Heebo", "serif"], // editorial Hebrew serif
      },
      fontSize: {
        "fluid-hero": "clamp(2.75rem, 9vw, 8rem)",
        "fluid-h2": "clamp(1.85rem, 4.5vw, 3.5rem)",
        "fluid-h3": "clamp(1.25rem, 2.5vw, 1.75rem)",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(51,61,54,0.06), 0 12px 32px rgba(51,61,54,0.08)",
        lift: "0 18px 50px rgba(51,61,54,0.16)",
        ember: "0 16px 40px rgba(232,130,37,0.28)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "scroll-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "ticker-rtl": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "scroll-bounce": "scroll-bounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
