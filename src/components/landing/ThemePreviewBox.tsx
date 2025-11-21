"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Definicja stylów PODGLĄDU (odzwierciedla nowe motywy)
const previewThemes = {
  midnight: {
    name: "Midnight",
    bg: "bg-[#09090b]",
    text: "text-white",
    desc: "text-zinc-400",
    accent: "bg-brand-primary", // Fioletowa kropka
    card: "bg-white/5 border-white/10", // Styl karty
    button: "bg-white/10 text-white border border-white/10",
  },
  aura: {
    name: "Aura",
    bg: "bg-white",
    text: "text-slate-900",
    desc: "text-slate-500",
    accent: "bg-rose-400", // Różowa kropka
    card: "bg-slate-50 border-slate-200",
    button: "bg-white text-slate-900 border border-slate-200 shadow-sm",
  },
  noir: {
    name: "Noir",
    bg: "bg-black",
    text: "text-white",
    desc: "text-zinc-500",
    accent: "bg-white", // Biała kropka
    card: "bg-zinc-900 border-zinc-800",
    button: "bg-black text-white border border-white hover:bg-white hover:text-black transition-colors",
  },
};

type PreviewThemeKey = keyof typeof previewThemes;

export function ThemePreviewBox({ className }: { className?: string }) {
  const [activeTheme, setActiveTheme] = useState<PreviewThemeKey>("midnight");
  const theme = previewThemes[activeTheme];

  return (
    <motion.div 
      className={cn(
        "relative rounded-3xl border overflow-hidden group transition-all duration-500",
        // Ramka zewnętrzna kontenera
        activeTheme === "midnight" ? "border-white/10 bg-[#09090b]" :
        activeTheme === "aura" ? "border-slate-200 bg-white" :
        "border-zinc-800 bg-black",
        className
      )}
    >
       {/* 1. TŁO / POŚWIATA */}
       <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none">
          <motion.div 
            animate={{ backgroundColor: activeTheme === "midnight" ? "#6366f1" : activeTheme === "aura" ? "#fb7185" : "#ffffff" }}
            className="w-[300px] h-[300px] blur-[100px] rounded-full mix-blend-screen opacity-40" 
          />
       </div>

       {/* 2. ZAWARTOŚĆ */}
       <div className="relative z-10 h-full flex flex-col justify-between p-8">
          
          {/* SELEKTOR MOTYWÓW (Kropki) */}
          <div className="flex gap-3 mb-6 p-2 bg-white/5 w-fit rounded-full backdrop-blur-md border border-white/5">
             <button 
                onClick={() => setActiveTheme("midnight")}
                className={cn("w-4 h-4 rounded-full transition-transform hover:scale-125 bg-brand-primary", activeTheme === "midnight" && "ring-2 ring-white scale-110")} 
                title="Midnight"
             />
             <button 
                onClick={() => setActiveTheme("aura")}
                className={cn("w-4 h-4 rounded-full transition-transform hover:scale-125 bg-rose-300", activeTheme === "aura" && "ring-2 ring-slate-400 scale-110")} 
                title="Aura"
             />
             <button 
                onClick={() => setActiveTheme("noir")}
                className={cn("w-4 h-4 rounded-full transition-transform hover:scale-125 bg-white", activeTheme === "noir" && "ring-2 ring-zinc-500 scale-110")} 
                title="Noir"
             />
          </div>

          {/* TREŚĆ */}
          <div>
            <motion.div
                key={activeTheme} // Animacja przy zmianie
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={cn("p-3 w-fit rounded-xl mb-4 border", theme.card)}>
                    <Palette className={cn("w-6 h-6", theme.text)} />
                </div>
                
                <h3 className={cn("text-2xl font-bold transition-colors", theme.text)}>
                    {theme.name}
                </h3>
                <p className={cn("mt-2 text-sm transition-colors", theme.desc)}>
                    {activeTheme === "midnight" && "Deep focus. Dark interfaces for professionals."}
                    {activeTheme === "aura" && "Light & Airy. Clean aesthetics for creators."}
                    {activeTheme === "noir" && "Monochrome luxury. Timeless design."}
                </p>
            </motion.div>
          </div>

          {/* PRZYKŁADOWY LINK */}
          <div className="mt-8">
             <div className={cn(
                 "w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold tracking-wide transition-all",
                 theme.button
             )}>
                 Example Link
             </div>
          </div>
       </div>
    </motion.div>
  );
}