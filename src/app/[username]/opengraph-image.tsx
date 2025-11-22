import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Konfiguracja obrazka
export const runtime = 'edge';
export const alt = 'VibeLink Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { username: string } }) {
  const username = params.username;

  // 1. Pobieramy dane użytkownika bezpośrednio w Edge Function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, bio, avatar_url')
    .eq('username', username)
    .single();

  // Fallbacki, jeśli coś pójdzie nie tak
  const displayName = profile?.username || username;
  const displayBio = profile?.bio || 'Sprawdź moje linki na VibeLink.';
  // Jeśli brak avatara, używamy Dicebear
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/9.x/dylan/svg?seed=${username}`;

  // 2. Rysujemy obrazek (HTML/CSS wewnątrz JS)
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b', // Ciemne tło
          backgroundImage: 'radial-gradient(circle at 50% 0%, #2e1065 0%, #09090b 50%)', // Fioletowa poświata
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Dekoracyjne kółka w tle */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: '#6366f1', filter: 'blur(150px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: '#ec4899', filter: 'blur(150px)', opacity: 0.3 }} />

        {/* Kontener Karty */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '40px',
            padding: '60px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            width: '80%',
          }}
        >
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={displayName}
            width="150"
            height="150"
            style={{
              borderRadius: '50%',
              border: '4px solid rgba(255,255,255,0.2)',
              marginBottom: '30px',
              objectFit: 'cover',
            }}
          />

          {/* Nazwa */}
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-2px', marginBottom: '10px' }}>
            @{displayName}
          </div>

          {/* Bio (przycięte) */}
          <div style={{ fontSize: 24, color: '#a1a1aa', textAlign: 'center', maxWidth: '600px', lineHeight: 1.4 }}>
            {displayBio.length > 80 ? displayBio.substring(0, 80) + '...' : displayBio}
          </div>
        </div>

        {/* Branding na dole */}
        <div style={{ position: 'absolute', bottom: '40px', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}>
           <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />
           <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '2px' }}>VIBELINK</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}