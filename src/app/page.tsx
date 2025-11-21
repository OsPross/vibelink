import { supabase } from "@/lib/supabase";
import { NeonLink } from "@/components/ui/NeonLink";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { Github, Youtube, Instagram, Music, Link as LinkIcon, Twitter } from "lucide-react";

// Mapa ikon: Zamienia tekst z bazy danych na komponent Reacta
const iconMap: Record<string, any> = {
  Youtube: Youtube,
  Music: Music,
  Instagram: Instagram,
  Github: Github,
  Twitter: Twitter,
  default: LinkIcon, // Domyślna ikona, jeśli nie znajdziemy pasującej
};

// Funkcja pobierająca dane (działa po stronie serwera - Server Component)
async function getLinks() {
  const { data: links, error } = await supabase
    .from('links')
    .select('*')
    // ZMIANA TUTAJ: sortujemy po 'position'
    .order('position', { ascending: true }); 

  if (error) {
    console.error('Błąd pobierania linków:', error);
    return [];
  }
  return links;
}

export default async function Home() {
  // Pobieramy dane z bazy
  const links = await getLinks();

  return (
    <main className="min-h-screen flex flex-col items-center py-20 px-4 relative overflow-hidden">
      
      {/* TŁO */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-vibe-glow-pink opacity-30 pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-vibe-glow-cyan opacity-30 pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        
        <ProfileHeader 
          username="CyberCreator"
          bio="Digital Artist | Pobrane z bazy danych Supabase."
        />

        {/* Lista Linków generowana dynamicznie */}
        <div className="flex flex-col gap-4">
          {links && links.map((link) => {
            // Dobieramy odpowiednią ikonę
            const IconComponent = iconMap[link.icon] || iconMap.default;

            return (
              <NeonLink 
                key={link.id}
                href={link.url} 
                title={link.title} 
                // Przekazujemy komponent ikony
                icon={<IconComponent />} 
                variant={link.variant === 'cyan' ? 'cyan' : 'pink'}
              />
            );
          })}

          {/* Fallback, jeśli baza jest pusta */}
          {(!links || links.length === 0) && (
            <p className="text-center text-gray-500">Brak linków w bazie danych.</p>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-gray-600">
          <p>POWERED BY VIBELINK & SUPABASE</p>
        </footer>

      </div>
    </main>
  );
}