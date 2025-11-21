"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Importy do Drag & Drop
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "@/components/ui/SortableLink";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  variant: string;
  position: number; // Dodaliśmy pole position
}

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formularz
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("Youtube");
  const [newVariant, setNewVariant] = useState("pink");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Konfiguracja sensorów (myszka, dotyk, klawiatura)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        fetchLinks();
      }
    };
    checkSession();
  }, []);

  const fetchLinks = async () => {
    const { data } = await supabase
      .from("links")
      .select("*")
      .order("position", { ascending: true }); // Sortujemy po POZYCJI, a nie ID

    if (data) setLinks(data);
    setLoading(false);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    // Nowy link dajemy na koniec listy
    const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0;

    const { error } = await supabase.from("links").insert({
      title: newTitle,
      url: newUrl,
      icon: newIcon,
      variant: newVariant,
      position: newPosition
    });

    if (!error) {
      setNewTitle("");
      setNewUrl("");
      fetchLinks(); 
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm("Na pewno usunąć ten link?")) return;
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // LOGIKA DRAG & DROP - TO JEST SERCE SORTOWANIA
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        // 1. Oblicz nową tablicę lokalnie (Optimistic UI)
        const newItems = arrayMove(items, oldIndex, newIndex);

        // 2. Wyślij aktualizację do bazy w tle
        updatePositionsInDb(newItems);

        return newItems;
      });
    }
  };

  // Funkcja aktualizująca pozycje w bazie
  const updatePositionsInDb = async (items: LinkItem[]) => {
    const updates = items.map((item, index) => ({
      id: item.id,
      position: index, // Przypisujemy nowy index jako pozycję
      title: item.title, // Supabase upsert wymaga wymaganych pól, ale update zmienia tylko podane
      url: item.url,     // ... w praktyce przy upsert wystarczy PK i zmieniane pole, ale dla bezpieczeństwa:
    }));

    // Upsert to sprytna metoda: "zaktualizuj jeśli istnieje"
    // Wymaga podania wszystkich kolumn NOT NULL, dlatego prościej zrobić to pętlą lub RPC,
    // ale dla małej ilości linków, mapowanie pętlą po ID jest najbezpieczniejsze w kliencie JS:
    
    for (const [index, item] of items.entries()) {
        await supabase.from('links').update({ position: index }).eq('id', item.id);
    }
  };

  if (loading) return <div className="min-h-screen bg-vibe-black flex items-center justify-center text-neon-pink"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-vibe-black text-white p-4 md:p-8 relative">
       <div className="fixed top-0 left-0 w-full h-2 bg-vibe-gradient" />
       
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vibe-gradient rounded-lg">
              <LayoutDashboard className="text-black" size={24} />
            </div>
            <h1 className="font-heading text-2xl font-bold">ADMIN PANEL</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm uppercase tracking-wider">
            <LogOut size={16} /> Wyloguj
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* FORMULARZ (Lewa strona) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-vibe-dark-gray p-6 rounded-xl border border-white/10 sticky top-8">
              <h2 className="text-neon-cyan font-bold mb-4 flex items-center gap-2">
                <Plus size={18} /> NEW LINK
              </h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input type="text" placeholder="Tytuł" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-neon-pink outline-none" />
                <input type="url" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-neon-pink outline-none" />
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Ikona</label>
                  <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-neon-cyan outline-none text-gray-300">
                    <option value="Youtube">Youtube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter (X)</option>
                    <option value="Github">Github</option>
                    <option value="Music">Music (Spotify)</option>
                    <option value="default">Inna (Link)</option>
                  </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Kolor</label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setNewVariant("pink")} className={cn("flex-1 py-2 rounded border text-xs font-bold transition-all", newVariant === "pink" ? "bg-neon-pink/20 border-neon-pink text-neon-pink" : "border-white/10 text-gray-500")}>PINK</button>
                        <button type="button" onClick={() => setNewVariant("cyan")} className={cn("flex-1 py-2 rounded border text-xs font-bold transition-all", newVariant === "cyan" ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "border-white/10 text-gray-500")}>CYAN</button>
                    </div>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition-colors mt-2">DODAJ LINK</button>
              </form>
            </div>
          </div>

          {/* LISTA SORTOWALNA (Prawa strona) */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-gray-400 text-sm tracking-widest mb-4">DRAG TO REORDER ({links.length})</h2>
            
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={links.map(l => l.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {links.map((link) => (
                    <SortableLink 
                      key={link.id} 
                      link={link} 
                      onDelete={handleDeleteLink} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {links.length === 0 && (
                <p className="text-center text-gray-600 py-10">Brak linków. Dodaj coś!</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}