"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "@deemlol/next-icons";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { DM_Sans } from "next/font/google";

const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("Search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/product/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden hidden md:flex items-center mr-3"
          >
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full bg-transparent border-0 border-b border-white/20 text-white text-[10px] tracking-widest outline-none placeholder:text-white/30 placeholder:uppercase placeholder:tracking-[2px] px-1 py-1.5 focus:border-white transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setQuery("");
        }}
        className="hidden md:flex items-center text-white hover:text-white/60 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Search size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`${dm.className} absolute top-full right-0 mt-4 w-[300px] bg-[#050505]/95 backdrop-blur-md border border-white/20 shadow-2xl z-50 overflow-hidden`}
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : hasSearched && results.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  {t("no_results")}
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/catalog/${product.id}`}
                      onClick={() => { setIsOpen(false); setQuery(""); }}
                      className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors border-b border-white/[0.05] last:border-0"
                    >
                      <div className="w-12 h-16 relative bg-[#111] flex-shrink-0 overflow-hidden">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-white text-xs font-medium truncate">{product.name}</span>
                        <span className="text-white/40 text-[10px] mt-1">{product.price} ₴</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
