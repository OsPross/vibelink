import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}", // <--- TO JEST NAJWAŻNIEJSZA ZMIANA
  ],
  theme: {
    extend: {
      colors: {
        "vibe-black": "#090909",
        "vibe-dark-gray": "#121212",
        "neon-pink": "#FF00FF",
        "neon-cyan": "#00FFFF",
        "neon-pink-dim": "#D90368",
        "neon-cyan-dim": "#04D9D9",
      },
      backgroundImage: {
        "vibe-gradient": "linear-gradient(90deg, #FF00FF 0%, #00FFFF 100%)",
        "vibe-glow-pink": "radial-gradient(circle, rgba(255,0,255,0.15) 0%, rgba(9,9,9,0) 70%)",
        "vibe-glow-cyan": "radial-gradient(circle, rgba(0,255,255,0.15) 0%, rgba(9,9,9,0) 70%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-orbitron)"],
      },
      animation: {
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch": "glitch 1s linear infinite",
      },
      keyframes: {
        glitch: {
          "2%, 64%": { transform: "translate(2px,0) skew(0deg)" },
          "4%, 60%": { transform: "translate(-2px,0) skew(0deg)" },
          "62%": { transform: "translate(0,0) skew(5deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;