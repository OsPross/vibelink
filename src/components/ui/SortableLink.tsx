"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  variant: string;
}

interface SortableLinkProps {
  link: LinkItem;
  onDelete: (id: number) => void;
}

export function SortableLink({ link, onDelete }: SortableLinkProps) {
  // Hook z dnd-kit, który daje nam "moce" przeciągania
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
    zIndex: isDragging ? 50 : "auto", // Przeciągany element musi być na wierzchu
    opacity: isDragging ? 0.5 : 1,    // Przeciągany element lekko przezroczysty
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between bg-vibe-dark-gray/50 border border-white/5 p-4 rounded-lg hover:border-white/20 transition-colors",
        isDragging && "border-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.2)]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Uchwyt do przeciągania (Grip) */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-2 text-gray-600 hover:text-white cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </button>

        {/* Wskaźnik koloru */}
        <div
          className={cn(
            "w-2 h-12 rounded-full",
            link.variant === "pink" ? "bg-neon-pink" : "bg-neon-cyan"
          )}
        />
        
        {/* Treść */}
        <div>
          <h3 className="font-bold text-white">{link.title}</h3>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {link.url}
          </p>
        </div>
      </div>

      {/* Przycisk usuwania (musi być poza listenerami drag & drop) */}
      <button
        onClick={() => onDelete(link.id)}
        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}