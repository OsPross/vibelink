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

// Ustalanie bazowego adresu URL
// Jeśli jest zmienna środowiskowa (na produkcji), użyj jej. Jeśli nie - localhost.
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()), // <--- TO NAPRAWIA BŁĄD
  title: {
    default: "VibeLink | Your Links. Your Vibe.",
    template: "%s | VibeLink"
  },
  description: "Futurystyczna platforma link-in-bio dla twórców. Stwórz swój profil w 30 sekund.",
  icons: {
    icon: "/favicon.ico", // Możesz tu dodać własną ikonę później
  },
  openGraph: {
    title: "VibeLink",
    description: "Futurystyczna platforma link-in-bio.",
    url: getBaseUrl(),
    siteName: "VibeLink",
    locale: "pl_PL",
    type: "website",
  },
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