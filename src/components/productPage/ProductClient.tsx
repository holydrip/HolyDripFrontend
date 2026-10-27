"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Libre_Baskerville, DM_Sans, Cinzel_Decorative } from "next/font/google";
import type { Product } from "@/lib/types";
import ImageGallery from "./ImageGallery";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";
import { QuickBuyModal } from "./QuickBuyModal";
import { SizeChartModal } from "./SizeChartModal";
import { ProductCard } from "@/components/product/ProductCard";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { Truck, ShieldCheck, Sparkles, Layers, Ruler } from "lucide-react";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = Cinzel_Decorative({ subsets: ["latin"], weight: ["700"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function ProductClient({ 
  product, 
  relatedProducts = [] 
}: { 
  product: Product; 
  relatedProducts?: Product[];
}) {
  const { t } = useTranslation("Product");
  const [size, setSize] = useState<string | null>(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Derive material based on product title or description
  const detectMaterial = () => {
    const text = (product.name + " " + (product.description || "")).toLowerCase();
    if (text.includes("denim") || text.includes("jeans") || text.includes("джинс")) return "100% Cotton Denim / Щільний денім";
    if (text.includes("leather") || text.includes("шкір")) return "Преміальна шкіра / Premium Leather";
    if (text.includes("wool") || text.includes("вовн")) return "Вовняний бленд / Wool Blend";
    if (text.includes("hoodie") || text.includes("худі") || text.includes("zip")) return "100% Heavyweight Cotton (450+ g/m²)";
    return "100% Щільна преміальна бавовна (Premium Cotton)";
  };

  return (
    <div className={`${dm.className} min-h-screen w-full`}>
      <motion.div
        initial={{ scaleX: 0 }} 
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[1px] bg-white/20 origin-left"
      />

      <div className="px-6 sm:px-12 md:px-[70px] py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Gallery Column (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          {/* Details Column (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-7">
            {/* Delivery Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-500/30 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[2px] text-emerald-300 font-medium">
                В наявності в Києві (1–2 дні)
              </span>
            </div>

            {/* Title & Price */}
            <div className="flex flex-col gap-3">
              <motion.div
                initial={{ scaleX: 0 }} 
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-8 h-[1px] bg-white/30 origin-left"
              />
              <h1 
                className="font-fraktur text-white leading-tight tracking-wide"
                style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
              >
                {product.name}
              </h1>
              <p className={`${serif.className} text-white/80 italic text-2xl font-light`}>
                {product.price.toLocaleString()} UAH
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/[0.08]" />

            {/* Size Selection */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/60 uppercase tracking-[2px]">
                  {t("choose_size")}
                </span>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] uppercase tracking-[1px] underline underline-offset-4 transition-colors"
                >
                  <Ruler size={13} />
                  <span>Таблиця розмірів</span>
                </button>
              </div>
              <SizeSelector
                sizes={product.sizes || []}
                value={size}
                onChange={setSize}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <AddToCartButton product={product} size={size} />
              <button
                onClick={() => {
                  if (!size) {
                    alert(t("please_choose_size"));
                    return;
                  }
                  setIsQuickBuyOpen(true);
                }}
                className="w-full border border-white/20 bg-transparent text-white py-4 text-[10px] uppercase tracking-[3px] hover:bg-white/[0.06] transition-all"
              >
                {t("quick_buy")}
              </button>
            </div>

            <QuickBuyModal 
              isOpen={isQuickBuyOpen} 
              onClose={() => setIsQuickBuyOpen(false)} 
              product={product} 
              size={size} 
            />

            <SizeChartModal
              isOpen={isSizeChartOpen}
              onClose={() => setIsSizeChartOpen(false)}
              measurements={product.measurements || []}
            />

            {/* Structured Specifications Grid */}
            <div className="border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-4">
              <div className="text-[10px] uppercase tracking-[3px] text-white/40 pb-2 border-b border-white/[0.06]">
                Характеристики артефакту
              </div>
              
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-[1px] mb-0.5">Матеріал</span>
                  <span className="text-white/90 font-light">{detectMaterial()}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-[1px] mb-0.5">Стан</span>
                  <span className="text-white/90 font-light">10/10 (Новий з бірками)</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-[1px] mb-0.5">Сезон</span>
                  <span className="text-white/90 font-light">All-Season / Мультисезонний</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-[1px] mb-0.5">Автентичність</span>
                  <span className="text-white/90 font-light">100% Curated Piece</span>
                </div>
              </div>

              {/* Exact Measurements snippet if available */}
              {product.measurements && product.measurements.length > 0 && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase tracking-[1px] mb-2">Фактичні заміри (см)</span>
                  <div className="flex flex-wrap gap-2">
                    {product.measurements.map((m, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[11px] text-white/80">
                        <strong className="text-white mr-1.5">{m.size}:</strong> {m.details}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Perks / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 border border-white/[0.07] bg-white/[0.01]">
                <Truck size={16} className="text-white/60 shrink-0" />
                <span className="text-[10px] uppercase tracking-[1px] text-white/60">Нова Пошта 1–2 дні</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 border border-white/[0.07] bg-white/[0.01]">
                <ShieldCheck size={16} className="text-white/60 shrink-0" />
                <span className="text-[10px] uppercase tracking-[1px] text-white/60">Контроль якості</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 border border-white/[0.07] bg-white/[0.01]">
                <Sparkles size={16} className="text-white/60 shrink-0" />
                <span className="text-[10px] uppercase tracking-[1px] text-white/60">Archive Selection</span>
              </div>
            </div>

            {/* Detailed Description */}
            {product.description && (
              <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] text-white/40">Опис</span>
                <p className="text-white/60 text-sm leading-relaxed font-light whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products Block */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-28 pt-16 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[4px] text-white/40">Рекомендовано</span>
                <h2 className="font-fraktur text-3xl sm:text-4xl text-white mt-1">
                  Схожі артефакти
                </h2>
              </div>
              <Link 
                href="/catalog" 
                className="text-[11px] uppercase tracking-[2px] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
              >
                Весь каталог →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
