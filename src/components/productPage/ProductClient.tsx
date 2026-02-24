"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Libre_Baskerville, UnifrakturMaguntia, DM_Sans } from "next/font/google";
import type { Product } from "@/lib/types";
import ImageGallery from "./ImageGallery";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function ProductClient({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div
      className={`${dm.className} min-h-screen w-full`}
      style={{ backgroundColor: "#050505" }}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
        >
          <ImageGallery images={product.images} alt={product.name} />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-8 h-[1px] bg-white/30 origin-left"
              />
              <h1 className={`${fraktur.className} text-white leading-tight`}
                style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
                {product.name}
              </h1>
              <p className={`${serif.className} text-white/50 italic text-2xl font-light`}>
                {product.price} UAH
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/[0.07]" />

            <SizeSelector
              sizes={product.sizes || []}
              value={size}
              onChange={setSize}
            />

            <AddToCartButton product={product} size={size} />

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