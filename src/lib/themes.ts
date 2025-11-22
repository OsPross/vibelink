export const themes = {
  // 1. Midnight
  cyberpunk: {
    label: "Midnight (Stars)",
    bg: "bg-[#09090b]",
    text: "text-white",
    gradient: "bg-indigo-500", // Dodano gradient
    footer: "text-zinc-500 hover:text-white",
    variants: {
      pink: { border: "border border-white/10", glow: "hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)]", text: "text-white font-bold", bg: "bg-white/5 backdrop-blur-xl" },
      cyan: { border: "border border-zinc-800", glow: "hover:bg-white/5", text: "text-zinc-300 font-bold", bg: "bg-transparent" }
    }
  },
  // 2. Aura
  minimal: {
    label: "Aura (Clean)",
    bg: "bg-white",
    text: "text-black",
    gradient: "bg-rose-400", // Dodano gradient
    footer: "text-zinc-400 hover:text-black uppercase font-bold",
    variants: {
      pink: { border: "border-2 border-black", glow: "hover:shadow-[4px_4px_0px_black]", text: "text-black font-black", bg: "bg-white" },
      cyan: { border: "border-2 border-black", glow: "hover:shadow-[4px_4px_0px_#cbd5e1]", text: "text-black font-black", bg: "bg-slate-100" }
    }
  },
  // 3. Noir
  matrix: {
    label: "Noir (Luxury)",
    bg: "bg-black",
    text: "text-white",
    gradient: "bg-white", // Dodano gradient
    footer: "text-zinc-600 hover:text-white font-serif italic",
    variants: {
      pink: { border: "border border-white", glow: "hover:bg-white hover:text-black transition-colors", text: "text-white font-serif uppercase", bg: "bg-black" },
      cyan: { border: "border border-zinc-800", glow: "hover:border-white", text: "text-zinc-400 hover:text-white font-serif uppercase", bg: "bg-black" }
    }
  },
  // 4. Emerald
  emerald: {
    label: "Emerald (Forest)",
    bg: "bg-[#022c22] bg-gradient-to-b from-[#022c22] to-[#000000]",
    text: "text-emerald-50",
    gradient: "bg-emerald-500", // Dodano gradient
    footer: "text-emerald-800 hover:text-emerald-400",
    variants: {
      pink: { border: "border border-emerald-500/30", glow: "hover:bg-emerald-900/50", text: "text-emerald-200", bg: "bg-emerald-950/30 backdrop-blur-md" },
      cyan: { border: "border border-emerald-900", glow: "hover:bg-emerald-900/30", text: "text-emerald-600 hover:text-emerald-200", bg: "bg-transparent" }
    }
  },
  // 5. Glitch
  glitch: {
    label: "Glitch (Cyber)",
    bg: "bg-black",
    text: "text-yellow-400",
    gradient: "bg-yellow-500", // Dodano gradient
    footer: "text-yellow-600 hover:text-yellow-400 font-mono",
    variants: {
      pink: { border: "border border-yellow-400", glow: "hover:translate-x-1 hover:-translate-y-1 hover:shadow-[2px_2px_0px_#fcee0a]", text: "text-yellow-400 font-mono font-bold", bg: "bg-zinc-900/80" },
      cyan: { border: "border border-cyan-500", glow: "hover:shadow-[0_0_10px_cyan]", text: "text-cyan-400 font-mono font-bold", bg: "bg-black" }
    }
  },
  // 6. Cotton Candy
  cotton_candy: {
    label: "Cotton Candy",
    bg: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200",
    text: "text-indigo-900",
    gradient: "bg-pink-400", // Dodano gradient
    footer: "text-indigo-400 hover:text-indigo-800 font-bold",
    variants: {
      pink: { border: "border-2 border-white", glow: "hover:scale-105 shadow-lg", text: "text-white font-bold", bg: "bg-pink-400" },
      cyan: { border: "border-2 border-white", glow: "hover:scale-105 shadow-lg", text: "text-white font-bold", bg: "bg-indigo-400" }
    }
  },
  // 7. Blueprint
  blueprint: {
    label: "Blueprint (Tech)",
    bg: "bg-[#1e3a8a]",
    text: "text-blue-100",
    gradient: "bg-blue-500", // Dodano gradient
    footer: "text-blue-400 hover:text-blue-200 font-mono",
    variants: {
      pink: { border: "border border-white border-dashed", glow: "hover:bg-blue-800", text: "text-white font-mono", bg: "bg-blue-900/50" },
      cyan: { border: "border border-blue-400", glow: "hover:bg-blue-900", text: "text-blue-200 font-mono", bg: "bg-transparent" }
    }
  },
  // 8. Magma
  magma: {
    label: "Magma (Fluid)",
    bg: "bg-slate-900",
    text: "text-white",
    gradient: "bg-orange-600", // Dodano gradient
    footer: "text-white/50 hover:text-white",
    variants: {
      pink: { border: "border-none", glow: "hover:scale-105 shadow-2xl shadow-purple-500/20", text: "text-white font-bold", bg: "bg-gradient-to-r from-purple-600 to-pink-600" },
      cyan: { border: "border border-white/10", glow: "hover:bg-white/5", text: "text-gray-300", bg: "bg-white/5 backdrop-blur-xl" }
    }
  },
  // 9. Terminal
  terminal: {
    label: "Terminal (Hacker)",
    bg: "bg-black",
    text: "text-green-500",
    gradient: "bg-green-600", // Dodano gradient
    footer: "text-green-700 hover:text-green-500 font-mono",
    variants: {
      pink: { border: "border border-green-500", glow: "hover:bg-green-500 hover:text-black", text: "text-green-500 font-mono", bg: "bg-black" },
      cyan: { border: "border border-green-900", glow: "hover:border-green-500", text: "text-green-700 hover:text-green-500 font-mono", bg: "bg-black" }
    }
  },
  // 10. Sunset
  sunset: {
    label: "Sunset (Glass)",
    bg: "bg-gradient-to-br from-orange-900 via-red-900 to-black",
    text: "text-orange-100",
    gradient: "bg-orange-500", // Dodano gradient
    footer: "text-orange-500/50 hover:text-orange-300",
    variants: {
      pink: { border: "border border-white/20", glow: "hover:bg-white/10", text: "text-white font-bold", bg: "bg-white/10 backdrop-blur-md" },
      cyan: { border: "border border-white/10", glow: "hover:bg-white/5", text: "text-orange-200", bg: "bg-transparent" }
    }
  },
  // 11. Nebula
  vaporwave: {
    label: "Nebula (Cosmic)",
    bg: "bg-[#020617]",
    text: "text-indigo-100",
    gradient: "bg-purple-600", // Dodano gradient
    footer: "text-indigo-500 hover:text-indigo-300",
    variants: {
      pink: { border: "border border-indigo-500/50", glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]", text: "text-indigo-100", bg: "bg-indigo-950/30 backdrop-blur-md" },
      cyan: { border: "border border-cyan-900/50", glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]", text: "text-cyan-200", bg: "bg-cyan-950/10" }
    }
  },
  // 12. Gold
  gold: {
    label: "Gold (Royal)",
    bg: "bg-[#1a1a1a]",
    text: "text-yellow-500",
    gradient: "bg-yellow-600", // Dodano gradient
    footer: "text-yellow-800 hover:text-yellow-500 font-serif",
    variants: {
      pink: { border: "border border-yellow-500", glow: "hover:shadow-[0_0_20px_#eab308]", text: "text-yellow-500 font-serif tracking-widest", bg: "bg-black" },
      cyan: { border: "border border-yellow-900", glow: "hover:border-yellow-600", text: "text-yellow-700 hover:text-yellow-500 font-serif", bg: "bg-transparent" }
    }
  },
};

export type ThemeKey = keyof typeof themes;