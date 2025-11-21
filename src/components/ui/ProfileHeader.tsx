import { cn } from "@/lib/utils";
import { TypewriterBio } from "./TypewriterBio";

interface ProfileHeaderProps {
  username: string;
  bio?: string;
  imageUrl?: string;
}

export const ProfileHeader = ({ username, bio, imageUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      {/* Kontener na Awatar */}
      <div className="relative group">
        {/* TŁO AVATARA: Usunąłem 'bg-vibe-gradient' na sztywno. 
            Teraz używamy 'bg-current' z niskim opacity, żeby pasowało do każdego motywu */}
        <div className="absolute -inset-1 rounded-full bg-current opacity-20 blur-md animate-pulse-fast group-hover:opacity-40 transition-opacity duration-500"></div>
        
        {/* Właściwe zdjęcie */}
        <div className="relative h-24 w-24 rounded-full border-2 border-current overflow-hidden flex items-center justify-center z-10 bg-black/5">
          {imageUrl ? (
            <img src={imageUrl} alt={username} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-heading font-bold">
              {username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Tekst */}
      <div className="space-y-2 flex flex-col items-center w-full">
        {/* POPRAWKA TUTAJ: Usunąłem 'text-white' i 'drop-shadow'. 
            Teraz bierze kolor z rodzica (czyli z motywu). */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-wider opacity-90">
          @{username}
        </h1>
        
        {bio && (
           <TypewriterBio text={bio} speed={30} />
        )}
      </div>
    </div>
  );
}