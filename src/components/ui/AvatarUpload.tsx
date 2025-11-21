"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, Loader2, User, Camera } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      onUploadComplete(data.publicUrl);

    } catch (error: any) {
      alert("Błąd uploadu: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className="relative group cursor-pointer">
        {/* Gradientowa ramka */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center">
          {currentAvatarUrl ? (
            <img key={currentAvatarUrl} src={currentAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-zinc-600" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             {uploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
          </div>
        </div>

        <label className="absolute inset-0 cursor-pointer">
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white">Profile Photo</h3>
        <p className="text-xs text-zinc-400 mt-1">Kliknij w kółko, aby zmienić zdjęcie (max 2MB).</p>
      </div>
    </div>
  );
}