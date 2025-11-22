"use client";

import Link from "next/link";
import { ArrowRight, Zap, Palette, Smartphone, GripVertical, Lock, Globe, MousePointer2, Shield, LayoutGrid, TrendingUp, Users, Link2, Star, Quote, Flame } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ThemePreviewBox } from "@/components/landing/ThemePreviewBox";

// --- TYPY ---
interface Review {
  name: string;
  handle: string;
  role: string;
  text: string;
  avatar: string;
}

interface LandingPageProps {
  stats: { users: number; views: number };
  reviews: Review[];
}

// --- DANE ZASTĘPCZE (Gdy brak opinii w bazie) ---
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Alex Chen",
    handle: "@alexcodes",
    role: "Software Engineer",
    text: "Nareszcie link-in-bio, który nie wygląda jak tania lista zakupów. VibeLink to absolutny gamechanger dla mojego portfolio.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex"
  },
  {
    name: "Sarah Jenkins",
    handle: "@sarah_designs",
    role: "Digital Artist",
    text: "Możliwość dostosowania każdego elementu pod mój branding jest niesamowita. Motyw 'Midnight' pasuje idealnie do moich prac.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Mike Ross",
    handle: "@mike_gaming",
    role: "Streamer",
    text: "Widget z ostatnim filmem z YouTube działa bezbłędnie. Moi widzowie od razu widzą, co nowego wrzuciłem. Polecam!",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mike"
  }
];

