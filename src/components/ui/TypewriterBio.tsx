"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterBioProps {
  text: string;
  speed?: number;
}

export function TypewriterBio({ text, speed = 40 }: TypewriterBioProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <div className="relative inline-block max-w-md w-full px-4"> 
      {/* POPRAWKA: Usunąłem 'text-gray-400'. 
          Zamiast tego dałem 'opacity-80'. 
          Dzięki temu tekst będzie miał TEN SAM kolor co nagłówek (czarny w Light, biały w Dark), 
          ale będzie minimalnie lżejszy wizualnie. */}
      <p className="text-sm md:text-base font-medium leading-relaxed tracking-wide break-words whitespace-pre-wrap opacity-80">
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          // Kursor też niech bierze kolor z tekstu (bg-current), zamiast różowego
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
        />
      </p>
    </div>
  );
}