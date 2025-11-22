"use client";

import { Instagram, Twitter, Github, Linkedin, Facebook, Youtube, Twitch, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { themes, ThemeKey } from "@/lib/themes"; // Import motywów
import { cn } from "@/lib/utils";

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  twitch?: string;
  email?: string;
  website?: string;
}

interface SocialBarProps {
  socials: SocialLinks | null;
  themeName?: ThemeKey; // Dodajemy prop motywu
}

export function SocialBar({ socials, themeName = "cyberpunk" }: SocialBarProps) {
  if (!socials) return null;

  const platforms = [
    { key: "email", icon: Mail },
    { key: "website", icon: Globe },
    { key: "instagram", icon: Instagram },
    { key: "twitter", icon: Twitter },
    { key: "youtube", icon: Youtube },
    { key: "twitch", icon: Twitch },
    { key: "github", icon: Github },
    { key: "linkedin", icon: Linkedin },
    { key: "facebook", icon: Facebook },
  ];

  const activeLinks = platforms.filter((p) => socials[p.key as keyof SocialLinks]);
  if (activeLinks.length === 0) return null;

  // Pobieramy style dla danego motywu
  const currentTheme = themes[themeName] || themes.cyberpunk;
  // Używamy koloru ramki z wariantu pink jako bazowego koloru dla ikon (zazwyczaj jest to główny kolor akcentu)
  const accentClass = currentTheme.variants.pink.border.replace("border", "text").replace("border-", "text-"); 

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2 mb-8 relative z-20">
      {activeLinks.map((platform) => {
        const rawUrl = socials[platform.key as keyof SocialLinks] as string;
        let finalUrl = rawUrl;
        if (platform.key === "email" && !rawUrl.startsWith("mailto:")) {
            finalUrl = `mailto:${rawUrl}`;
        } else if (platform.key !== "email" && !rawUrl.startsWith("http")) {
            finalUrl = `https://${rawUrl}`;
        }

        return (
          <motion.a
            key={platform.key}
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-3 rounded-full transition-all shadow-lg backdrop-blur-md border",
              // Tutaj magia: Pobieramy tło i ramkę z wariantu 'pink' motywu, ale tekst ustawiamy na biały/jasny
              currentTheme.variants.pink.bg,
              currentTheme.variants.pink.border,
              // Nadpisujemy kolor tekstu na ten z motywu
              currentTheme.text
            )}
          >
            <platform.icon size={20} />
          </motion.a>
        );
      })}
    </div>
  );
}