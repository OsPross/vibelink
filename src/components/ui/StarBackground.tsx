"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function StarBackground() {
  // Używamy state, żeby wygenerować gwiazdy tylko po stronie klienta
  // (zapobiega błędowi "Hydration failed" w Next.js)
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Losowa pozycja X (0-100%)
      top: Math.random() * 100,  // Losowa pozycja Y (0-100%)
      size: Math.random() * 3 + 1, // Wielkość 1px - 4px
      duration: Math.random() * 5 + 5, // Czas animacji 5s - 10s
      delay: Math.random() * 5, // Opóźnienie startu
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-20"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            y: [0, -100], // Ruch do góry
            opacity: [0, 0.7, 0], // Pojawianie się i znikanie
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}