"use client";

import Image from "next/image";
import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@deemlol/next-icons";
import Logo from "../../../public/images/logo-full-dark.png"; 
import { CategoryService } from "@/services/category.service";
import { Category } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { HeaderSearch } from "./HeaderSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [cartAmount, setCartAmount] = useState<number>(0);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const {cart} = useCart();
  const { t } = useTranslation("Header");

  const navLinks = [
    { label: t("home"), href: "/" },
    { 
      label: t("catalog"), 
      href: "/catalog",
      subLinks: category
        ?.filter(c => {
          const nameLower = c.name.toLowerCase();
          return !nameLower.includes("ua brands") && !nameLower.includes("in ua");
        })
        .map(c => ({ label: c.name, href: `/catalog/${c.id}` })) || []
    },
    { label: t("about_us"), href: "/about" },
  ];

  useEffect(() => {
    setCartAmount(cart.length)
  }, [cart])

  useLayoutEffect(() => {
    CategoryService.getAll()
      .then(res => setCategory(res));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 md:px-[70px] transition-all duration-300 ${
          scrolled 
            ? "bg-transparent/95 backdrop-blur-md border-b border-white/10 py-3" 
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <Link href="/" className="relative z-50 flex items-center">
          <Image 
            src={Logo} 
            alt="Holy Drip" 
            className="w-20 h-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((l) => (
            <div key={l.label} className="relative group">
              <Link
                href={l.href}
                className="font-sans text-[10px] font-medium uppercase tracking-[3px] text-white/60 hover:text-white transition-colors duration-300 animated-underline"
              >
                {l.label}
              </Link>
              {l.subLinks && l.subLinks.length > 0 && (
                <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-[#0a0a0a] border border-white/10 p-4 flex flex-col gap-3 min-w-[200px]">
                    {l.subLinks.map(sub => (
                      <Link 
                        key={sub.label} 
                        href={sub.href}
                        className="font-sans text-[10px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-6 relative z-50">
          <LanguageSwitcher />
          <HeaderSearch />
          
          <Link
            href="/profile"
            className="hidden md:flex items-center text-white hover:text-white/60 transition-colors"
          >
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
          </Link>

          <Link
            href="/cart"
            className="hidden md:flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[3px] text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300"
          >
            {t("cart")} ({cartAmount})
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} color="#ffffff" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "tween", duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
              className="fixed inset-0 h-[100dvh] w-full bg-[#020202] z-50 flex flex-col md:hidden overflow-hidden"
            >
              {/* Background ambient gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                <Image 
                  src={Logo} 
                  alt="Holy Drip" 
                  className="w-20 h-auto object-contain opacity-80"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-12 h-12 text-white/50 hover:text-white transition-all duration-500 hover:rotate-90"
                >
                  <X size={28} strokeWidth={1} color="currentColor" />
                </button>
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 gap-8">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((l, i) => {
                    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][i] || i.toString();
                    const hasSub = l.subLinks && l.subLinks.length > 0;
                    
                    return (
                      <motion.div
                        key={l.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-serif text-xs text-white/20 italic">
                            {roman}.
                          </span>
                          <Link
                            href={l.href}
                            onClick={() => !hasSub && setOpen(false)}
                            className="font-fraktur text-3xl sm:text-4xl text-white/80 hover:text-white transition-colors"
                          >
                            {l.label}
                          </Link>
                          {hasSub && (
                            <button 
                              onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                              className="ml-auto w-8 h-8 flex items-center justify-center border border-white/20 rounded-full text-white/60"
                            >
                              {mobileCatalogOpen ? "-" : "+"}
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {hasSub && mobileCatalogOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col pl-8 gap-4"
                            >
                              <Link 
                                href="/catalog" 
                                onClick={() => setOpen(false)}
                                className="font-sans text-xs uppercase tracking-[3px] text-white/60 pt-2"
                              >
                                Всі товари
                              </Link>
                              {l.subLinks!.map(sub => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setOpen(false)}
                                  className="font-sans text-xs uppercase tracking-[2px] text-white/40 hover:text-white transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.8, duration: 1 }}
                className="relative z-10 p-6 sm:p-8 border-t border-white/[0.05] flex flex-col gap-4 bg-gradient-to-t from-black to-transparent"
              >
                <div className="flex gap-4">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex-1 group relative flex items-center justify-center h-14 overflow-hidden border border-white/20 hover:border-white transition-colors duration-500"
                  >
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[3px] text-white group-hover:tracking-[5px] transition-all duration-500">
                      {t("profile_mobile")}
                    </span>
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="flex-1 group flex items-center justify-center gap-3 h-14 border border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-500"
                  >
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[3px]">
                      {t("cart_mobile")} 
                    </span>
                    <span className="font-mono text-xs font-bold bg-black text-white group-hover:bg-white group-hover:text-black w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-500">
                      {cartAmount}
                    </span>
                  </Link>
                </div>
                
                <div className="flex justify-between items-center mt-4 text-[9px] uppercase tracking-[4px] font-mono text-white/30">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <span>In Swag We Trust</span>
                  <a href="#" className="hover:text-white transition-colors">Telegram</a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
