"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";


const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function LoginPage() {
  const { t } = useTranslation("Login");
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isLogin 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/login`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/register`;

    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Сталася помилка");
      }

      // Backend sets the HttpOnly 'access' cookie automatically.
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${dm.className} min-h-[90vh] bg-transparent flex flex-col items-center justify-center pb-24 px-6 relative overflow-hidden`}>
      <div 
        className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.03]"
        style={{
          backgroundImage: "url('/images/logo-full-dark.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "60%"
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2 text-center">
          <span className="text-white/25 text-[10px] uppercase tracking-[5px] font-light">{t("auth_label")}</span>
          <h1 className={`font-fraktur text-white text-5xl md:text-7xl leading-none`}>
            {isLogin ? "Login" : "Register"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 bg-white/[0.02] border border-white/[0.07]">
          {!isLogin && (
            <div>
              <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("name")}</label>
              <input 
                value={name} onChange={e => setName(e.target.value)} 
                placeholder="Олександр" required={!isLogin}
                className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/20 px-0 py-3 outline-none focus:border-white transition-colors text-lg font-light"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("email")}</label>
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              placeholder="example@mail.com" required
              className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/20 px-0 py-3 outline-none focus:border-white transition-colors text-lg font-light"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("password")}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" required minLength={3}
                className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/20 px-0 py-3 pr-10 outline-none focus:border-white transition-colors text-lg font-light"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-2"
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500/80 text-sm mt-2 font-light">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 border border-white/20 text-white py-4 text-[10px] uppercase tracking-[3px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? t("loading") : isLogin ? t("submit_login") : t("submit_register")}
          </button>

          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-xs text-white/40 hover:text-white mt-2 transition-colors w-max mx-auto animated-underline"
          >
            {isLogin ? t("toggle_login") : t("toggle_register")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
