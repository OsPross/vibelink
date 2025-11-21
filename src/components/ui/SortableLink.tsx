"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes, ThemeKey } from "@/lib/themes"; // Import motywów

interface LinkItem {
  id: number;
  title: string;
  url: string;
  variant: string; // 'pink' lub 'cyan'
}

interface SortableLinkProps {
  link: LinkItem;
  theme: ThemeKey; // Nowy prop: aktualny motyw
  onDelete: (id: number) => void;
  onToggleVariant: (id: number, currentVariant: string) => void; // Nowa funkcja
}

export function SortableLink({ link, theme, onDelete, onToggleVariant }: SortableLinkProps) {
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

  // Pobieramy style z motywu
  const currentTheme = themes[theme] || themes.cyberpunk;
  const variantKey = (link.variant === 'cyan' ? 'cyan' : 'pink') as keyof typeof currentTheme.variants;
  const variantStyles = currentTheme.variants[variantKey];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between border p-4 rounded-lg transition-colors select-none",
        // Używamy kolorów z motywu zamiast szarego tła
        variantStyles.bg,
        variantStyles.border,
        isDragging && "shadow-xl scale-105"
      )}
    >
      <div className="flex items-center gap-4 w-full overflow-hidden">
        {/* Uchwyt do przeciągania */}
        <button
          {...attributes}
          {...listeners}
          className={cn("touch-none p-2 cursor-grab active:cursor-grabbing", variantStyles.text)}
        >
          <GripVertical size={20} />
        </button>

        {/* KLIKALNY PASEK KOLORU (Zmienia wariant) */}
        <button
          onClick={() => onToggleVariant(link.id, link.variant)}
          className={cn(
            "w-3 h-12 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center group/color",
             // Tutaj musimy użyć tła z wariantu, ale często jest ono półprzezroczyste.
             // Dla paska wskaźnika użyjmy koloru tekstu jako tła (border color z wariantu zazwyczaj jest jaskrawy)
             link.variant === 'cyan' ? "bg-cyan-400" : "bg-pink-500"
          )}
          title="Kliknij, aby zmienić kolor"
        >
            <RefreshCcw size={10} className="text-black opacity-0 group-hover/color:opacity-100 transition-opacity"/>
        </button>
        
        {/* Treść */}
        <div className="min-w-0">
          <h3 className={cn("font-bold truncate", currentTheme.text)}>{link.title}</h3>
          <p className={cn("text-xs truncate opacity-70", currentTheme.text)}>
            {link.url}
          </p>
        </div>
      </div>

      {/* Usuwanie */}
      <button
        onClick={() => onDelete(link.id)}
        className="p-2 ml-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}