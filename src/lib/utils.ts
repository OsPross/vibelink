import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper do wyciągania ID ze Spotify (track/album/playlist)
export function getSpotifyEmbedUrl(url: string) {
  // Zamienia zwykły link na link do embeda
  // np. https://open.spotify.com/track/XYZ -> https://open.spotify.com/embed/track/XYZ
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'open.spotify.com') {
      return `https://open.spotify.com/embed${urlObj.pathname}`;
    }
    return null;
  } catch (e) {
    return null;
  }
}