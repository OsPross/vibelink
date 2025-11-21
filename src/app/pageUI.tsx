"use client";

import Link from "next/link";
import { ArrowRight, Zap, Palette, Smartphone, GripVertical, Lock, Globe, MousePointer2, Shield } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
// Importujemy nasz nowy, interaktywny komponent
import { ThemePreviewBox } from "@/components/landing/ThemePreviewBox";

export default function LandingPageUI() {
  // --- HOOKI DO ANIMACJI SCROLLA ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Ref dla sekcji telefonu do efektu parallax
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Telefon przesuwa się wolniej
  const y2 = useTransform(scrollY, [0, 500], [0, -150]); // Tekst przesuwa się szybciej w górę

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-neon-pink selection:text-white relative">
      
      {/* PASEK POSTĘPU NA GÓRZE */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-vibe-gradient origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* --- DYNAMICZNE TŁO --- */}
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay" />
      <div className="fixed top-[-20%] left-0 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] right-0 w-[800px] h-[800px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      {/* --- NAVBAR (Glassmorphism) --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-md bg-black/50 border-b border-white/5 mt-4 rounded-full mx-4"
      >
        <div className="text-xl font-heading font-bold tracking-wider flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-pink rounded-full animate-pulse" />
          VIBE<span className="text-white/50">LINK</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold hover:text-neon-cyan transition-colors tracking-widest uppercase">
            Logowanie
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs hover:scale-105 transition-transform"
          >
            GET STARTED
          </Link>
        </div>
      </motion.nav>

      {/* --- HERO SECTION (Parallax) --- */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEWA: TEKST */}
          <motion.div style={{ y: y2 }} className="space-y-8 text-center lg:text-left relative z-20">
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-heading font-black leading-[0.9] tracking-tighter">
                LINK IN BIO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-purple-500 to-neon-cyan">
                  REIMAGINED.
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Twój cyfrowy identyfikator. Futurystyczny, szybki i w pełni konfigurowalny. 
              Zbudowany dla twórców, którzy wymagają więcej.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link href="/login" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-neon-cyan translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 mix-blend-multiply" />
                <span className="relative flex items-center gap-2">ROZPOCZNIJ TERAZ <ArrowRight size={18} /></span>
              </Link>
              <Link href="/testuser" className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors">
                DEMO LIVE
              </Link>
            </motion.div>
          </motion.div>

          {/* PRAWA: TELEFON (3D Look) */}
          <motion.div style={{ y: y1 }} className="relative flex justify-center z-10">
             <div className="relative w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden ring-1 ring-white/20 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-30 flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                   <div className="w-16 h-2 rounded-full bg-[#050505] border border-white/10" />
                </div>

                {/* SCREEN CONTENT */}
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center pt-16 px-6 relative">
                   <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                   
                   {/* Avatar */}
                   <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-24 h-24 rounded-full border-2 border-neon-pink p-1 mb-4 relative z-10"
                   >
                      <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
                      </div>
                   </motion.div>
                   <div className="text-xl font-bold">@cyber_user</div>
                   <div className="text-gray-500 text-xs mb-8">Digital Artist</div>

                   {/* Animated Buttons */}
                   <div className="w-full space-y-3 relative z-10">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          className="w-full h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center px-4 hover:bg-white/10 hover:border-neon-cyan transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 opacity-80" />
                          <div className="ml-4 h-2 w-24 bg-white/20 rounded-full" />
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>
             
             {/* Floating Elements behind phone */}
             <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -right-10 w-20 h-20 bg-vibe-dark-gray border border-white/10 rounded-2xl p-4 backdrop-blur-xl z-20 shadow-xl"
             >
                <Palette className="text-neon-pink w-full h-full" />
             </motion.div>
             <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-40 -left-10 w-16 h-16 bg-vibe-dark-gray border border-white/10 rounded-2xl p-4 backdrop-blur-xl z-20 shadow-xl flex items-center justify-center"
             >
                <Zap className="text-neon-cyan w-8 h-8" />
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- BENTO GRID SECTION (Interaktywne Pudełka) --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
             <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
               MORE THAN JUST <br />
               <span className="text-gray-600">A SIMPLE LIST.</span>
             </h2>
          </motion.div>

          {/* THE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* BOX 1: THEMES (Duży, Interaktywny) */}
            <ThemePreviewBox className="md:col-span-2 bg-black/40 backdrop-blur-xl" />

            {/* BOX 2: DRAG & DROP (Animowany) */}
            <BentoBox className="md:col-span-1 bg-[#0a0a0a]">
               <div className="h-full flex flex-col p-8">
                  <div className="flex-grow flex flex-col gap-3 justify-center relative">
                     <motion.div 
                        animate={{ y: [0, 60, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute z-20 w-full bg-vibe-dark-gray border border-neon-cyan/50 p-3 rounded-lg flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                     >
                        <GripVertical className="text-gray-500" size={16} />
                        <div className="w-8 h-8 bg-neon-cyan rounded-md" />
                        <div className="w-20 h-2 bg-gray-700 rounded" />
                     </motion.div>
                     {/* Tło dla efektu drag */}
                     <div className="w-full bg-white/5 p-3 rounded-lg opacity-50 border border-dashed border-white/10 h-14" />
                     <div className="w-full bg-white/5 p-3 rounded-lg opacity-50 h-14" />
                     <div className="w-full bg-white/5 p-3 rounded-lg opacity-50 h-14" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mt-4">Drag & Drop</h3>
                     <p className="text-gray-500 text-sm">Pełna kontrola kolejności.</p>
                  </div>
               </div>
            </BentoBox>

            {/* BOX 3: MOBILE FIRST */}
            <BentoBox className="md:col-span-1 bg-[#0a0a0a]">
               <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <Smartphone className="w-16 h-16 text-gray-700 mb-6 group-hover:text-neon-pink transition-colors duration-500" />
                  <h3 className="text-xl font-bold text-white">100% Responsive</h3>
                  <p className="text-gray-500 text-sm mt-2">Wygląda perfekcyjnie na każdym ekranie.</p>
               </div>
            </BentoBox>

             {/* BOX 4: SECURITY (Animacja kłódki) */}
             <BentoBox className="md:col-span-1 bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-[200px] h-[200px] text-white/5 rotate-12" />
                </div>
                <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                   <Shield className="w-8 h-8 text-green-400 mb-4" />
                   <h3 className="text-xl font-bold text-white">Secure by Default</h3>
                   <p className="text-gray-500 text-sm">Enterprise-grade security (RLS).</p>
                </div>
             </BentoBox>

             {/* BOX 5: GLOBAL (Ziemia) */}
             <BentoBox className="md:col-span-1 bg-gradient-to-t from-purple-900/20 to-[#0a0a0a]">
                <div className="h-full flex flex-col p-8 items-center justify-center text-center">
                   <Globe className="w-16 h-16 text-purple-500 animate-spin-slow mb-4" />
                   <h3 className="text-xl font-bold text-white">Global CDN</h3>
                   <p className="text-gray-500 text-sm">Superszybkie ładowanie z Vercel Edge.</p>
                </div>
             </BentoBox>

          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 text-center relative z-10">
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-6"
         >
            <h2 className="text-5xl md:text-8xl font-heading font-black mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
              CLAIM YOUR VIBE.
            </h2>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <MousePointer2 size={24} /> GET STARTED FREE
            </Link>
         </motion.div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm relative z-10 bg-black">
         <p>DESIGNED FOR THE FUTURE. &copy; 2024 VIBELINK.</p>
      </footer>
    </main>
  );
}

// Komponent Bento Box (Pudełko)
function BentoBox({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-colors",
        className
      )}
    >
       {/* Glass effect overlay */}
       <div className="absolute inset-0 bg-white/0 hover:bg-white/[0.02] transition-colors pointer-events-none z-20" />
       {children}
    </motion.div>
  );
}