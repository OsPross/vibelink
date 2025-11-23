"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Pencil, Video, Music, Link as LinkIcon, Type, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeKey } from "@/lib/themes";

// POPRAWKA: Dodano 'position' do interfejsu, żeby zgadzał się z AdminPage
interface LinkItem {
  id: number;
  title: string;
  url: string;
  variant: string;
  type: string;
  icon: string;
  position: number; 
}

interface SortableLinkProps {
  link: LinkItem;
  theme: ThemeKey;
  onDelete: (id: number) => void;
  onToggleVariant: (id: number, currentVariant: string) => void;
  onEdit: (link: LinkItem) => void;
}

// Helper do ikon typu
const getTypeIcon = (type: string) => {
    switch(type) {
        case 'youtube': 
        case 'youtube_latest': return <Video size={14} className="text-red-500"/>;
        case 'spotify': return <Music size={14} className="text-green-500"/>;
        case 'header': return <Type size={14} className="text-yellow-500"/>;
        case 'locked': return <Lock size={14} className="text-orange-500"/>;
        default: return <LinkIcon size={14} className="text-blue-400"/>;
    }
}

export function SortableLink({ link, theme, onDelete, onToggleVariant, onEdit }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between bg-[#09090b] border border-white/10 p-3 rounded-xl transition-all select-none hover:border-white/20",
        isDragging && "shadow-2xl scale-105 border-brand-primary ring-1 ring-brand-primary"
      )}
    >
      <div className="flex items-center gap-4 w-full overflow-hidden">
        
        {/* Uchwyt */}
        <button {...attributes} {...listeners} className="touch-none p-2 text-zinc-600 hover:text-white cursor-grab active:cursor-grabbing">
          <GripVertical size={18} />
        </button>

        {/* Wskaźnik Koloru (Klikalny) */}
        <button
          onClick={() => onToggleVariant(link.id, link.variant)}
          className={cn(
            "w-1.5 h-10 rounded-full transition-all hover:scale-110 active:scale-95 shrink-0",
             link.variant === 'cyan' ? "bg-neon-cyan shadow-[0_0_10px_cyan]" : "bg-neon-pink shadow-[0_0_10px_magenta]"
          )}
          title={`Styl: ${link.variant}`}
        />
        
        {/* Treść */}
        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
                <div className="bg-white/5 p-1 rounded text-zinc-400">
                    {getTypeIcon(link.type)}
                </div>
                <h3 className="font-bold text-white text-sm truncate">{link.title}</h3>
                
                {/* Badge Typu */}
                <span className="text-[9px] font-mono uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded text-zinc-500">
                    {link.type.replace('_', ' ')}
                </span>
            </div>
            
            {link.type !== 'header' && (
                <p className="text-[10px] text-zinc-500 truncate font-mono pl-8">
                    {link.url}
                </p>
            )}
        </div>
      </div>

      {/* Akcje */}
      <div className="flex items-center gap-1">
        <button
            onClick={() => onEdit(link)}
            className="p-2 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            title="Edytuj"
        >
            <Pencil size={16} />
        </button>
        <button
            onClick={() => onDelete(link.id)}
            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Usuń"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}