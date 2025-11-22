"use client";

import { useEffect, useState } from "react";
import { NeonLink } from "./NeonLink";
import { getYoutubeId, getSpotifyEmbedUrl } from "@/lib/utils";
import { themes, ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { getLatestVideoId } from "@/app/actions"; 
import { Loader2, Video, PlayCircle } from "lucide-react";

interface MediaBlockProps {
  id: number;
  title: string;
  url: string;
  type: string;
  icon?: any;
  themeName: ThemeKey;
  variant: string;
}

export function MediaBlock({ id, title, url, type, icon, themeName, variant }: MediaBlockProps) {
  const [dynamicVideoId, setDynamicVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pobieramy style motywu
  const themeConfig = themes[themeName] || themes.cyberpunk;
  // Ustalamy, którego wariantu użyć (pink/cyan)
  const variantKey = (variant === 'cyan' ? 'cyan' : 'pink') as keyof typeof themeConfig.variants;
  const styles = themeConfig.variants[variantKey];

  useEffect(() => {
    if (type === "youtube_latest" && url) {
      setLoading(true);
      getLatestVideoId(url)
        .then((vidId) => { if (vidId) setDynamicVideoId(vidId); })
        .finally(() => setLoading(false));
    }
  }, [type, url]);

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
            {/* ZMIANA: Używamy stylów motywu zamiast bg-red-600 */}
            <div className={cn(
                "p-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-md",
                styles.bg, // Tło z wariantu
                styles.text // Kolor tekstu z wariantu
            )}>
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
        {/* Spotify ma własne style iframe, ale ramka będzie pasować do motywu */}
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
      <h3 className={cn("text-center font-bold text-xl tracking-[0.2em] uppercase mt-8 mb-4 opacity-90 relative z-10", themeConfig.text)}>
        {title}
      </h3>
    );
  }

  // 5. LINK
  return (
    <NeonLink 
      href={url} 
      title={title} 
      icon={icon} 
      themeName={themeName} 
      variant={variant} 
    />
  );
}