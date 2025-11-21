"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, LogOut, LayoutDashboard, Loader2, Save, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "@/components/ui/SortableLink";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { themes, ThemeKey } from "@/lib/themes"; 

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  variant: string;
  position: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cyberpunk"); 
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [loading, setLoading] = useState(true);
  
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("Youtube");
  // Domyślnie dodajemy jako wariant 1 (pink), ale użytkownik może zmienić w formularzu
  const [newVariant, setNewVariant] = useState("pink"); 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // FETCH DATA
  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      fetchLinks();
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar_url, bio, theme') 
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setAvatarUrl(profileData.avatar_url);
        setBio(profileData.bio || "");
        setCurrentTheme((profileData.theme as ThemeKey) || "cyberpunk");
      }
      setLoading(false);
    };
    initData();
  }, []);

  const fetchLinks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });
    if (data) setLinks(data);
  };

  // PROFILE ACTIONS
  const handleAvatarUpdate = async (url: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ avatar_url: url, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (!error) { setAvatarUrl(url); router.refresh(); }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: bio, theme: currentTheme, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) alert("Błąd: " + error.message);
      else router.refresh();
    }
    setSavingProfile(false);
  };

  // LINK ACTIONS
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0;
    
    const { error } = await supabase.from("links").insert({
      title: newTitle, url: newUrl, icon: newIcon, position: newPosition, user_id: user.id, 
      variant: newVariant // <--- Zapisujemy wybrany w formularzu wariant
    });
    
    if (!error) { setNewTitle(""); setNewUrl(""); fetchLinks(); }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm("Usunąć?")) return;
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  // NOWA FUNKCJA: Zmiana wariantu (koloru) po kliknięciu w pasek
  const handleToggleVariant = async (id: number, currentVariant: string) => {
    const newVar = currentVariant === 'cyan' ? 'pink' : 'cyan';
    
    // 1. Optimistic UI Update (żeby było widać od razu)
    setLinks(links.map(l => l.id === id ? { ...l, variant: newVar } : l));

    // 2. Update DB
    await supabase.from('links').update({ variant: newVar }).eq('id', id);
  };

  // DRAG & DROP
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        updatePositionsInDb(newItems);
        return newItems;
      });
    }
  };
  const updatePositionsInDb = async (items: LinkItem[]) => {
    for (const [index, item] of items.entries()) await supabase.from('links').update({ position: index }).eq('id', item.id);
  };
  
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  if (loading) return <div className="min-h-screen bg-vibe-black flex items-center justify-center text-neon-pink"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-vibe-black text-white p-4 md:p-8 relative">
       <div className="fixed top-0 left-0 w-full h-2 bg-vibe-gradient" />
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-8 border-b border-white/10">
          <div className="flex items-center gap-3"><LayoutDashboard className="text-neon-pink" /><h1 className="font-heading text-2xl font-bold">ADMIN PANEL</h1></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm uppercase"><LogOut size={16} /> Wyloguj</button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEWA KOLUMNA */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-vibe-dark-gray p-6 rounded-xl border border-white/10 space-y-6">
              <h2 className="text-neon-pink font-bold flex items-center gap-2">YOUR PROFILE</h2>
              <AvatarUpload currentAvatarUrl={avatarUrl} onUploadComplete={handleAvatarUpdate} />
              
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm text-gray-300 focus:border-neon-pink outline-none resize-none" rows={3}/>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2"><Palette size={12}/> Theme</label>
                <select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value as ThemeKey)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm text-white focus:border-neon-pink outline-none">
                    {Object.entries(themes).map(([key, value]) => (<option key={key} value={key}>{value.label}</option>))}
                </select>
              </div>
              <button onClick={handleProfileSave} disabled={savingProfile} className="w-full py-2 bg-white/5 border border-white/10 rounded text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                {savingProfile ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} ZAPISZ ZMIANY
              </button>
            </div>

            {/* DODAWANIE LINKU */}
            <div className="bg-vibe-dark-gray p-6 rounded-xl border border-white/10 sticky top-8">
              <h2 className="text-neon-cyan font-bold mb-4 flex items-center gap-2"><Plus size={18} /> NEW LINK</h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input type="text" placeholder="Tytuł" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm outline-none focus:border-neon-pink" />
                <input type="url" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm outline-none focus:border-neon-pink" />
                <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm outline-none text-gray-300">
                    <option value="Youtube">Youtube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Github">Github</option>
                    <option value="Music">Music</option>
                    <option value="default">Link</option>
                </select>
                
                {/* WYBÓR WARIANTU (KOLORU) */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Kolor początkowy</label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setNewVariant("pink")} className={cn("flex-1 py-2 rounded border text-xs font-bold transition-all", newVariant === "pink" ? "bg-neon-pink/20 border-neon-pink text-neon-pink" : "border-white/10 text-gray-500")}>1 (Pink/Main)</button>
                        <button type="button" onClick={() => setNewVariant("cyan")} className={cn("flex-1 py-2 rounded border text-xs font-bold transition-all", newVariant === "cyan" ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "border-white/10 text-gray-500")}>2 (Cyan/Alt)</button>
                    </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 mt-2">DODAJ LINK</button>
              </form>
            </div>
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-gray-400 text-sm tracking-widest mb-4">
                LINKS ({currentTheme.toUpperCase()} THEME PREVIEW)
            </h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {links.map((link) => (
                    <SortableLink 
                        key={link.id} 
                        link={link} 
                        theme={currentTheme} // Przekazujemy motyw do podglądu
                        onDelete={handleDeleteLink} 
                        onToggleVariant={handleToggleVariant} // Przekazujemy funkcję zmiany koloru
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}