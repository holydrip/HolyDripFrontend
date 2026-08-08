"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const activeSrc = safeImages[active] ?? safeImages[0];

  return (
    <div className="grid gap-3 md:grid-cols-[52px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {safeImages.map((src, idx) => {
          const selected = idx === active;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`View image ${idx + 1}`}
              className={cn(
                "relative h-11 w-11 shrink-0 overflow-hidden rounded border",
                selected ? "border-zinc-900" : "border-zinc-300 hover:border-zinc-500"
              )}
            >
              <Image src={src} alt={`${alt} thumbnail ${idx + 1}`} fill sizes="44px" className="object-cover" />
            </button>
          );
        })}
      </div>

      <div className="order-1 overflow-hidden rounded border border-zinc-300 bg-white md:order-2">
        <div className="relative aspect-[4/3] w-full md:aspect-square">
          {activeSrc ? (
            <Image src={activeSrc} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 520px" className="object-contain p-4" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">No image</div>
          )}
        </div>
      </div>
    </div>
  );
}
