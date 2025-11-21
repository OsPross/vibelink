"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tworzymy klienta Supabase dla przeglądarki
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Próba logowania
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // 2. Sukces -> Przekieruj do panelu (który zaraz stworzymy)
      router.push("/admin");
      router.refresh();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    // Rejestracja (dla testów, żebyś mógł założyć konto)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Konto utworzone! Zaloguj się teraz.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vibe-black p-4 relative overflow-hidden">
      {/* Tło Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.05),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl text-transparent bg-clip-text bg-vibe-gradient font-bold">
            SYSTEM ACCESS
          </h1>
          <p className="text-gray-500 text-sm tracking-widest">AUTHENTICATION REQUIRED</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-vibe-dark-gray/50 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
          
          {/* Input Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="email"
                placeholder="Agent ID (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-pink transition-colors"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="password"
                placeholder="Security Code (Password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan transition-colors"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vibe-gradient text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "INITIALIZE SESSION"} <ArrowRight size={18} />
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-neon-cyan transition-colors"
            >
              NO ACCESS? GENERATE NEW ID
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}