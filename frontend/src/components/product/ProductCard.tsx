"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 700);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <Link 
      href={`/cart/${product.slug}`} 
      className="group relative flex flex-col w-full bg-transparent overflow-hidden select-none transition-all duration-500 ease-out hover:-translate-y-1"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-white/[0.02]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center gap-3 pt-5 pb-2">
        <div className="flex flex-col items-center gap-1.5 w-full text-center">
          <div className="font-sans text-[12px] sm:text-[13px] font-medium uppercase tracking-[3px] text-white/90 truncate w-full">
            {product.name}
          </div>
          <div className="font-sans text-[12px] text-white/40 font-light tracking-[2px]">
            {product.price.toLocaleString()} UAH
          </div>
        </div>
      </div>
    </Link>
  );
}