export default function LandingPageUI({ stats, reviews }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  // Logika wyświetlania: Prawdziwe opinie LUB Fallback
  const displayReviews = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  const dynamicStats = [
    { label: "Active Creators", value: `${stats.users || 10}+`, icon: Users, color: "text-brand-primary" },
    { label: "Total Views", value: `${stats.views || 100}+`, icon: TrendingUp, color: "text-brand-secondary" },
    { label: "Links Created", value: "1000+", icon: Link2, color: "text-brand-accent" },
    { label: "Uptime SLA", value: "99.9%", icon: Shield, color: "text-green-400" },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-brand-primary selection:text-white relative font-sans">
      
      {/* PASEK POSTĘPU */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent origin-left z-[100]" style={{ scaleX }} />

      {/* TŁO */}
      <div className="bg-noise fixed inset-0 opacity-[0.04] pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-0 w-[800px] h-[800px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] right-0 w-[800px] h-[800px] bg-brand-secondary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed top-6 left-0 right-0 mx-auto z-50 flex items-center justify-between px-6 py-3 w-[95%] max-w-6xl backdrop-blur-xl bg-[#09090b]/60 border border-white/10 rounded-full shadow-2xl shadow-black/40"
      >
        <div className="text-lg font-bold tracking-wider flex items-center gap-2 cursor-default">
          <div className="w-2.5 h-2.5 bg-brand-primary rounded-full shadow-[0_0_15px_#6366f1]" /> VIBE<span className="text-white/40">LINK</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Funkcje</a>
            <a href="#stats" className="hover:text-white transition-colors">Liczby</a>
            <a href="#reviews" className="hover:text-white transition-colors">Opinie</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">Logowanie</Link>
          <Link href="/login?mode=register" className="px-5 py-2.5 bg-white text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg shadow-white/10 flex items-center gap-2">Start Free <ArrowRight size={12} /></Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div style={{ y: y2 }} className="space-y-8 text-center lg:text-left relative z-20">
            <motion.div initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter">
                LINK IN BIO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">REIMAGINED.</span>
              </h1>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Twój cyfrowy identyfikator. Futurystyczny, szybki i w pełni konfigurowalny. Zbudowany dla twórców, którzy wymagają więcej.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/login?mode=register" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-brand-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 mix-blend-multiply" />
                <span className="relative flex items-center gap-2">ROZPOCZNIJ TERAZ <ArrowRight size={18} /></span>
              </Link>
              <Link href="/demo" className="px-8 py-4 border border-white/10 text-zinc-300 font-bold rounded-full hover:bg-white/5 hover:text-white transition-colors">DEMO LIVE</Link>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: y1 }} className="relative flex justify-center z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />
             <div className="relative w-[300px] h-[600px] lg:w-[340px] lg:h-[680px] bg-[#09090b] rounded-[3rem] border-[8px] border-[#27272a] shadow-2xl overflow-hidden ring-1 ring-white/10 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)]">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-30 flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" /> <div className="w-16 h-2 rounded-full bg-[#050505] border border-white/10" />
                </div>
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center pt-16 px-6 relative">
                   <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none" />
                   <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-24 h-24 rounded-full border-2 border-brand-primary p-1 mb-4 relative z-10 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                      <div className="w-full h-full bg-zinc-800 rounded-full overflow-hidden"><img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" alt="avatar" className="w-full h-full" /></div>
                   </motion.div>
                   <div className="text-xl font-bold text-white">@cyber_user</div>
                   <div className="text-zinc-500 text-xs mb-8">Digital Artist</div>
                   <div className="w-full space-y-3 relative z-10">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div key={i} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + (i * 0.1) }} className="w-full h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center px-4 hover:bg-white/10 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary opacity-80 group-hover:scale-110 transition-transform" />
                          <div className="ml-4 h-2 w-24 bg-white/20 rounded-full" />
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>
             <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 -right-10 w-20 h-20 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl z-20 shadow-2xl flex items-center justify-center"><Palette className="text-brand-accent w-10 h-10 drop-shadow-lg" /></motion.div>
             <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-40 -left-10 lg:-left-20 w-16 h-16 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl z-20 shadow-2xl flex items-center justify-center"><Zap className="text-brand-primary w-8 h-8 drop-shadow-lg" /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATYSTYKI --- */}
      <section id="stats" className="relative z-10 py-20 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {dynamicStats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center space-y-2">
                        <div className="flex justify-center mb-4"><div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10", stat.color)}><stat.icon size={24} /></div></div>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">{stat.value}</h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- BENTO GRID --- */}
      <section id="features" className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <div className="mb-24 md:text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Designed for the <span className="text-brand-primary">new web</span>.</h2>
          <p className="text-zinc-400 text-xl">Każdy piksel został zaprojektowany z myślą o szybkości i estetyce.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ThemePreviewBox className="col-span-full lg:col-span-2 min-h-[500px] lg:min-h-[600px] bg-white/5 backdrop-blur-xl" />
          <BentoBox className="lg:col-span-1 min-h-[500px] lg:min-h-[600px] flex flex-col justify-between p-8 text-center">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10"><div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 mb-6 mx-auto"><LayoutGrid className="text-white" size={24} /></div><h3 className="text-2xl font-bold text-white mb-2">Bento Grids</h3><p className="text-zinc-400 text-sm mb-8">Automatyczny układ kafelków.</p></div>
             <div className="w-full grid grid-cols-2 gap-3 opacity-50 group-hover:opacity-80 transition-opacity h-[220px]"><div className="bg-white/10 rounded-xl h-full w-full" /><div className="bg-white/5 rounded-xl h-full w-full" /><div className="col-span-2 bg-white/5 rounded-xl h-20" /><div className="bg-white/5 rounded-xl h-full w-full" /><div className="bg-brand-primary/20 rounded-xl h-full w-full" /></div>
          </BentoBox>
          <BentoBox className="min-h-[300px] p-8 flex flex-col justify-center"><div className="flex items-center justify-between mb-4"><Zap className="text-yellow-400 fill-yellow-400/20" size={32} /><span className="text-3xl font-bold text-white">99<span className="text-lg text-zinc-500">%</span></span></div><h3 className="text-xl font-bold text-white">Blazing Fast</h3><p className="text-zinc-400 text-sm mt-2">Statyczny rendering (SSG).</p></BentoBox>
          <BentoBox className="min-h-[300px] p-8 flex flex-col justify-center relative overflow-hidden"><Smartphone className="text-white mb-4 relative z-10" size={32} /><h3 className="text-xl font-bold text-white relative z-10">Mobile Native</h3><p className="text-zinc-400 text-sm mt-2 relative z-10">Idealne dopasowanie do kciuka.</p><div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" /></BentoBox>
          <BentoBox className="bg-[#0a0a0a] overflow-hidden min-h-[300px]"><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Lock className="w-[180px] h-[180px] text-white/[0.03] rotate-12" /></div><div className="relative z-10 h-full p-8 flex flex-col justify-end"><Shield className="w-8 h-8 text-green-400 mb-4" /><h3 className="text-xl font-bold text-white">Secure by Default</h3><p className="text-zinc-500 text-sm">Enterprise-grade security.</p></div></BentoBox>
          <BentoBox className="col-span-full md:col-span-2 lg:col-span-3 min-h-[250px] bg-gradient-to-t from-brand-secondary/10 to-[#0a0a0a] p-8 flex flex-col items-center justify-center text-center"><Globe className="w-16 h-16 text-brand-secondary animate-spin-slow mb-4 opacity-80" /><h3 className="text-xl font-bold text-white">Global Edge Network</h3><p className="text-zinc-500 text-sm max-w-md mt-2">Vercel Edge Network na całym świecie.</p></BentoBox>
        </div>
      </section>

      {/* --- REVIEWS (OPINIE) --- */}
      <section id="reviews" className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by <span className="text-brand-accent">Creators</span></h2>
            <p className="text-zinc-400">Dołącz do tysięcy twórców budujących swoją markę z VibeLink.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Renderujemy prawdziwe opinie lub fallback */}
            {displayReviews.map((review, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="web3-card p-8 rounded-3xl relative group hover:border-white/20 transition-colors"
                >
                    <Quote className="absolute top-6 right-6 text-white/10 group-hover:text-brand-primary/20 transition-colors" size={40} />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{review.name}</h4>
                            <p className="text-xs text-zinc-500">{review.role || 'Creator'}</p>
                        </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-sm italic">"{review.text}"</p>
                    <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-yellow-500 text-yellow-500" />)}
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-40 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary/10 pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight">Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">upgrade?</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login?mode=register" className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] flex items-center gap-2"><MousePointer2 size={24} />Rozpocznij za darmo</Link>
          </div>
          <p className="mt-8 text-zinc-500">Nie wymagamy karty kredytowej. Anuluj w każdej chwili.</p>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold tracking-wider mb-4 flex items-center gap-2"><div className="w-3 h-3 bg-brand-primary rounded-full" /> VIBE</div>
            <p className="text-zinc-500 text-sm leading-relaxed">The ultimate link-in-bio platform for next-gen creators.</p>
          </div>
          <div><h4 className="font-bold text-white mb-6">Produkt</h4><ul className="space-y-4 text-sm text-zinc-400"><li><a href="#features" className="hover:text-white transition-colors">Funkcje</a></li><li><a href="/demo" className="hover:text-white transition-colors">Live Demo</a></li><li><a href="#" className="hover:text-white transition-colors">Cennik</a></li></ul></div>
          <div><h4 className="font-bold text-white mb-6">Firma</h4><ul className="space-y-4 text-sm text-zinc-400"><li><a href="#" className="hover:text-white transition-colors">O nas</a></li><li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li></ul></div>
          <div><h4 className="font-bold text-white mb-6">Legal</h4><ul className="space-y-4 text-sm text-zinc-400"><li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li><li><a href="#" className="hover:text-white transition-colors">Terms</a></li></ul></div>
        </div>
        <div className="text-center border-t border-white/5 pt-8 text-zinc-600 text-sm">© 2025 VibeLink Inc. All rights reserved.</div>
      </footer>
    </main>
  );
}

function BentoBox({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-50px" }} transition={{ duration: 0.5 }} className={cn("relative rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-colors web3-card h-full", className)}>
       <div className="absolute inset-0 bg-white/0 hover:bg-white/[0.02] transition-colors pointer-events-none z-20" />
       {children}
    </motion.div>
  );
}