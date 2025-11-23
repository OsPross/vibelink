"use client";

import { useEffect, useState } from "react";
import { NeonLink } from "./NeonLink";
import { getYoutubeId, getSpotifyEmbedUrl } from "@/lib/utils";
import { ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { getLatestVideoId } from "@/app/actions"; 
import { Loader2, Video, Lock, Unlock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaBlockProps {
  id: number;
  title: string;
  url: string;
  type: string;
  icon?: any;
  themeName: ThemeKey;
  variant: string;
  password?: string; // Nowe pole
}

export function MediaBlock({ id, title, url, type, icon, themeName, variant, password }: MediaBlockProps) {
  const [dynamicVideoId, setDynamicVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Stany dla Secret Link
  const [isLocked, setIsLocked] = useState(type === 'locked');
  const [inputPassword, setInputPassword] = useState("");
  const [shake, setShake] = useState(false);

  // Pobieramy style motywu
  const styles = {
      // Prosty fallback do kolorów jeśli motyw nie jest w pełni załadowany
      text: themeName === 'minimal' ? 'text-black' : 'text-white',
      border: themeName === 'minimal' ? 'border-black' : 'border-white/20',
      bg: themeName === 'minimal' ? 'bg-gray-100' : 'bg-black/40'
  };

  useEffect(() => {
    if (type === "youtube_latest" && url) {
      setLoading(true);
      getLatestVideoId(url)
        .then((vidId) => { if (vidId) setDynamicVideoId(vidId); })
        .finally(() => setLoading(false));
    }
  }, [type, url]);

  // --- LOGIKA SECRET LINK ---
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === password) {
        setIsLocked(false);
    } else {
        setShake(true);
        setTimeout(() => setShake(false), 500); // Reset trzęsienia
        setInputPassword("");
    }
  };

  // 0. SECRET LINK (LOCKED STATE)
  if (isLocked && type === 'locked') {
      return (
        <motion.div 
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={cn(
                "w-full rounded-2xl overflow-hidden shadow-2xl mb-4 group relative z-10 border p-6 flex flex-col items-center justify-center gap-4 text-center transition-colors",
                "border-red-500/50 bg-red-950/10 backdrop-blur-md" // Wygląd "Access Denied"
            )}
        >
            <div className="p-3 rounded-full bg-red-500/20 text-red-500 animate-pulse">
                <Lock size={24} />
            </div>
            <div>
                <h3 className="font-bold text-red-500 uppercase tracking-widest text-sm">Encrypted Content</h3>
                <p className="text-xs text-red-400/70 mt-1">Wpisz hasło, aby odblokować.</p>
            </div>
            
            <form onSubmit={handleUnlock} className="flex w-full max-w-[200px] relative">
                <input 
                    type="password" 
                    placeholder="ACCESS CODE" 
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full bg-black/50 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-white text-center tracking-widest focus:border-red-500 outline-none placeholder:text-red-500/30"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 px-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded text-[10px] transition-colors">
                    <ArrowRight size={12} />
                </button>
            </form>
        </motion.div>
      );
  }

  // 1. YOUTUBE (Specific Video)
  if (type === "youtube") {
    const videoId = getYoutubeId(url);
    if (!videoId) return null;

    return (
      <div className={cn("w-full rounded-2xl overflow-hidden shadow-2xl mb-4 group relative z-10 border", styles.border)}>
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className={cn("p-3 text-sm font-bold text-center backdrop-blur-xl", styles.bg, styles.text)}>
          {title}
        </div>
      </div>
    );
  }

  // 2. YOUTUBE CHANNEL (Latest)
  if (type === "youtube_latest") {
    return (
      <div className={cn("w-full rounded-2xl overflow-hidden shadow-2xl mb-4 group relative z-10 min-h-[200px] border", styles.border, styles.bg)}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-2">
            <Loader2 className={cn("animate-spin", styles.text)} />
            <span className={cn("text-xs opacity-70", styles.text)}>Szukam filmu...</span>
          </div>
        ) : dynamicVideoId ? (
          <>
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${dynamicVideoId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="p-3 bg-black/50 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-md">
               <Video size={14} /> LATEST VIDEO
            </div>
          </>
        ) : (
          <div className={cn("flex items-center justify-center h-[200px] text-sm p-4 text-center opacity-60", styles.text)}>
            Nie znaleziono filmu.
          </div>
        )}
      </div>
    );
  }

  // 3. SPOTIFY
  if (type === "spotify") {
    const embedUrl = getSpotifyEmbedUrl(url);
    if (!embedUrl) return null;

    return (
      <div className={cn("w-full mb-4 overflow-hidden rounded-2xl shadow-lg border relative z-10", styles.border)}>
        <iframe 
            src={embedUrl} 
            width="100%" 
            height="152" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy" 
            className="bg-transparent"
        />
      </div>
    );
  }

  // 4. HEADER
  if (type === "header") {
    return (
      <h3 className={cn("text-center font-bold text-xl tracking-[0.2em] uppercase mt-8 mb-4 opacity-90 relative z-10", styles.text)}>
        {title}
      </h3>
    );
  }

  // 5. ZWYKŁY LINK (LUB ODBLOKOWANY SECRET LINK)
  return (
    <motion.div
        initial={type === 'locked' ? { opacity: 0, scale: 0.8 } : {}}
        animate={type === 'locked' ? { opacity: 1, scale: 1 } : {}}
    >
        <NeonLink 
        id={id}
        href={url} 
        title={title} 
        icon={type === 'locked' ? <Unlock /> : icon} // Jeśli odblokowany, pokaż otwartą kłódkę
        themeName={themeName} 
        variant={variant} 
        />
        {type === 'locked' && (
            <p className="text-center text-[10px] text-green-500 uppercase tracking-widest mt-1 animate-pulse">Access Granted</p>
        )}
    </motion.div>
  );
}