"use server";

import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache"; // IMPORT DO WYŁĄCZANIA CACHE

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Zliczanie wejścia na profil
export async function incrementProfileView(username: string) {
  try {
    const { error } = await supabase.rpc('increment_views', { profile_username: username });
    if (error) console.error("RPC Error:", error);
  } catch (e) {
    console.error("Błąd licznika:", e);
  }
}

// 2. Pobieranie statystyk
export async function getLandingStats() {
  noStore(); // <--- WAŻNE: Wyłącza cache dla tej funkcji (zawsze świeże dane)
  
  const { count: profilesCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { data: totalViews } = await supabase.rpc('get_total_views');
  
  const views = totalViews || (profilesCount || 0) * 15; 

  return {
    users: profilesCount || 0,
    views: views
  };
}

// 3. Pobieranie opinii (NAPRAWIONE)
export async function getReviews() {
  noStore(); // <--- WAŻNE: Zawsze pobieraj świeże opinie z bazy
  
  const { data, error } = await supabase
    .from('reviews')
    .select('content, rating, profiles(full_name, username, avatar_url)')
    .eq('is_approved', true) // Tylko zatwierdzone
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (error) {
    console.error("Błąd pobierania opinii:", error);
    return [];
  }

  return data;
}

// 4. Youtube Fetcher
export async function getLatestVideoId(channelUrl: string): Promise<string | null> {
  try {
    if (!channelUrl.includes("youtube.com")) return null;
    let channelId = "";
    if (channelUrl.includes("/channel/")) {
      const parts = channelUrl.split("/channel/");
      channelId = parts[1]?.split("/")[0]?.split("?")[0];
    } else {
      const response = await fetch(channelUrl, { cache: 'no-store' });
      const html = await response.text();
      const match = html.match(/<meta itemprop="identifier" content="(UC[\w-]+)"/);
      if (match && match[1]) channelId = match[1];
    }
    if (!channelId.startsWith("UC")) return null;
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssResponse = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xml = await rssResponse.text();
    const videoMatch = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    if (videoMatch && videoMatch[1]) return videoMatch[1];
    return null;
  } catch (error) {
    return null;
  }
}