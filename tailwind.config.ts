import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vibe-black": "#09090b",
        "brand-primary": "#6366f1",
        "brand-secondary": "#a855f7",
        "brand-accent": "#ec4899",
        // Kolory specyficzne dla nowych motywów
        "matrix-green": "#00ff41",
        "cyber-yellow": "#fcee0a",
        "blueprint-blue": "#1e3a8a",
      },
      backgroundImage: {
        "vibe-gradient": "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["monospace"], // Dla motywu Terminal
      },
      animation: {
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "rain": "rain 1s linear infinite",
        "matrix": "matrix 2s linear infinite",
        "scanline": "scanline 8s linear infinite",
        "blob": "blob 7s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
        "gradient-xy": {
          "0%, 100%": { backgroundSize: "400% 400%", backgroundPosition: "left center" },
          "50%": { backgroundSize: "200% 200%", backgroundPosition: "right center" }
        },
        rain: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        }
      },
    },
  },
  plugins: [],
};
export default config;