"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Plus, LogOut, LayoutDashboard, Loader2, Save, Palette, Settings, ChevronDown,
  ExternalLink, Activity, Link as LinkIcon, Youtube, Music, Type, Check,
  MessageSquare, Lock, MousePointerClick, Eye, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "@/components/ui/SortableLink";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { EditLinkModal } from "@/components/admin/EditLinkModal";
import { themes, ThemeKey } from "@/lib/themes";
import { SocialLinks } from "@/components/ui/SocialBar";
import { AnimatePresence, motion } from "framer-motion";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  variant: string;
  position: number;
  type: string;
  link_password?: string;
  clicks?: number;
}

export default function AdminPage() {
  const router = useRouter();

  // --- STANY ---
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cyberpunk");
  const [socials, setSocials] = useState<SocialLinks>({});
  const [profileViews, setProfileViews] = useState(0);

  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSocials, setShowSocials] = useState(false);

  // Dropdown stanu
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Feedback
  const [reviewText, setReviewText] = useState("");
  const [sentReview, setSentReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Formularz
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("Youtube");
  const [newVariant, setNewVariant] = useState("pink");
  const [newType, setNewType] = useState("link");
  const [newPassword, setNewPassword] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- INITIAL DATA ---
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
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setAvatarUrl(profileData.avatar_url);
        setBio(profileData.bio || "");
        setCurrentTheme((profileData.theme as ThemeKey) || "cyberpunk");
        setSocials(profileData.socials || {});
        setUsername(profileData.username);
        setProfileViews(profileData.views || 0);
      }
      setLoading(false);
    };
    initData();
  }, []);

  // Zamykanie dropdowna po kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // --- STATYSTYKI ---
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const clickThroughRate = profileViews > 0 ? ((totalClicks / profileViews) * 100).toFixed(1) : "0";
  const topLink = links.reduce((prev, current) => ((prev.clicks || 0) > (current.clicks || 0)) ? prev : current, links[0] || null);

  // --- HANDLERY ---
  const handleUpdateLink = async (id: number, newTitle: string, newUrl: string) => {
    const { error } = await supabase.from('links').update({ title: newTitle, url: newUrl }).eq('id', id);
    if (!error) { fetchLinks(); } else { alert("Błąd edycji: " + error.message); }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: bio,
          theme: currentTheme,
          socials: socials,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
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

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setSocials(prev => ({ ...prev, [key]: value }));
  };

  const handleSendReview = async () => {
    if (!reviewText) return;
    setReviewError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('reviews').insert({ user_id: user.id, content: reviewText, rating: 5 });
    if (error) {
      if (error.code === '23505') setReviewError("Możesz dodać tylko jedną opinię!");
      else setReviewError("Błąd wysyłania.");
    } else {
      setSentReview(true); setReviewText(""); setTimeout(() => setSentReview(false), 3000);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0;
    const { error } = await supabase.from("links").insert({
      title: newTitle,
      url: newUrl,
      icon: newIcon,
      variant: newVariant,
      position: newPosition,
      user_id: user.id,
      type: newType,
      link_password: newType === 'locked' ? newPassword : null
    });
    if (!error) {
      setNewTitle(""); setNewUrl(""); setNewPassword(""); fetchLinks();
    } else {
      alert(error.message);
    }
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
    for (const [index, item] of items.entries()) {
      await supabase.from('links').update({ position: index }).eq('id', item.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getThemePreviewStyle = (themeKey: ThemeKey) => {
    const theme = themes[themeKey];
    if (theme.bg.includes('gradient')) return theme.bg;
    if (themeKey === 'minimal') return 'bg-[#f3f4f6]';
    return theme.bg;
  }

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>;

  return (
    <div className="h-screen bg-[#050505] text-white font-sans selection:bg-brand-primary selection:text-white overflow-hidden flex flex-col">
      <div className="bg-noise fixed inset-0 opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent opacity-50" />

      <EditLinkModal isOpen={!!editingLink} link={editingLink} onClose={() => setEditingLink(null)} onSave={handleUpdateLink} />

      {/* HEADER */}
      <header className="shrink-0 px-6 sm:px-8 py-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl"><LayoutDashboard size={20} className="text-brand-primary" /></div>
          <div><h1 className="font-heading font-bold text-xl tracking-tight text-white">Command Center</h1></div>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 rounded-lg text-sm font-bold transition-all group">Live View <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></a>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-sm font-medium transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      {/* GŁÓWNY GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">

        {/* --- LEWA KOLUMNA (SCROLLOWALNA) --- */}
        <div className="lg:col-span-4 overflow-y-auto border-r border-white/5 p-6 sm:p-8 space-y-6 custom-scrollbar h-full bg-[#09090b]/50">

          {/* 1. Karta Profilu */}
          <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 space-y-5 relative z-30 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest"><Settings size={14} className="text-brand-primary" /> Identity</div>
            <div className="flex justify-center"><AvatarUpload currentAvatarUrl={avatarUrl} onUploadComplete={handleAvatarUpdate} /></div>
            <div className="space-y-3">
              <div className="space-y-1"><label className="text-[10px] font-bold text-zinc-600 uppercase ml-1">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:border-brand-primary/50 outline-none resize-none" rows={2} /></div>

              {/* WYBÓR MOTYWU (DROPDOWN) */}
              <div className="space-y-1 relative" ref={dropdownRef}>
                <label className="text-[10px] font-bold text-zinc-600 uppercase ml-1">Theme</label>
                <button onClick={() => setThemeDropdownOpen(!themeDropdownOpen)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3 pr-4 text-sm text-white focus:border-brand-primary/50 flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3"><div className={cn("w-5 h-5 rounded-full border border-white/20 shadow-sm", getThemePreviewStyle(currentTheme))} /> <span className="font-medium">{themes[currentTheme].label}</span></div><ChevronDown className={cn("text-zinc-500 transition-transform", themeDropdownOpen && "rotate-180")} size={14} />
                </button>
                <AnimatePresence>
                  {themeDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-[#121212] border border-white/10 rounded-xl shadow-xl py-2 z-50 max-h-[250px] overflow-y-auto ring-1 ring-white/5">
                      {Object.entries(themes).map(([key, value]) => (
                        <button key={key} onClick={() => { setCurrentTheme(key as ThemeKey); setThemeDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors">
                          <div className={cn("w-6 h-6 rounded-full border border-white/10", getThemePreviewStyle(key as ThemeKey))} />
                          <span className="text-zinc-300">{value.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SOCIALS */}
              <div className="pt-2">
                <button onClick={() => setShowSocials(!showSocials)} className="w-full flex items-center justify-between text-xs font-bold text-zinc-400 bg-white/5 border border-white/5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors"><span>SOCIALS</span><ChevronDown size={14} className={cn("transition-transform", showSocials && "rotate-180")} /></button>
                {showSocials && <div className="mt-2 grid grid-cols-1 gap-2 p-2 bg-black/20 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">{['instagram', 'twitter', 'youtube', 'github', 'email', 'website'].map(s => <input key={s} placeholder={s} value={socials[s as keyof SocialLinks] || ''} onChange={e => handleSocialChange(s as keyof SocialLinks, e.target.value)} className="w-full bg-white/5 rounded-lg p-2 text-xs text-zinc-300 outline-none focus:border-brand-primary/50 transition-all" />)}</div>}
              </div>

              <button onClick={handleProfileSave} disabled={savingProfile} className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5">{savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} SAVE</button>
            </div>
          </div>

          {/* 2. Karta Feedback */}
          <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 relative z-20 shadow-lg">
            <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-zinc-500 uppercase"><MessageSquare size={14} /> Feedback</h3>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-zinc-300 resize-none outline-none mb-2 focus:border-brand-primary/50 transition-all" rows={2} placeholder="Opinia..." />
            {reviewError && <p className="text-red-400 text-[10px] mb-2">{reviewError}</p>}
            <button onClick={handleSendReview} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold rounded-lg transition-colors">{sentReview ? "Wysłano!" : "Wyślij"}</button>
          </div>

          {/* 3. Karta Injector (Dodawanie) */}
          <div className="bg-[#09090b] border border-brand-primary/20 rounded-2xl p-5 shadow-xl relative z-10">
            <div className="flex items-center gap-2 mb-4 text-brand-primary text-xs font-bold uppercase tracking-widest"><Plus size={14} /> Inject Content</div>
            <form onSubmit={handleAddLink} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none cursor-pointer focus:border-brand-primary/50 transition-all">
                  <option value="link" className="bg-[#09090b]">Link</option>
                  <option value="youtube" className="bg-[#09090b]">Video</option>
                  <option value="youtube_latest" className="bg-[#09090b]">Channel Latest</option>
                  <option value="spotify" className="bg-[#09090b]">Music</option>
                  <option value="header" className="bg-[#09090b]">Header</option>
                  <option value="locked" className="bg-[#09090b]">Secret</option>
                </select>
              </div>

              <input type="text" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-brand-primary/50 transition-all" />
              {newType !== 'header' && <input type="url" placeholder="URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-brand-primary/50 transition-all" />}
              {newType === 'locked' && <input type="text" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-red-900/20 border border-red-500/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-red-500 transition-all placeholder:text-red-300/50" />}

              {newType === 'link' && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                       <div className="space-y-1">
                           <label className="text-[10px] text-zinc-500 font-bold uppercase">Icon</label>
                           <select value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-brand-primary/50 transition-all cursor-pointer">
                               <option value="default" className="bg-[#09090b]">Default</option>
                               <option value="Youtube" className="bg-[#09090b]">Youtube</option>
                               <option value="Instagram" className="bg-[#09090b]">Instagram</option>
                               <option value="Twitter" className="bg-[#09090b]">Twitter</option>
                               <option value="Github" className="bg-[#09090b]">Github</option>
                               <option value="Music" className="bg-[#09090b]">Music</option>
                           </select>
                       </div>
                       <div className="space-y-1">
                           <label className="text-[10px] text-zinc-500 font-bold uppercase">Variant</label>
                           <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 h-[38px]">
                               <button type="button" onClick={() => setNewVariant("pink")} className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", newVariant === "pink" ? "bg-white/10 text-brand-accent" : "text-zinc-600 hover:text-white")}>Main</button>
                               <button type="button" onClick={() => setNewVariant("cyan")} className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", newVariant === "cyan" ? "bg-white/10 text-brand-primary" : "text-zinc-600 hover:text-white")}>Alt</button>
                           </div>
                       </div>
                  </div>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-xs mt-2 transition-all shadow-lg shadow-brand-primary/20">ADD BLOCK</button>
            </form>
          </div>
        </div>

        {/* --- PRAWA KOLUMNA (Podzielona Flexboxem) --- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full overflow-hidden relative">

          {/* GÓRA: Lista (Scrollowalna, zajmuje dostępne miejsce) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 min-h-0 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4 mb-6">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-green-500" /> Active Modules</h2>
              <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-zinc-400 font-mono">COUNT: {links.length}</span>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 pb-6">
                  {links.map((link) => <SortableLink key={link.id} link={link} theme={currentTheme} onDelete={handleDeleteLink} onToggleVariant={handleToggleVariant} onEdit={setEditingLink} />)}
                  {links.length === 0 && <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-zinc-600 bg-white/[0.02]"><p>System Empty</p></div>}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* DÓŁ: Statystyki (Przyklejone do dołu, sztywna wysokość zawartości) */}
          <div className="shrink-0 border-t border-white/10 bg-[#09090b]/80 backdrop-blur-xl p-6 sm:p-8 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart3 size={14} className="text-blue-500" /> Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* KARTA VIEWS */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Eye size={40} /></div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Views</p>
                <div>
                  <h3 className="text-3xl font-bold text-white">{profileViews}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Lifetime profile visits</p>
                </div>
                <div className="h-1 w-full bg-white/5 mt-2 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-3/4" /></div>
              </div>

              {/* KARTA CLICKS */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MousePointerClick size={40} /></div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Clicks</p>
                <div>
                  <h3 className="text-3xl font-bold text-white">{totalClicks}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Avg. {clickThroughRate}% CTR</p>
                </div>
                <div className="h-1 w-full bg-white/5 mt-2 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-1/2" /></div>
              </div>

              {/* KARTA TOP LINK */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={40} /></div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Top Performing</p>
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold text-white truncate" title={topLink?.title || ""}>{topLink?.title || "N/A"}</h3>
                  <p className="text-zinc-400 text-sm">{topLink?.clicks || 0} clicks</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/20">MOST POPULAR</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}