"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Lock, Mail, ArrowRight, Loader2, User, Sparkles } from "lucide-react";

// Wydzielamy formularz do osobnego komponentu, żeby użyć useSearchParams wewnątrz Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Odczytujemy parametry z URL
  
  // Jeśli w URL jest ?mode=register, ustawiamy false (czyli rejestracja), w przeciwnym razie true (logowanie)
  const initialMode = searchParams.get("mode") !== "register";
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Aktualizujemy stan po załadowaniu strony, żeby uniknąć błędów hydracji
  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLoginMode(false);
    }
  }, [searchParams]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
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
      if (error) setError("Błędne dane logowania.");
      else {
        router.push("/admin");
        router.refresh();
      }
    } else {
      // REJESTRACJA
      if (!username) {
        setError("Nazwa użytkownika jest wymagana.");
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username.toLowerCase(),
            full_name: username,
          });

        if (profileError) {
          if (profileError.code === '23505') setError("Ta nazwa jest już zajęta.");
          else setError(profileError.message);
        } else {
          router.push("/admin");
          router.refresh();
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="web3-card rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4">
            <Sparkles className="text-brand-primary" size={20} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isLoginMode ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-zinc-400 text-sm">
          {isLoginMode ? "Wpisz dane, aby wejść do panelu." : "Zacznij budować swoje portfolio."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        
        {!isLoginMode && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="np. oskaros"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-500 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <input
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-500 ml-1">Hasło</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isLoginMode ? "Zaloguj się" : "Stwórz konto")} 
          {!loading && <ArrowRight size={18} />}
        </button>
        
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {isLoginMode ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 relative overflow-hidden text-white">
      {/* Tło i Efekty */}
      <div className="bg-noise fixed inset-0 opacity-[0.04] pointer-events-none" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Suspense jest wymagany w Next.js przy używaniu useSearchParams */}
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}