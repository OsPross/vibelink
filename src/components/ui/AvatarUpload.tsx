"use client";

import { useState, useRef } from "react"; // Dodaliśmy useRef
import { createBrowserClient } from "@supabase/ssr";
import { Upload, Loader2, User } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Referencja do inputa

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return; // Po prostu wyjdź, jeśli anulowano
      }

      const file = event.target.files[0];
      // Dodajemy timestamp do nazwy pliku, żeby przeglądarka nie cache'owała starego zdjęcia
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Wyślij plik
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Pobierz URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      // 3. Zwróć URL
      onUploadComplete(data.publicUrl);

    } catch (error: any) {
      alert("Błąd uploadu: " + error.message);
    } finally {
      setUploading(false);
      // RESETOWANIE INPUTA - Kluczowe, żeby można było wybrać ten sam plik ponownie
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-vibe-dark-gray/50 rounded-xl border border-white/10">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-neon-pink bg-black flex items-center justify-center relative">
          {currentAvatarUrl ? (
            <img 
              // Dodajemy klucz, żeby wymusić przerysowanie przy zmianie URL
              key={currentAvatarUrl} 
              src={currentAvatarUrl} 
              alt="Avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <User className="h-10 w-10 text-gray-500" />
          )}
          
          {/* Overlay ładowania */}
          {uploading && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
               <Loader2 className="h-8 w-8 text-neon-pink animate-spin" />
             </div>
          )}
        </div>

        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full z-10">
          <Upload className="h-6 w-6 text-white" />
          <input
            ref={fileInputRef} // Podpinamy ref
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500">
        {uploading ? "Wysyłanie..." : "Kliknij zdjęcie, aby zmienić"}
      </p>
    </div>
  );
}