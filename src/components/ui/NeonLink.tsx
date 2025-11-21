"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import React from "react";
import { themes, ThemeKey } from "@/lib/themes";

interface NeonLinkProps {
  href: string;
  title: string;
  icon?: React.ReactNode;
  className?: string;
  themeName?: ThemeKey;
  variant?: string;
}

export const NeonLink = ({
  href,
  title,
  icon,
  className,
  themeName = "cyberpunk",
  variant = "pink",
}: NeonLinkProps) => {
  
  const themeConfig = themes[themeName] || themes.cyberpunk;
  
  // Fallback do 'pink' jeśli wariant jest nieznany
  const variantKey = (variant === 'cyan' ? 'cyan' : 'pink') as keyof typeof themeConfig.variants;
  const styles = themeConfig.variants[variantKey];

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300",
        "backdrop-blur-sm",
        styles.bg,     
        styles.border, 
        className
      )}
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
    >
       {/* Glow effect */}
       <div className={cn("absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300", styles.glow)} />

      <div className="flex items-center gap-4 relative z-10">
        {icon && (
          <span className={cn("h-6 w-6 flex items-center justify-center transition-colors duration-300", styles.text)}>
            {icon}
          </span>
        )}
        
        {/* POPRAWKA TUTAJ: Usunąłem 'text-white'. 
            Teraz tekst bierze kolor z 'styles.text', który jest zdefiniowany w themes.ts.
            Dzięki temu w Minimal Light tekst będzie czarny. */}
        <span className={cn("font-medium text-lg tracking-wide transition-colors", styles.text)}>
          {title}
        </span>
      </div>

      <ExternalLink
        className={cn(
          "h-5 w-5 opacity-0 transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 relative z-10",
          styles.text
        )}
      />
    </motion.a>
  );
};