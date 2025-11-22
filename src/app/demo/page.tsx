"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, ChevronLeft, Flame, Youtube, Instagram, Twitter, Github, LayoutGrid, Music, Gamepad2, Share2 } from "lucide-react";
import Link from "next/link";
import { themes, ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { ThemeBackgrounds } from "@/components/ui/ThemeBackgrounds";
import { SocialBar } from "@/components/ui/SocialBar";
import { MediaBlock } from "@/components/ui/MediaBlock";

// --- DANE DEMO ---
const DEMO_SOCIALS = {
  instagram: "instagram.com",
  twitter: "twitter.com",
  youtube: "youtube.com",
  github: "github.com"
};

const DEMO_BLOCKS = [
  { id: 1, type: "header", title: "Featured Content", url: "", icon: null, variant: "pink" },
  { id: 2, type: "youtube", title: "Cyberpunk 2077 - Official Trailer", url: "https://www.youtube.com/watch?v=qIcTM8WXFjk", icon: null, variant: "pink" },
  { id: 3, type: "spotify", title: "Coding Vibes", url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT", icon: null, variant: "cyan" },
  { id: 4, type: "header", title: "My Links", url: "", icon: null, variant: "pink" },
  { id: 5, type: "link", title: "My Portfolio", url: "#", icon: <LayoutGrid />, variant: "cyan" },
  { id: 6, type: "link", title: "Gaming Setup", url: "#", icon: <Gamepad2 />, variant: "pink" },
];

export default function DemoPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cyberpunk");
  const theme = themes[currentTheme];

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative transition-colors duration-700 overflow-hidden font-sans",
      theme.bg, 
      theme.text
    )}>
      
      <ThemeBackgrounds theme={currentTheme} />
      <div className={cn("fixed inset-0 pointer-events-none opacity-30 transition-all duration-1000", theme.gradient)} />
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />
      
      {/* --- PANEL KONTROLNY (POPRAWIONY - SZEROKI) --- */}
      {/* Zmiana: max-w-6xl (bardzo szeroki) zamiast max-w-3xl */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-6xl">
        <div className="bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl shadow-black/80 ring-1 ring-white/5">
          
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Palette size={12} className="text-brand-primary"/> Wybierz Motyw
            </span>
            <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/5">
                {theme.label}
            </span>
          </div>
          
          {/* LISTA MOTYWÓW */}
          {/* Zmiana: Zmniejszony gap-3 -> gap-2 dla lepszego upakowania */}
          <div 
            className="flex gap-2 overflow-x-auto pb-2 pt-2 px-2 no-scrollbar snap-x cursor-grab active:cursor-grabbing"
            style={{ 
                maskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)", 
                WebkitMaskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)" 
            }}
          >
            {Object.entries(themes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key as ThemeKey)}
                className={cn(
                  "flex-shrink-0 group flex flex-col items-center gap-2 snap-center transition-all duration-300 min-w-[64px] p-2 rounded-xl hover:bg-white/5",
                  currentTheme === key ? "opacity-100" : "opacity-60 hover:opacity-100"
                )}
              >
                {/* Kropka */}
                <div className={cn(
                    "w-12 h-12 rounded-full border-2 relative overflow-hidden transition-all shadow-xl",
                    currentTheme === key ? "border-brand-primary ring-2 ring-brand-primary/30 scale-110" : "border-white/20 group-hover:border-white/50"
                )}>
                    <div className={cn("absolute inset-0", value.bg.split(" ")[0])} />
                    
                    {/* Fixy kolorów w kropkach */}
                    {key === 'sunset' && <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-black" />}
                    {key === 'cotton_candy' && <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-indigo-200" />}
                    {key === 'minimal' && <div className="absolute inset-0 bg-white" />}
                    {key === 'matrix' && <div className="absolute inset-0 bg-black" />}
                    {key === 'emerald' && <div className="absolute inset-0 bg-[#022c22]" />}
                    
                    {currentTheme === key && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                            <Check size={18} className="text-white drop-shadow-md" strokeWidth={3} />
                        </div>
                    )}
                </div>
                
                <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                    currentTheme === key ? "text-white" : "text-zinc-500"
                )}>
                    {value.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
          
          <div className="mt-2 pt-3 border-t border-white/10 flex justify-between items-center px-2">
             <span className="text-xs text-zinc-500 hidden sm:inline">Podoba Ci się ten styl?</span>
             <Link 
                href={`/login?mode=register`} 
                className="text-xs bg-white text-black px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
             >
                Stwórz własny profil <Flame size={12} className="fill-black" />
             </Link>
          </div>
        </div>
      </div>

      <Link href="/" className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors group">
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </Link>

      <div className="w-full max-w-md mx-auto z-10 flex-grow flex flex-col py-20 px-6 pb-72">
        <motion.div 
          key={currentTheme} 
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "circOut" }}
        >
            <ProfileHeader 
              username="DemoUser"
              bio={`Tryb podglądu: ${themes[currentTheme].label}.\nPrzetestuj wszystkie motywy na dole ekranu! 👇`}
              imageUrl={`https://api.dicebear.com/9.x/dylan/svg?seed=${currentTheme}`} 
            />
            <SocialBar socials={DEMO_SOCIALS} themeName={currentTheme} />
        </motion.div>

        <div className="flex flex-col gap-4 mt-4">
          <AnimatePresence mode="wait">
            {DEMO_BLOCKS.map((link, i) => (
              <motion.div 
                key={`${link.id}-${currentTheme}`} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 120 }}
              >
                <MediaBlock 
                  id={link.id}
                  type={link.type}
                  title={link.title}
                  url={link.url}
                  icon={link.icon}
                  themeName={currentTheme}
                  variant={link.variant}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <footer className={cn(
        "w-full py-8 text-center z-20 backdrop-blur-md border-t mt-auto relative mb-64", // Większy margines na dole
        currentTheme === 'minimal' ? "border-black/5" : "border-white/5",
        theme.footer
      )}>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
            <Flame size={10} /> Interactive Demo
          </div>
      </footer>
    </div>
  );
}