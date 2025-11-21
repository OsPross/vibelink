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
        // Nowa paleta Web 3.0 (Głęboki Zinc zamiast czystej czerni)
        "vibe-black": "#09090b", // Zinc 950
        "vibe-card": "rgba(255, 255, 255, 0.03)",
        "vibe-border": "rgba(255, 255, 255, 0.08)",
        
        // Akcenty (Smooth Gradients)
        "brand-primary": "#6366f1", // Indigo
        "brand-secondary": "#a855f7", // Purple
        "brand-accent": "#ec4899", // Pink (ale łagodniejszy)
        
        // Zachowujemy kompatybilność wsteczną dla NeonLink (zmiękczone)
        "neon-pink": "#d946ef", 
        "neon-cyan": "#06b6d4", 
      },
      backgroundImage: {
        "vibe-gradient": "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
        "mesh-gradient": "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Heading też ustawiamy na Inter dla czystości (Web 3.0 style)
        heading: ["var(--font-inter)", "sans-serif"], 
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;