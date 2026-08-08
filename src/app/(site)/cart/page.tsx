"use client";

import Image from "next/image";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { t } = useTranslation("Cart");
  const mounted = useMounted();
  const { cart, removeFromCart, setQuantity } = useCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(
      cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0)
    );
  }, [cart]);

  if (!mounted) {
    return (
      <main className="flex flex-col w-full min-h-screen pt-32 pb-20 px-6 sm:px-12 md:px-[70px]">
        <h1 className="font-fraktur text-white text-5xl sm:text-7xl mb-12 opacity-0">{t("title")}</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen pt-32 pb-20 px-6 sm:px-12 md:px-[70px]">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-fraktur text-white text-5xl sm:text-7xl mb-12 tracking-wide"
      >
        {t("title")}
      </motion.h1>

      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 border border-white/[0.05] bg-white/[0.01] rounded-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.05]">
             <ShoppingBag size={32} className="text-white/20" />
          </div>
          <div className="text-sm font-mono text-white/50 mb-8 uppercase tracking-[3px]">{t("empty")}</div>
          <Link 
            href="/catalog"
            className="group flex items-center gap-3 border border-white/20 px-8 py-4 text-[11px] uppercase tracking-[3px] text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            {t("go_to_catalog")}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 p-6 border border-white/[0.05] bg-white/[0.02] rounded-2xl relative group"
                >
                  <Link href={`/catalog/${item.id}`} className="block relative w-full sm:w-32 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                  </Link>

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <Link href={`/catalog/${item.id}`} className="text-lg font-fraktur tracking-wide text-white hover:text-white/70 transition-colors">
                          {item.name}
                        </Link>
                        <div className="text-[10px] font-sans uppercase tracking-[2px] text-white/40 mt-1">
                          {t("size")} <span className="text-white/90">{item.size}</span>
                        </div>
                        <div className="text-sm font-mono text-white/60 mt-3">
                          {item.price} UAH <span className="text-[10px] text-white/30 uppercase tracking-[1px] ml-1">{t("each")}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title={t("remove")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-6 sm:mt-0">
                      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-1">
                        <button
                          onClick={() => setQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-8 text-center text-sm font-mono text-white/90">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => setQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-lg font-mono text-white tracking-wider">
                        {item.price * item.quantity} UAH
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-[380px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="sticky top-32 p-8 border border-white/[0.05] bg-white/[0.01] rounded-2xl flex flex-col gap-8"
            >
              <h2 className="text-[11px] font-sans uppercase tracking-[4px] text-white/40">
                Замовлення
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-light">{t("total")}</span>
                  <span className="font-mono text-white text-xl tracking-wider">{total} UAH</span>
                </div>
                <div className="w-full h-[1px] bg-white/[0.05] my-2" />
                <div className="flex justify-between items-center text-xs text-white/30 font-light">
                  <span>Доставка</span>
                  <span>За тарифами перевізника</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="group flex items-center justify-center gap-3 w-full bg-white text-black px-6 py-4 text-[11px] uppercase tracking-[3px] font-medium hover:bg-white/80 transition-all duration-300 mt-4"
              >
                {t("checkout")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </main>
  );
}