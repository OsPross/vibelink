"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Definicja stylów dla podglądu na Landing Page
const previewThemes = {
  cyberpunk: {
    name: "Cyberpunk",
    iconColor: "text-neon-pink",
    titleColor: "text-white",
    descColor: "text-gray-400",
    glow: "bg-neon-pink", // Kolor tylnej poświaty
    border: "border-neon-pink/50",
    activeDot: "bg-neon-pink",
  },
  minimal: {
    name: "Minimal",
    iconColor: "text-white",
    titleColor: "text-white",
    descColor: "text-gray-500",
    glow: "bg-white",
    border: "border-white",
    activeDot: "bg-white",
  },
  sunset: {
    name: "Sunset",
    iconColor: "text-orange-400",
    titleColor: "text-orange-100",
    descColor: "text-orange-200/60",
    glow: "bg-orange-500",
    border: "border-orange-500/50",
    activeDot: "bg-orange-500",
  },
};

type PreviewThemeKey = keyof typeof previewThemes;

export function ThemePreviewBox({ className }: { className?: string }) {
  const [activeTheme, setActiveTheme] = useState<PreviewThemeKey>("cyberpunk");
  const theme = previewThemes[activeTheme];

  return (
    <motion.div 
      className={cn(
        "relative rounded-3xl border overflow-hidden group transition-all duration-500",
        // Dynamiczna zmiana koloru ramki
        theme.border,
        className
      )}
    >
       {/* 1. DYNAMICZNA POŚWIATA W TLE */}
       <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
          <motion.div 
            animate={{ backgroundColor: theme.activeDot === "bg-neon-pink" ? "#FF00FF" : theme.activeDot === "bg-white" ? "#FFFFFF" : "#F97316" }}
            className="w-[400px] h-[400px] blur-[120px] rounded-full mix-blend-screen" 
          />
       </div>

       {/* 2. ZAWARTOŚĆ KAFELKA */}
       <div className="relative z-10 h-full flex flex-col justify-between p-8">
          
          {/* Kropki (Interaktywne przyciski) */}
          <div className="flex gap-3 mb-6">
             {/* Kropka Cyberpunk */}
             <button 
                onClick={() => setActiveTheme("cyberpunk")}
                className={cn("w-4 h-4 rounded-full bg-neon-pink transition-transform hover:scale-125", activeTheme === "cyberpunk" && "ring-2 ring-white ring-offset-2 ring-offset-black scale-110")} 
             />
             {/* Kropka Minimal */}
             <button 
                onClick={() => setActiveTheme("minimal")}
                className={cn("w-4 h-4 rounded-full bg-white transition-transform hover:scale-125", activeTheme === "minimal" && "ring-2 ring-white ring-offset-2 ring-offset-black scale-110")} 
             />
             {/* Kropka Sunset */}
             <button 
                onClick={() => setActiveTheme("sunset")}
                className={cn("w-4 h-4 rounded-full bg-orange-500 transition-transform hover:scale-125", activeTheme === "sunset" && "ring-2 ring-white ring-offset-2 ring-offset-black scale-110")} 
             />
          </div>

          {/* Treść zmieniająca się z animacją */}
          <div>
            <motion.div
                key={activeTheme} // Klucz wymusza animację przy zmianie
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Palette className={cn("w-10 h-10 mb-4 transition-colors", theme.iconColor)} />
                <h3 className={cn("text-2xl font-bold transition-colors", theme.titleColor)}>
                    {theme.name} Theme
                </h3>
                <p className={cn("mt-2 text-sm transition-colors", theme.descColor)}>
                    {activeTheme === "cyberpunk" && "Neonowe światła i ciemność. Dla fanów sci-fi."}
                    {activeTheme === "minimal" && "Czysta forma. Czarny tekst, białe tło. Brutalizm."}
                    {activeTheme === "sunset" && "Ciepłe gradienty Miami. Vibe lat 80-tych."}
                </p>
            </motion.div>
          </div>

          {/* Mini podgląd przycisku */}
          <div className="mt-6">
             <div className={cn(
                 "w-full h-10 rounded-lg border flex items-center justify-center text-xs font-bold uppercase tracking-widest opacity-80",
                 // Symulacja wyglądu przycisku w danym motywie
                 activeTheme === "cyberpunk" ? "border-neon-pink text-neon-pink bg-neon-pink/10" :
                 activeTheme === "minimal" ? "border-white text-black bg-white" :
                 "border-orange-500 text-orange-400 bg-orange-500/10"
             )}>
                 Preview Button
             </div>
          </div>
       </div>
    </motion.div>
  );
}