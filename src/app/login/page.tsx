"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Lock, Mail, ArrowRight, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true); // Przełącznik Logowanie vs Rejestracja
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Nowe pole
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLoginMode) {
      // LOGOWANIE
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/admin");
        router.refresh();
      }
    } else {
      // REJESTRACJA Z TWORZENIEM PROFILU
      if (!username) {
        setError("Musisz podać nazwę użytkownika!");
        setLoading(false);
        return;
      }

      // 1. Rejestracja w Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // 2. Utworzenie wpisu w tabeli 'profiles'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username.toLowerCase(), // Zawsze małe litery w URL
            full_name: username,
          });

        if (profileError) {
          // Jeśli username zajęty -> błąd
          if (profileError.code === '23505') setError("Ta nazwa użytkownika jest zajęta.");
          else setError(profileError.message);
        } else {
          // Sukces
          router.push("/admin");
          router.refresh();
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vibe-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl text-transparent bg-clip-text bg-vibe-gradient font-bold">
            {isLoginMode ? "SYSTEM ACCESS" : "NEW AGENT"}
          </h1>
          <p className="text-gray-500 text-sm tracking-widest">
            {isLoginMode ? "ENTER CREDENTIALS" : "CREATE IDENTITY"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 bg-vibe-dark-gray/50 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
          
          {/* Username - tylko przy rejestracji */}
          {!isLoginMode && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Username (np. cybercreator)"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} // Bez spacji
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-neon-pink outline-none"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-neon-cyan outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-neon-cyan outline-none"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-vibe-gradient text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : (isLoginMode ? "LOGIN" : "REGISTER")} <ArrowRight size={18} />
          </button>
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
              className="text-xs text-gray-500 hover:text-neon-pink transition-colors"
            >
              {isLoginMode ? "NO ACCOUNT? CREATE ONE" : "ALREADY HAVE ID? LOGIN"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}