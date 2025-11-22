"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, LogOut, LayoutDashboard, Loader2, Save, Palette, Settings, ChevronDown, ExternalLink, Activity, Link as LinkIcon, Youtube, Music, Type, Check, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "@/components/ui/SortableLink";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { themes, ThemeKey } from "@/lib/themes";
import { SocialLinks } from "@/components/ui/SocialBar";

interface LinkItem {
  id: number; title: string; url: string; icon: string; variant: string; position: number; type: string;
}

export default function AdminPage() {
  const router = useRouter();
  
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cyberpunk");
  const [socials, setSocials] = useState<SocialLinks>({});
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSocials, setShowSocials] = useState(false);
  
  // Feedback State
  const [reviewText, setReviewText] = useState("");
  const [sentReview, setSentReview] = useState(false);
  const [reviewError, setReviewError] = useState(""); // Błędy opinii

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("Youtube");
  const [newVariant, setNewVariant] = useState("pink");
  const [newType, setNewType] = useState("link");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      fetchLinks();
      const { data: profileData } = await supabase
        .from('profiles').select('avatar_url, bio, theme, socials, username').eq('id', user.id).single();
      if (profileData) {
        setAvatarUrl(profileData.avatar_url);
        setBio(profileData.bio || "");
        setCurrentTheme((profileData.theme as ThemeKey) || "cyberpunk");
        setSocials(profileData.socials || {});
        setUsername(profileData.username);
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

  const handleProfileSave = async () => {
    setSavingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({ bio, theme: currentTheme, socials, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (error) alert(error.message); else router.refresh();
    }
    setSavingProfile(false);
  };

  const handleAvatarUpdate = async (url: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ avatar_url: url, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (!error) { setAvatarUrl(url); router.refresh(); }
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => setSocials(prev => ({ ...prev, [key]: value }));

  // --- LOGIKA WYSYŁANIA OPINII ---
  const handleSendReview = async () => {
    if (!reviewText) return;
    setReviewError(""); // Reset błędów
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { error } = await supabase.from('reviews').insert({ user_id: user.id, content: reviewText, rating: 5 });
    
    if (error) {
        // Kod błędu 23505 oznacza naruszenie unikalności (czyli user już dodał opinię)
        if (error.code === '23505') {
            setReviewError("Możesz dodać tylko jedną opinię!");
        } else {
            setReviewError("Błąd wysyłania. Spróbuj później.");
        }
    } else {
        setSentReview(true);
        setReviewText("");
        setTimeout(() => setSentReview(false), 3000);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0;
    const { error } = await supabase.from("links").insert({
      title: newTitle, url: newUrl, icon: newIcon, variant: newVariant, position: newPosition, user_id: user.id, type: newType
    });
    if (!error) { setNewTitle(""); setNewUrl(""); fetchLinks(); } else { alert(error.message); }
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

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary"/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-brand-primary selection:text-white">
       <div className="bg-noise fixed inset-0 opacity-[0.03] pointer-events-none" />
       <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent opacity-50" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md"><LayoutDashboard size={20} className="text-brand-primary" /></div>
            <div>
                <h1 className="font-heading font-bold text-2xl tracking-tight text-white">Command Center</h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mt-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>SYSTEM ONLINE</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 hover:border-brand-primary/50 rounded-lg text-sm font-bold transition-all group">Live View <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/></a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-sm font-medium transition-all"><LogOut size={16} /> Logout</button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-zinc-500 text-xs font-bold uppercase tracking-widest"><Settings size={14} className="text-brand-primary"/> Identity</div>
              <div className="flex flex-col items-center mb-6"><AvatarUpload currentAvatarUrl={avatarUrl} onUploadComplete={handleAvatarUpdate} /></div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider ml-1">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:border-brand-primary/50 outline-none resize-none" rows={3} placeholder="Bio..."/>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider ml-1">Theme</label>
                    <div className="relative group">
                        <Palette className="absolute left-3 top-3 text-zinc-500 group-hover:text-brand-primary transition-colors" size={16}/>
                        <select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value as ThemeKey)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-8 text-sm text-white focus:border-brand-primary/50 outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all">
                            {Object.entries(themes).map(([key, value]) => (<option key={key} value={key} className="bg-[#09090b] text-white">{value.label}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="pt-2">
                    <button onClick={() => setShowSocials(!showSocials)} className="w-full flex items-center justify-between text-xs font-bold text-zinc-400 bg-white/5 border border-white/5 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors"><span>SOCIAL UPLINK</span><ChevronDown size={14} className={cn("transition-transform", showSocials && "rotate-180")} /></button>
                    {showSocials && (
                        <div className="mt-2 grid grid-cols-1 gap-2 p-2 bg-black/40 rounded-xl border border-white/5">
                            {['instagram', 'twitter', 'youtube', 'github', 'email', 'website'].map((social) => (
                                <input key={social} type="text" placeholder={`${social.charAt(0).toUpperCase() + social.slice(1)} URL`} value={socials[social as keyof SocialLinks] || ''} onChange={e => handleSocialChange(social as keyof SocialLinks, e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 outline-none focus:border-brand-primary/50" />
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={handleProfileSave} disabled={savingProfile} className="w-full py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg">{savingProfile ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} SAVE CONFIG</button>
              </div>
            </div>

            {/* SEKCJA FEEDBACKU (POPRAWIONA OBSŁUGA BŁĘDÓW) */}
            <div className="bg-[#09090b]/80 backdrop-blur-xl border border-brand-primary/10 rounded-3xl p-6">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-zinc-400 uppercase tracking-widest"><MessageSquare size={14}/> Feedback</h3>
                {sentReview ? (
                    <div className="text-green-400 text-xs font-bold bg-green-400/10 p-2 rounded text-center">Dziękujemy! Czekaj na akceptację.</div>
                ) : (
                    <>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 resize-none focus:border-brand-primary outline-none" rows={2} placeholder="Twoja opinia..."/>
                        {reviewError && <p className="text-red-400 text-[10px] mt-2">{reviewError}</p>}
                        <button onClick={handleSendReview} className="mt-2 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-lg transition-colors">Wyślij Opinię</button>
                    </>
                )}
            </div>

            <div className="bg-[#09090b]/80 backdrop-blur-xl border border-brand-primary/20 rounded-3xl p-6 shadow-2xl shadow-brand-primary/5 sticky top-6">
              <div className="flex items-center gap-2 mb-6 text-brand-primary text-xs font-bold uppercase tracking-widest"><Plus size={14}/> Content Injector</div>
              <form onSubmit={handleAddLink} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider ml-1">Block Type</label>
                    <div className="relative group">
                        <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-sm text-white focus:border-brand-primary/50 outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all">
                            <option value="link" className="bg-[#09090b]">🔗 Standard Link</option>
                            <option value="youtube" className="bg-[#09090b]">📺 YouTube Video</option>
                            <option value="youtube_latest" className="bg-[#09090b]">🔴 YouTube Channel (Latest)</option>
                            <option value="spotify" className="bg-[#09090b]">🎵 Spotify Player</option>
                            <option value="header" className="bg-[#09090b]">📌 Section Header</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="space-y-1"><input type="text" placeholder={newType === 'header' ? "Header Text" : "Title"} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary/50 text-white" /></div>
                {newType !== 'header' && <div className="space-y-1"><input type="url" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary/50 text-white" /></div>}
                {newType === 'link' && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider ml-1">Icon</label>
                            <div className="relative">
                                <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-xs outline-none text-zinc-300 appearance-none cursor-pointer">
                                    <option value="default" className="bg-[#09090b]">Link 🔗</option><option value="Youtube" className="bg-[#09090b]">Youtube</option><option value="Instagram" className="bg-[#09090b]">Instagram</option><option value="Twitter" className="bg-[#09090b]">Twitter</option><option value="Github" className="bg-[#09090b]">Github</option><option value="Music" className="bg-[#09090b]">Music</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider ml-1">Style</label>
                            <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 h-[42px]">
                                <button type="button" onClick={() => setNewVariant("pink")} className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", newVariant === "pink" ? "bg-white/10 text-brand-accent" : "text-zinc-600")}>Main</button>
                                <button type="button" onClick={() => setNewVariant("cyan")} className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", newVariant === "cyan" ? "bg-white/10 text-brand-primary" : "text-zinc-600")}>Alt</button>
                            </div>
                        </div>
                    </div>
                )}
                <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-2 flex items-center justify-center gap-2 text-sm"><Plus size={16} /> INJECT BLOCK</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4"><h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-green-500" /> Active Modules</h2><span className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-zinc-400 font-mono">COUNT: {links.length}</span></div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 pb-20">
                  {links.map((link) => <SortableLink key={link.id} link={link} theme={currentTheme} onDelete={handleDeleteLink} onToggleVariant={handleToggleVariant} />)}
                  {links.length === 0 && <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl text-zinc-600 bg-white/[0.01]"><LayoutDashboard size={48} className="mb-4 opacity-20"/><p>System Empty</p></div>}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}