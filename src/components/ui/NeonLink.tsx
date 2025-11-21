"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import React from "react";

interface NeonLinkProps {
  href: string;
  title: string;
  variant?: "pink" | "cyan";
  // ZMIANA: Zamiast LucideIcon, przyjmujemy gotowy element Reacta (ReactNode)
  icon?: React.ReactNode; 
  className?: string;
}

export const NeonLink = ({
  href,
  title,
  variant = "pink",
  icon,
  className,
}: NeonLinkProps) => {
  const colors = {
    pink: {
      border: "border-neon-pink",
      glow: "group-hover:shadow-[0_0_20px_#FF00FF]",
      text: "group-hover:text-neon-pink",
      bg: "hover:bg-neon-pink/10",
    },
    cyan: {
      border: "border-neon-cyan",
      glow: "group-hover:shadow-[0_0_20px_#00FFFF]",
      text: "group-hover:text-neon-cyan",
      bg: "hover:bg-neon-cyan/10",
    },
  };

  const theme = colors[variant];

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300",
        "bg-vibe-dark-gray/50 backdrop-blur-sm",
        theme.border,
        theme.bg,
        theme.glow,
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        {/* ZMIANA: Renderujemy ikonę w wrapperze, który narzuca kolor i rozmiar */}
        {icon && (
          <span className={cn("h-6 w-6 flex items-center justify-center transition-colors duration-300 text-gray-400", theme.text)}>
            {icon}
          </span>
        )}
        
        <span className="font-medium text-white text-lg tracking-wide">
          {title}
        </span>
      </div>

      <ExternalLink
        className={cn(
          "h-5 w-5 opacity-0 transition-all duration-300 -translate-x-2",
          "group-hover:opacity-100 group-hover:translate-x-0 text-gray-400",
          theme.text
        )}
      />
    </motion.a>
  );
};