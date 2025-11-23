import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { incrementProfileView } from "@/app/actions";
import UserProfileClient from "@/components/user/UserProfileClient"; // Importujemy komponent klienta

// --- KONFIGURACJA SERWERA ---
export const revalidate = 0; // Zawsze świeże dane (lub np. 60 dla cache)

// Funkcja pomocnicza do pobierania danych
async function getProfileData(username: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) return null;

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('position', { ascending: true });

  return { profile, links };
}

// --- 1. GENEROWANIE METADANYCH SEO ---
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  
  // Próbujemy pobrać dane, ale jeśli się nie uda, używamy samej nazwy
  const data = await getProfileData(username);
  const displayName = data?.profile?.username || username;
  const bio = data?.profile?.bio || `Zobacz profil użytkownika ${displayName} na VibeLink.`;

  return {
    title: `@${displayName}`, // Tytuł karty
    description: bio,         // Opis karty (bio użytkownika)
    
    // WAŻNE: Usuwamy ręczne definiowanie 'images'. 
    // Next.js SAM znajdzie plik opengraph-image.tsx w tym folderze i go podstawi.
    openGraph: {
      title: `@${displayName} | VibeLink`,
      description: bio,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `@${displayName} | VibeLink`,
      description: bio,
    }
  };
}

// --- 2. GŁÓWNY KOMPONENT STRONY (SERVER) ---
export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Pobierz dane na serwerze
  const data = await getProfileData(username);

  if (!data) {
    return notFound();
  }

  // Zlicz wyświetlenie (Server Action)
  incrementProfileView(username);

  // Wyrenderuj komponent klienta z gotowymi danymi (bez ładowania!)
  return <UserProfileClient profile={data.profile} links={data.links || []} />;
}