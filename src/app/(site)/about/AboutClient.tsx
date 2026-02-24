"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Libre_Baskerville, UnifrakturMaguntia, DM_Sans } from "next/font/google";
import { slides } from "./about.data";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function AboutClient() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, watchDrag: true });
    const [current, setCurrent] = useState(0);

    const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div
            className={`${dm.className} flex flex-col w-full min-h-screen pb-24`}
            style={{ backgroundColor: "#050505" }}
        >
            <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-[1px] bg-white/20 origin-left"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="flex flex-col gap-3 px-6 sm:px-12 md:px-[70px] pt-16 pb-12"
            >
                <span className="text-white/25 text-[10px] uppercase tracking-[5px] font-light">Our Story</span>
                <h1 className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(48px, 8vw, 110px)" }}>
                    About Us
                </h1>
            </motion.div>

            <div className="w-full h-[1px] bg-white/[0.07]" />

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative px-6 sm:px-12 md:px-[70px] mt-16"
            >
                <div className="flex items-center gap-4 mb-10">
                    <span className={`${fraktur.className} text-white/60 text-2xl`}>{slides[current].num}</span>
                    <div className="flex-1 h-[1px] bg-white/10">
                        <motion.div
                            className="h-full bg-white/40"
                            animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[3px] font-light">
                        {current + 1} / {slides.length}
                    </span>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {slides.map((slide, i) => (
                            <div key={i} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_75%] md:flex-[0_0_55%] pr-6">
                                <div className="flex flex-col gap-8 border-l border-white/10 pl-8 py-4">
                                    <div className="flex flex-col gap-3">
                                        <span className={`${fraktur.className} text-white/20`} style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 1 }}>
                                            {slide.num}
                                        </span>
                                        <h2 className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(28px, 4vw, 52px)" }}>
                                            {slide.title}
                                        </h2>
                                    </div>
                                    <p className={`${serif.className} text-white/35 italic text-base sm:text-lg leading-relaxed font-light`}>
                                        {slide.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-6 mt-12">
                    <button onClick={prev}
                        className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] uppercase tracking-[3px] font-light transition-colors duration-300 group"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-1 transition-transform duration-300">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Prev
                    </button>

                    <div className="flex gap-2 items-center">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => emblaApi?.scrollTo(i)}
                            className={`transition-all duration-300 rounded-full ${i === current ? "w-4 h-[2px] bg-white" : "w-1 h-[2px] bg-white/20"}`}
                            />
                        ))}
                    </div>
                    
                    <button onClick={next}
                        className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] uppercase tracking-[3px] font-light transition-colors duration-300 group"
                    >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform duration-300">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </motion.div>

            <div className="px-6 sm:px-12 md:px-[70px] mt-24">
                <div className="w-full h-[1px] bg-white/[0.07]" />
                <p className={`${fraktur.className} text-white/10 mt-8`} style={{ fontSize: "clamp(24px, 4vw, 48px)" }}>
                    In Swag We Trust.
                </p>
            </div>
        </div>
    );
}