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
  const data = await getProfileData(username);

  if (!data) return { title: 'Profil nie znaleziony' };

  const title = `@${data.profile.username} | VibeLink`;
  const description = data.profile.bio || `Zobacz linki użytkownika ${data.profile.username}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [`/api/og?username=${username}`], // Możemy tu podpiąć dynamiczny generator obrazków
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
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