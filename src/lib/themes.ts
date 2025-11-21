export const themes = {
  // 1. MIDNIGHT (Spójny z nowym Landing Pagem)
  cyberpunk: { // Zostawiamy klucz 'cyberpunk' dla kompatybilności wstecznej, ale zmieniamy wygląd na "Midnight"
    label: "Midnight (Default)",
    bg: "bg-[#09090b] bg-noise", // Ciemne tło z szumem
    text: "text-zinc-100",
    gradient: "bg-brand-primary", // Fioletowa poświata
    footer: "text-zinc-500 hover:text-zinc-300",
    variants: {
      pink: { // Styl: Primary Glass
        border: "border border-white/10",
        glow: "hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.4)] hover:border-brand-primary/50",
        text: "text-white font-medium tracking-wide",
        bg: "bg-white/5 backdrop-blur-xl hover:bg-white/10"
      },
      cyan: { // Styl: Ghost
        border: "border border-transparent",
        glow: "hover:bg-white/5",
        text: "text-zinc-300 font-medium tracking-wide",
        bg: "bg-transparent hover:text-white"
      }
    }
  },

  // 2. AURA (Nowoczesny Jasny)
  minimal: { // Klucz 'minimal' -> Aura
    label: "Aura (Light)",
    // Piękny, subtelny gradient w tle
    bg: "bg-gradient-to-tr from-rose-50 via-white to-blue-50", 
    text: "text-slate-900",
    gradient: "bg-rose-400", // Różowa poświata
    footer: "text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest",
    variants: {
      pink: {
        border: "border border-white/40 shadow-sm",
        glow: "hover:shadow-lg hover:-translate-y-0.5 transition-all",
        text: "text-slate-800 font-bold",
        bg: "bg-white/60 backdrop-blur-md"
      },
      cyan: {
        border: "border border-slate-200",
        glow: "hover:bg-white hover:shadow-md transition-all",
        text: "text-slate-600 font-medium",
        bg: "bg-transparent"
      }
    }
  },

  // 3. NOIR (Luksusowa Czerń)
  matrix: { // Klucz 'matrix' -> Noir
    label: "Noir (Luxury)",
    bg: "bg-[#000000]", 
    text: "text-white",
    gradient: "bg-white", // Biała poświata
    footer: "text-zinc-600 hover:text-white font-sans",
    variants: {
      pink: {
        border: "border border-white",
        glow: "hover:bg-white hover:text-black transition-colors duration-300",
        text: "text-white font-bold uppercase tracking-widest",
        bg: "bg-black"
      },
      cyan: {
        border: "border border-zinc-800",
        glow: "hover:border-white transition-colors duration-300",
        text: "text-zinc-400 hover:text-white font-bold uppercase tracking-widest",
        bg: "bg-black"
      }
    }
  },

  // 4. SUNSET (Glassmorphism)
  sunset: { // Klucz 'sunset' -> Glass Sunset
    label: "Sunset Glass",
    // Głęboki gradient
    bg: "bg-[#0f0c29] bg-gradient-to-br from-[#24243e] via-[#302b63] to-[#0f0c29]",
    text: "text-white drop-shadow-md",
    gradient: "bg-pink-500",
    footer: "text-white/40 hover:text-white",
    variants: {
      pink: {
        border: "border-t border-l border-white/20 border-b border-r border-black/20",
        glow: "hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        text: "text-white font-bold",
        bg: "bg-white/5 backdrop-blur-[8px]"
      },
      cyan: {
        border: "border border-white/10",
        glow: "hover:bg-white/5",
        text: "text-pink-200 font-bold",
        bg: "bg-transparent"
      }
    }
  },
  
  // 5. VAPORWAVE (Zostawiamy jako opcję "Fun")
  vaporwave: {
    label: "Vaporwave",
    bg: "bg-indigo-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-indigo-900 to-black",
    text: "text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.5)]",
    gradient: "bg-cyan-500",
    footer: "text-indigo-400 hover:text-pink-400",
    variants: {
      pink: {
        border: "border border-pink-500/50",
        glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]",
        text: "text-pink-300 font-bold italic",
        bg: "bg-indigo-900/40 backdrop-blur-md"
      },
      cyan: {
        border: "border border-cyan-500/50",
        glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
        text: "text-cyan-300 font-bold italic",
        bg: "bg-indigo-900/40 backdrop-blur-md"
      }
    }
  },
};

export type ThemeKey = keyof typeof themes;