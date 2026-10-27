"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images = [], alt }: { images?: string[]; alt: string }) {
  const safeImages = useMemo(() => (images || []).filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeSrc = safeImages[active] ?? safeImages[0];

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[70px_1fr] items-start">
        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible pb-2 lg:pb-0">
            {safeImages.map((src, idx) => {
              const selected = idx === active;
              return (
                <button
                  key={src + idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden border transition-all duration-300",
                    selected 
                      ? "border-white ring-1 ring-white/50 scale-102" 
                      : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt={`${alt} thumbnail ${idx + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* Main image container */}
        <div 
          className={cn(
            "order-1 group relative overflow-hidden border border-white/10 bg-white/[0.02] cursor-zoom-in transition-all",
            safeImages.length <= 1 && "lg:col-span-2"
          )}
          onClick={() => safeImages.length > 0 && setIsLightboxOpen(true)}
        >
          <div className="relative aspect-[4/3] w-full lg:aspect-[4/5]">
            {activeSrc ? (
              <>
                <Image 
                  src={activeSrc} 
                  alt={alt} 
                  fill 
                  priority 
                  sizes="(max-width: 1024px) 100vw, 600px" 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={13} className="text-white" />
                  <span className="text-[10px] uppercase tracking-[2px] text-white/80">Збільшити</span>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/30 uppercase tracking-widest">
                No image
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && activeSrc && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 select-none">
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0 z-0" 
              onClick={() => setIsLightboxOpen(false)} 
            />

            {/* Top Bar with Info and Close */}
            <div className="absolute top-4 sm:top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-3">
                <span className="font-fraktur text-lg text-white/80">{alt}</span>
                <span className="text-xs uppercase tracking-[2px] text-white/40">
                  {active + 1} / {safeImages.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="pointer-events-auto p-2.5 border border-white/20 bg-black/50 text-white/80 hover:text-white hover:border-white transition-all rounded-none"
                aria-label="Close fullscreen"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation buttons */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 border border-white/20 text-white transition-all"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 border border-white/20 text-white transition-all"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Active Fullscreen Image */}
            <div className="relative z-10 w-full h-[75vh] max-w-4xl flex items-center justify-center">
              <motion.div
                key={activeSrc}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeSrc}
                  alt={`${alt} view ${active + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Bottom thumbnail strip */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-5 z-20 flex gap-2 overflow-x-auto max-w-[90vw] p-2 bg-black/60 backdrop-blur-md border border-white/10">
                {safeImages.map((src, idx) => (
                  <button
                    key={"lb-" + src + idx}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={cn(
                      "relative h-12 w-12 shrink-0 overflow-hidden border transition-all",
                      idx === active ? "border-white ring-1 ring-white" : "border-white/20 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={src} alt="thumbnail" fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
