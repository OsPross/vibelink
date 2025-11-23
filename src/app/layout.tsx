import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeLink | Your Links. Your Vibe.",
  description: "Futurystyczna platforma link-in-bio dla twórców.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body className={cn(
        inter.variable, 
        orbitron.variable, 
        "min-h-screen bg-[#09090b] font-sans text-white antialiased overflow-x-hidden"
      )}>
        {children}
      </body>
    </html>
  );
}