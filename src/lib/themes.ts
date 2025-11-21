export const themes = {
  cyberpunk: {
    label: "Cyberpunk (Original)",
    bg: "bg-[#050505] bg-grid-pattern",
    text: "text-white",
    footer: "text-gray-500",
    variants: {
      pink: {
        border: "border border-neon-pink",
        glow: "hover:shadow-[0_0_25px_#FF00FF]",
        text: "text-neon-pink font-bold tracking-wider",
        bg: "bg-[#121212]/90 backdrop-blur-xl"
      },
      cyan: {
        border: "border border-neon-cyan",
        glow: "hover:shadow-[0_0_25px_#00FFFF]",
        text: "text-neon-cyan font-bold tracking-wider",
        bg: "bg-[#121212]/90 backdrop-blur-xl"
      }
    }
  },
  sunset: {
    label: "Miami Sunset",
    bg: "bg-gradient-to-br from-orange-500 via-pink-600 to-purple-900 animate-gradient-xy",
    text: "text-white drop-shadow-md",
    footer: "text-white/60 hover:text-white",
    variants: {
      pink: {
        border: "border-2 border-white/20",
        glow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]",
        text: "text-white font-bold",
        bg: "bg-white/10 backdrop-blur-md hover:bg-white/20"
      },
      cyan: {
        border: "border-2 border-yellow-300/50",
        glow: "hover:shadow-[0_0_20px_rgba(253,224,71,0.6)]",
        text: "text-yellow-300 font-bold",
        bg: "bg-black/20 backdrop-blur-md hover:bg-black/30"
      }
    }
  },
  matrix: {
    label: "The Matrix",
    bg: "bg-black bg-scanlines animate-crt",
    text: "text-green-500 font-mono shadow-[0_0_5px_rgba(34,197,94,0.8)]",
    footer: "text-green-800 hover:text-green-400 font-mono",
    variants: {
      pink: {
        border: "border border-green-700",
        glow: "hover:shadow-[0_0_15px_rgba(21,128,61,1)]",
        text: "text-green-600 font-mono uppercase",
        bg: "bg-black border-l-4 border-l-green-700"
      },
      cyan: {
        border: "border border-green-400",
        glow: "hover:shadow-[0_0_15px_rgba(74,222,128,1)]",
        text: "text-green-400 font-mono uppercase",
        bg: "bg-black border-l-4 border-l-green-400"
      }
    }
  },
  dracula: {
    label: "Dracula (Dark)",
    bg: "bg-[#0f0c29] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]",
    text: "text-gray-200",
    footer: "text-gray-500 hover:text-red-500",
    variants: {
      pink: {
        border: "border border-red-600",
        glow: "hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]",
        text: "text-red-500 font-bold",
        bg: "bg-[#0f0c29]/80 backdrop-blur-sm"
      },
      cyan: {
        border: "border border-purple-400",
        glow: "hover:shadow-[0_0_25px_rgba(192,132,252,0.6)]",
        text: "text-purple-400 font-bold",
        bg: "bg-[#0f0c29]/80 backdrop-blur-sm"
      }
    }
  },
  // --- TUTAJ JEST NAPRAWIONY MOTYW ---
  minimal: {
    label: "Minimal (Light)",
    // ZMIANA TUTAJ: Dodajemy 'bg-graph-paper' i 'animate-breathe'
    bg: "bg-graph-paper animate-breathe", 
    text: "text-black",
    // Dodajemy też gradient do 'kulek' w tle (tych blur-3xl), żeby były ledwo widoczne szare/niebieskie
    gradient: "bg-slate-400", 
    footer: "text-zinc-600 hover:text-black font-bold uppercase tracking-widest",
    variants: {
      pink: {
        border: "border-2 border-black",
        glow: "shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000]",
        text: "text-black font-black tracking-tight",
        bg: "bg-white"
      },
      cyan: {
        border: "border-2 border-black",
        glow: "shadow-[4px_4px_0px_0px_#a1a1aa] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#a1a1aa]",
        text: "text-white font-black tracking-tight",
        bg: "bg-zinc-900"
      }
    }
  },
  // -----------------------------------
  vaporwave: {
    label: "Vaporwave",
    bg: "bg-indigo-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-indigo-900 to-black",
    text: "text-pink-300 shadow-[2px_2px_0px_#000]",
    footer: "text-indigo-400 hover:text-pink-400",
    variants: {
      pink: {
        border: "border-b-4 border-pink-500",
        glow: "hover:brightness-110",
        text: "text-pink-300 font-bold italic",
        bg: "bg-indigo-950/50 backdrop-blur-md"
      },
      cyan: {
        border: "border-b-4 border-yellow-400",
        glow: "hover:brightness-110",
        text: "text-yellow-300 font-bold italic",
        bg: "bg-indigo-950/50 backdrop-blur-md"
      }
    }
  },
};

export type ThemeKey = keyof typeof themes;