"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeKey } from "@/lib/themes";

// --- 1. STARS (Gwiazdy - Midnight) ---
function StarField() {
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; duration: number; delay: number }[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 50 }).map((_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 5, delay: Math.random() * 5,
    })));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <motion.div key={s.id} className="absolute bg-white rounded-full opacity-20"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ y: [0, -100], opacity: [0, 0.7, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// --- 2. FIREFLIES (Świetliki - Emerald) ---
function Fireflies() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 bg-emerald-400 rounded-full blur-[2px]"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ x: [0, Math.random() * 100 - 50], y: [0, Math.random() * 100 - 50], opacity: [0, 0.8, 0] }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// --- 3. DIGITAL RAIN (Deszcz - Glitch) ---
function DigitalRain() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="absolute top-[-100px] w-[1px] bg-gradient-to-b from-transparent to-cyber-yellow h-[100px] opacity-50 animate-rain"
          style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 1 + 0.5}s`, animationDelay: `${Math.random() * 2}s` }}
        />
      ))}
    </div>
  );
}

// --- 4. BUBBLES (Bąbelki - Cotton Candy) ---
function Bubbles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          style={{ width: Math.random() * 100 + 50, height: Math.random() * 100 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -500], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// --- 5. GRID (Siatka - Blueprint) ---
function GridPaper() {
  return (
    <div className="fixed inset-0 pointer-events-none" 
      style={{ 
        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} 
    />
  );
}

// --- 6. BLOBS (Lava - Magma) ---
function Blobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
    </div>
  );
}

// --- GŁÓWNY KOMPONENT EXPORTOWANY ---
export function ThemeBackgrounds({ theme }: { theme: ThemeKey }) {
  if (theme === "cyberpunk") return <StarField />;
  if (theme === "emerald") return <Fireflies />;
  if (theme === "glitch") return <DigitalRain />;
  if (theme === "cotton_candy") return <Bubbles />;
  if (theme === "blueprint") return <GridPaper />;
  if (theme === "magma") return <Blobs />;
  
  // Default: Noise overlay for others
  return <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />;
}