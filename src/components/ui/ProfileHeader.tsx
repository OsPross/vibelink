import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  username: string;
  bio?: string;
  imageUrl?: string; // Opcjonalny URL do zdjęcia (na razie użyjemy placeholder)
}

export const ProfileHeader = ({ username, bio, imageUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      {/* Kontener na Awatar z animowanym gradientem */}
      <div className="relative">
        {/* Rozmyta poświata pod spodem */}
        <div className="absolute -inset-1 rounded-full bg-vibe-gradient opacity-75 blur-md animate-pulse-fast"></div>
        
        {/* Właściwe zdjęcie/koło */}
        <div className="relative h-24 w-24 rounded-full bg-vibe-black border-2 border-white/10 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={username} className="h-full w-full object-cover" />
          ) : (
            // Placeholder jeśli brak zdjęcia
            <span className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-vibe-gradient">
              {username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Tekst */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-wider text-white">
          @{username}
        </h1>
        {bio && (
          <p className="text-gray-400 max-w-md text-sm md:text-base font-light">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};