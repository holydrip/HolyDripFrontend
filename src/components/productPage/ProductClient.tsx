"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ImageGallery from "./ImageGallery";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";
import { Righteous } from "next/font/google";

const righteous = Righteous({
  weight: "400",
  subsets: ['latin-ext']
})

export default function ProductClient({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 w-full ">
      <div className="rounded border border-zinc-300 bg-white/90 shadow-sm">
        <div className="grid gap-6 p-4 md:grid-cols-[1.05fr_0.95fr] md:p-6">
          
          <ImageGallery images={product.images} alt={product.name} />

          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="font-serif text-3xl leading-none tracking-tight md:text-4xl">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold text-gray-900">
                  {product.price}
                </p>
                {/* {product.discountPct && product.discountPct > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatMoney(product.price)}
                  </span>
                )} */}
              </div>
            </div>

            <SizeSelector 
              sizes={product.sizes || []} 
              value={size} 
              onChange={setSize} 
            />

            <AddToCartButton product={product} size={size} />

            <div className={`pt-2 text-sm leading-6 text-gray-600 whitespace-pre-line ${righteous.className}`}>
              {product.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}