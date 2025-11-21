"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, LogOut, LayoutDashboard, Loader2, Save, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "@/components/ui/SortableLink";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { themes, ThemeKey } from "@/lib/themes";

interface LinkItem {
  id: number; title: string; url: string; icon: string; variant: string; position: number;
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
  const [newVariant, setNewVariant] = useState("pink");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // --- DATA FETCHING ---
  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      fetchLinks();
      const { data: profileData } = await supabase.from('profiles').select('avatar_url, bio, theme').eq('id', user.id).single();
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
    const { data } = await supabase.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true });
    if (data) setLinks(data);
  };

  // --- HANDLERS ---
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
      const { error } = await supabase.from('profiles').update({ bio, theme: currentTheme, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (error) alert(error.message); else router.refresh();
    }
    setSavingProfile(false);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0;
    const { error } = await supabase.from("links").insert({
      title: newTitle, url: newUrl, icon: newIcon, position: newPosition, user_id: user.id, variant: newVariant
    });
    if (!error) { setNewTitle(""); setNewUrl(""); fetchLinks(); }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm("Usunąć?")) return;
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  const handleToggleVariant = async (id: number, currentVariant: string) => {
    const newVar = currentVariant === 'cyan' ? 'pink' : 'cyan';
    setLinks(links.map(l => l.id === id ? { ...l, variant: newVar } : l));
    await supabase.from('links').update({ variant: newVar }).eq('id', id);
  };

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

  if (loading) return <div className="min-h-screen bg-vibe-black flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary"/></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 font-sans selection:bg-brand-primary selection:text-white">
       <div className="bg-noise fixed inset-0 opacity-[0.04] pointer-events-none" />
       <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="web3-card rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <LayoutDashboard size={16} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm font-medium transition-colors px-3 py-2 hover:bg-white/5 rounded-lg">
            <LogOut size={16} /> Wyloguj
          </button>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* LEWA KOLUMNA: USTAWIENIA (Szerokość 4/12) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* PROFIL & MOTYW */}
            <div className="web3-card p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 mb-2">
                 <Settings size={18} className="text-brand-primary"/>
                 <h2 className="font-bold text-lg">Profile Settings</h2>
              </div>
              
              <AvatarUpload currentAvatarUrl={avatarUrl} onUploadComplete={handleAvatarUpdate} />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Bio / Opis</label>
                <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none resize-none transition-all" 
                    rows={3}
                    placeholder="Tell your story..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                   Theme Style
                </label>
                <div className="relative">
                    <Palette className="absolute left-3 top-3 text-zinc-500" size={16}/>
                    <select 
                        value={currentTheme} 
                        onChange={(e) => setCurrentTheme(e.target.value as ThemeKey)} 
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-brand-primary outline-none appearance-none cursor-pointer"
                    >
                        {Object.entries(themes).map(([key, value]) => (<option key={key} value={key} className="bg-zinc-900">{value.label}</option>))}
                    </select>
                </div>
              </div>

              <button 
                onClick={handleProfileSave} 
                disabled={savingProfile} 
                className="w-full py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
              >
                {savingProfile ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />} 
                Save Changes
              </button>
            </div>

            {/* DODAWANIE LINKU */}
            <div className="web3-card p-6 rounded-3xl sticky top-6 border-t-4 border-t-brand-primary/50">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Plus className="text-brand-primary" size={20}/> Add New Link
              </h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input type="text" placeholder="Tytuł linku" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary transition-all" />
                <input type="url" placeholder="https://..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary transition-all" />
                
                <div className="grid grid-cols-2 gap-3">
                    <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm outline-none text-zinc-300">
                        <option value="Youtube">Youtube</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Github">Github</option>
                        <option value="Music">Music</option>
                        <option value="default">Link</option>
                    </select>
                    <div className="flex bg-black/20 border border-white/10 rounded-xl p-1">
                        <button type="button" onClick={() => setNewVariant("pink")} className={cn("flex-1 rounded-lg text-xs font-bold transition-all", newVariant === "pink" ? "bg-white/10 text-brand-accent" : "text-zinc-500")}>Main</button>
                        <button type="button" onClick={() => setNewVariant("cyan")} className={cn("flex-1 rounded-lg text-xs font-bold transition-all", newVariant === "cyan" ? "bg-white/10 text-brand-primary" : "text-zinc-500")}>Alt</button>
                    </div>
                </div>

                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-primary/20">
                    Add to Profile
                </button>
              </form>
            </div>
          </div>

          {/* PRAWA KOLUMNA: LISTA (Szerokość 8/12) */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Active Links</h2>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400">{links.length} items</span>
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 pb-20">
                  {links.map((link) => (
                    <SortableLink 
                        key={link.id} 
                        link={link} 
                        theme={currentTheme} 
                        onDelete={handleDeleteLink} 
                        onToggleVariant={handleToggleVariant} 
                    />
                  ))}
                  {links.length === 0 && (
                      <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl text-zinc-500">
                          <p>No links yet.</p>
                          <p className="text-sm mt-1">Add one from the left panel.</p>
                      </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}