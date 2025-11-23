"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface EditLinkModalProps {
  link: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, newTitle: string, newUrl: string) => Promise<void>;
}

export function EditLinkModal({ link, isOpen, onClose, onSave }: EditLinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setUrl(link.url || "");
    }
  }, [link, isOpen]);

  if (!isOpen || !link) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(link.id, title, url);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#09090b] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 ring-1 ring-white/5">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Edytuj Element</h2>
        <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider">
                {link.type}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">ID: {link.id}</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-wider">Title / Content</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-primary outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          {link.type !== 'header' && (
            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-wider">URL / Resource</label>
                <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:border-brand-primary outline-none transition-all placeholder:text-zinc-700 font-mono"
                />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-sm font-bold hover:bg-white/5 transition-colors">
            Anuluj
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
          >
            {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Zapisz Zmiany
          </button>
        </div>

      </div>
    </div>
  );
}