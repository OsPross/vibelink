import { supabase } from "@/lib/supabase";
import { NeonLink } from "@/components/ui/NeonLink";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { Github, Youtube, Instagram, Music, Link as LinkIcon, Twitter, Flame } from "lucide-react";
import { notFound } from "next/navigation";
import { themes, ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Youtube: Youtube, Music: Music, Instagram: Instagram, Github: Github, Twitter: Twitter, default: LinkIcon,
};

async function getData(username: string) {
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
  if (!profile) return null;
  const { data: links } = await supabase.from('links').select('*').eq('user_id', profile.id).order('position', { ascending: true });
  return { profile, links };
}

interface Props { params: Promise<{ username: string }>; }

export default async function UserProfile({ params }: Props) {
  const { username } = await params;
  const data = await getData(username);
  if (!data) return notFound();

  const { profile, links } = data;
  const themeKey = (profile.theme as ThemeKey) || 'cyberpunk';
  const theme = themes[themeKey] || themes.cyberpunk;

  return (
    // 1. min-h-screen i flex-col zapewnia, że stopka jest na dole
    <main className={cn(
      "min-h-screen flex flex-col relative transition-colors duration-700 overflow-x-hidden",
      theme.bg, 
      theme.text
    )}>
      
      {/* Główna treść - flex-grow wypycha stopkę, pb-32 (padding bottom) zabezpiecza przed najechaniem na stopkę */}
      <div className="w-full max-w-md mx-auto z-10 flex-grow flex flex-col py-16 px-4 pb-32">
        
        <ProfileHeader 
          username={profile.username}
          bio={profile.bio} 
          imageUrl={profile.avatar_url}
        />

        <div className="flex flex-col gap-4 mt-6">
          {links && links.map((link) => {
            const IconComponent = iconMap[link.icon] || iconMap.default;
            return (
              <NeonLink 
                key={link.id}
                href={link.url} 
                title={link.title} 
                icon={<IconComponent />} 
                themeName={themeKey} 
                variant={link.variant} 
              />
            );
          })}

          {!links?.length && (
            <div className="text-center opacity-50 py-10 border-2 border-dashed border-white/10 rounded-xl">
               <p>User offline.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - zawsze na dole, z tłem blur żeby był czytelny */}
      <footer className={cn(
        "w-full py-6 text-center z-20 backdrop-blur-sm border-t border-white/5 mt-auto relative", 
        theme.footer
      )}>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold opacity-70 hover:opacity-100 transition-all hover:tracking-[0.35em]"
          >
            <Flame size={12} />
            VibeLink
          </a>
      </footer>

    </main>
  );
}