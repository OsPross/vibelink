"use client";

import Link from "next/link";
import { ArrowRight, MousePointer2, Shield, Zap, Globe, Smartphone, LayoutGrid, Layers, Palette } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

export default function LandingPageUI() {
  // --- INTERAKTYWNE TŁO (Spotlight) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <main 
      className="min-h-screen bg-vibe-black text-white overflow-x-hidden selection:bg-brand-primary selection:text-white relative font-sans"
      onMouseMove={handleMouseMove}
    >
      {/* --- TŁO I SZUM --- */}
      <div className="bg-noise fixed inset-0 z-50 pointer-events-none opacity-[0.03]" />
      
      {/* Spotlight (Światło podążające za myszką) */}
      <motion.div
        className="pointer-events-none fixed -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 lg:absolute z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.10),
              transparent 80%
            )
          `,
        }}
      />

      {/* Statyczne plamy światła (Mesh Gradients) */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-brand-secondary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      {/* --- NAVBAR (Unoszący się "Pill") --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="web3-card rounded-full px-6 py-3 flex items-center justify-between w-full max-w-2xl backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <span className="font-bold tracking-tight text-sm">VIBELINK</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Funkcje</a>
            <a href="#showcase" className="hover:text-white transition-colors">Motywy</a>
            <a href="#pricing" className="hover:text-white transition-colors">Cennik</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-medium text-zinc-300 hover:text-white transition-colors">
              Zaloguj
            </Link>
            <Link 
              href="/login?mode=register" 
              className="px-4 py-2 bg-white text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg shadow-white/10"
            >
              Start
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-32">
        
        {/* Badge "New v2.0" */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          VibeLink 2.0 is Live
        </motion.div>

        {/* Główny Nagłówek */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Your digital identity. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
            Uncompromised.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Przestań używać prostych list. Zbuduj portfolio, które wygląda jak 2025 rok.
          Płynne animacje, nieskończona personalizacja, zero kodu.
        </motion.p>

        {/* Przyciski CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/login" 
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-sm transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            Stwórz Profil za Darmo
            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/testuser" 
            className="px-8 py-4 rounded-full text-sm font-medium text-zinc-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all"
          >
            Zobacz Demo
          </Link>
        </motion.div>

        {/* Podgląd UI (Karta w 3D) */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="mt-20 w-full max-w-5xl perspective-1000"
        >
          <div className="relative rounded-t-3xl border border-white/10 bg-[#09090b]/80 backdrop-blur-xl shadow-2xl shadow-brand-primary/20 overflow-hidden h-[400px] md:h-[600px]">
             <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
             
             {/* Mockup interfejsu w środku */}
             <div className="p-8 md:p-12 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent p-[2px] mb-6">
                   <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-zinc-800 animate-pulse" />
                   </div>
                </div>
                <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse mb-3" />
                <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse mb-12" />

                <div className="w-full max-w-md space-y-4">
                   {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 w-full rounded-2xl border border-white/5 bg-white/[0.02] flex items-center px-6 gap-4">
                         <div className="h-8 w-8 rounded-lg bg-white/10" />
                         <div className="h-3 w-32 bg-white/10 rounded-full" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- BENTO GRID (Features) --- */}
      <section id="features" className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Designed for the <span className="text-brand-primary">new web</span>.
          </h2>
          <p className="text-zinc-400 text-lg">
            Każdy piksel został zaprojektowany z myślą o szybkości i estetyce.
            Bez zbędnych dodatków. Tylko to, co ważne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          
          {/* KARTA 1: CUSTOMIZATION (Duża) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 web3-card rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-primary/20 blur-[100px] rounded-full group-hover:bg-brand-primary/30 transition-colors duration-700" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10">
                  <Palette className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Liquid Themes</h3>
                <p className="text-zinc-400 max-w-md">
                  Wybierz jeden z gotowych motywów (Cyberpunk, Sunset, Minimal) lub stwórz własny.
                  Zmiana w czasie rzeczywistym.
                </p>
              </div>

              {/* Interaktywne kropki */}
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-[#09090b] border border-zinc-700 hover:scale-110 transition-transform cursor-pointer shadow-lg" />
                <div className="h-12 w-12 rounded-full bg-white border border-white hover:scale-110 transition-transform cursor-pointer shadow-lg" />
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent hover:scale-110 transition-transform cursor-pointer shadow-lg" />
              </div>
            </div>
          </motion.div>

          {/* KARTA 2: ANALYTICS (Pionowa) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:row-span-2 web3-card rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center group"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 mb-6">
                <LayoutGrid className="text-white" size={24} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Bento Grids</h3>
             <p className="text-zinc-400 text-sm mb-8">
               Automatyczny układ kafelków, który zawsze wygląda idealnie.
             </p>

             {/* Symulacja kafelków */}
             <div className="w-full flex-grow grid grid-cols-2 gap-3 opacity-50 group-hover:opacity-80 transition-opacity">
                <div className="bg-white/10 rounded-xl h-full w-full" />
                <div className="bg-white/5 rounded-xl h-full w-full" />
                <div className="col-span-2 bg-white/5 rounded-xl h-20" />
                <div className="bg-white/5 rounded-xl h-full w-full" />
                <div className="bg-brand-primary/20 rounded-xl h-full w-full" />
             </div>
          </motion.div>

          {/* KARTA 3: SPEED */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="web3-card rounded-3xl p-8 flex flex-col justify-center group"
          >
             <div className="flex items-center justify-between mb-4">
                <Zap className="text-yellow-400 fill-yellow-400/20" size={32} />
                <span className="text-3xl font-bold">99<span className="text-lg text-zinc-500">%</span></span>
             </div>
             <h3 className="text-xl font-bold text-white">Blazing Fast</h3>
             <p className="text-zinc-400 text-sm mt-2">
               Statyczny rendering (SSG) na krawędzi sieci. Ładuje się w milisekundach.
             </p>
          </motion.div>

          {/* KARTA 4: MOBILE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="web3-card rounded-3xl p-8 flex flex-col justify-center group relative overflow-hidden"
          >
             <Smartphone className="text-white mb-4 relative z-10" size={32} />
             <h3 className="text-xl font-bold text-white relative z-10">Mobile Native</h3>
             <p className="text-zinc-400 text-sm mt-2 relative z-10">
               Gesty swipe, haptyka i idealne dopasowanie do kciuka.
             </p>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          </motion.div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary/10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">upgrade?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
            >
              Rozpocznij za darmo
            </Link>
          </div>
          <p className="mt-6 text-zinc-500 text-sm">Nie wymagamy karty kredytowej.</p>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold tracking-wider mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-primary rounded-full" />
              VIBE
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              SaaS platform for next-gen creators.
              Built in 2025.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Funkcje</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Motywy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cennik</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Firma</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">O nas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center border-t border-white/5 pt-8 text-zinc-600 text-xs">
          © 2025 VibeLink Inc. All rights reserved.
        </div>
      </footer>

    </main>
  );
}