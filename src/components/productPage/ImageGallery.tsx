"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const activeSrc = safeImages[active] ?? safeImages[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[60px_1fr] items-start">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {safeImages.map((src, idx) => {
          const selected = idx === active;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`View image ${idx + 1}`}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden border transition-colors",
                selected ? "border-white" : "border-white/10 hover:border-white/50"
              )}
            >
              <Image src={src} alt={`${alt} thumbnail ${idx + 1}`} fill sizes="44px" className="object-cover" />
            </button>
          );
        })}
      </div>

      <div className="order-1 overflow-hidden border border-white/10 bg-white/[0.02] lg:order-2">
        <div className="relative aspect-[4/3] w-full lg:aspect-[4/5]">
          {activeSrc ? (
            <Image src={activeSrc} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/30 uppercase tracking-widest">No image</div>
          )}
        </div>
      </div>
    </div>
  );
}
