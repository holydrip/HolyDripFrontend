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
import { useTranslation } from "@/hooks/useTranslation";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = Cinzel_Decorative({ subsets: ["latin"], weight: ["700"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function ProductClient({ product }: { product: Product }) {
  const { t } = useTranslation("Product");
  const [size, setSize] = useState<string | null>(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  return (
    <div
      className={`${dm.className} min-h-screen w-full`}
    >
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[1px] bg-white/20 origin-left"
      />

      <div className="px-6 sm:px-12 md:px-[70px] py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >
          <ImageGallery images={product.images} alt={product.name} />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-8 h-[1px] bg-white/30 origin-left"
              />
              <h1 className={`font-fraktur text-white leading-tight`}
                style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
                {product.name}
              </h1>
              <p className={`${serif.className} text-white/50 italic text-2xl font-light`}>
                {product.price} UAH
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/[0.07]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50 uppercase tracking-[2px]">{t("choose_size")}</span>
                {product.measurements && product.measurements.length > 0 && (
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-white/60 hover:text-white text-[11px] uppercase tracking-[1px] underline underline-offset-4 transition-colors"
                  >
                    {t("size_guide")}
                  </button>
                )}
              </div>
              <SizeSelector
                sizes={product.sizes || []}
                value={size}
                onChange={setSize}
              />
            </div>

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
                    className="w-full border border-white/20 bg-transparent text-white py-4 text-[10px] uppercase tracking-[3px] hover:bg-white/[0.05] transition-all"
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

            {product.description && (
              <div className="w-full h-[1px] bg-white/[0.07]" />
            )}

            {product.description && (
              <p className="text-white/25 text-sm leading-relaxed font-light whitespace-pre-line">
                {product.description}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
