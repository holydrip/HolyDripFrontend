"use client";
import { motion } from "framer-motion";
import { Libre_Baskerville, UnifrakturMaguntia, DM_Sans } from "next/font/google";

const cormorant = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

const categories = ["Hoodies", "T-Shirts", "Jeans", "Shorts", "Headwear"];

export function Banner() {
  return (
    <div
      className="relative w-full overflow-hidden flex flex-col justify-between px-6 sm:px-12 md:px-[70px] pt-16 pb-12 sm:pb-16 md:pb-20"
      style={{
        minHeight: "90vh",
        maxHeight: "900px",
        background: "linear-gradient(135deg, #020202 0%, #0a0a0a 50%, #020202 100%)",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/30 origin-left"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <img
          src="/images/logo-full-dark.png"
          alt=""
          className="w-[60%] max-w-[640px] opacity-[0.08] mix-blend-screen"
          style={{ filter: "grayscale(100%) brightness(3)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`${dm.className} flex items-center justify-between`}
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[4px] font-light">
          Holy Drip — Studio
        </span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-[4px] font-light">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          New Drop
        </motion.span>
      </motion.div>

      <div className="relative z-10 flex flex-col gap-8 mt-auto">
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full h-[1px] bg-white/20 origin-left"
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <h1
              className={`${fraktur.className} text-white leading-[85%]`}
              style={{ fontSize: "clamp(72px, 13vw, 180px)" }}
            >
              Holy<br />
              <span>Drip</span>
            </h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className={`${dm.className} flex flex-wrap gap-2`}>
              {categories.map((cat, i) => (
                <motion.a key={cat} href="/catalog"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.07 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                  className="px-3 py-1 border border-white/15 text-white/35 text-[10px] uppercase tracking-[2px] transition-all duration-300 cursor-pointer font-light"
                >
                  {cat}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`${dm.className} flex flex-col gap-5 sm:items-end`}
          >
            <p className={`${cormorant.className} text-white/35 text-xl sm:text-2xl italic sm:text-right leading-relaxed font-light`}>
              Clothes for those<br />who dare to stand out
            </p>
            <motion.a href="/catalog"
              whileHover={{ backgroundColor: "#fff", color: "#000" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-3 border border-white/50 text-white px-8 py-3.5 text-[11px] uppercase tracking-[3px] font-light"
            >
              Shop Now
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-full h-[1px] bg-white/20 origin-left"
        />
      </div>
    </div>
  );
}