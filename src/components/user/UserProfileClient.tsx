"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { MediaBlock } from "@/components/ui/MediaBlock";
import { SocialBar, SocialLinks } from "@/components/ui/SocialBar";
import { ThemeBackgrounds } from "@/components/ui/ThemeBackgrounds";
import { Github, Youtube, Instagram, Music, Link as LinkIcon, Twitter, Flame, Share2, Check } from "lucide-react";
import { themes, ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

// --- TYPY ---
const iconMap: Record<string, any> = {
  Youtube: Youtube, Music: Music, Instagram: Instagram, Github: Github, Twitter: Twitter, default: LinkIcon,
};

interface LinkItem {
  id: number; title: string; url: string; icon: string; variant: string; type: string;
}

interface Profile {
  username: string; bio: string; avatar_url: string; theme: string; socials: SocialLinks;
}

// --- ANIMACJE ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 } 
  },
};

// --- GŁÓWNY KOMPONENT KLIENTA ---
export default function UserProfileClient({ profile, links }: { profile: Profile, links: LinkItem[] }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeKey = (profile.theme as ThemeKey) || 'cyberpunk';
  const theme = themes[themeKey] || themes.cyberpunk;

  return (
    <main className={cn(
      "min-h-screen flex flex-col relative transition-colors duration-700 overflow-x-hidden",
      theme.bg, 
      theme.text
    )}>
      
      {/* TŁO I EFEKTY */}
      <ThemeBackgrounds theme={themeKey} />
      <div className={cn("fixed inset-0 pointer-events-none opacity-30 transition-all duration-1000", theme.gradient)} />
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />

      {/* PRZYCISK SHARE */}
      <button 
        onClick={handleShare}
        className={cn(
            "fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 shadow-lg",
            themeKey === 'minimal' ? "bg-black/5 border-black/10 text-black hover:bg-black/10" : "bg-white/10 border-white/10 text-white hover:bg-white/20"
        )}
      >
        {copied ? <Check size={20} /> : <Share2 size={20} />}
      </button>

      {/* TREŚĆ */}
      <div className="w-full max-w-md mx-auto z-10 flex-grow flex flex-col py-20 px-6 pb-32">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
            <ProfileHeader 
              username={profile.username}
              bio={profile.bio} 
              imageUrl={profile.avatar_url}
            />
            <SocialBar socials={profile.socials} themeName={themeKey} />
        </motion.div>

        {/* Linki */}
        <motion.div 
          className="flex flex-col gap-4 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {links && links.map((link) => {
            const IconComponent = iconMap[link.icon] || iconMap.default;
            return (
              <motion.div key={link.id} variants={itemVariants}>
                <MediaBlock 
                  id={link.id}
                  type={link.type || 'link'} 
                  title={link.title} 
                  url={link.url}
                  icon={<IconComponent />} 
                  themeName={themeKey} 
                  variant={link.variant} 
                />
              </motion.div>
            );
          })}

          {!links?.length && (
            <motion.div variants={itemVariants} className="text-center opacity-50 py-10 border-2 border-dashed border-current rounded-xl">
               <p>Jeszcze tu pusto...</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={cn(
        "w-full py-8 text-center z-20 backdrop-blur-md border-t mt-auto relative", 
        themeKey === 'minimal' ? "border-black/5 bg-white/50" : "border-white/5 bg-black/20",
        theme.footer
      )}>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 hover:opacity-100 transition-all hover:gap-3"
          >
            <Flame size={10} />
            VibeLink
          </a>
      </footer>

    </main>
  );
}