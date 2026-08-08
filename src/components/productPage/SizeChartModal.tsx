"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@deemlol/next-icons";
import { DM_Sans } from "next/font/google";

const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });


interface Props {
  isOpen: boolean;
  onClose: () => void;
  measurements: { size: string; details: string }[];
}

export function SizeChartModal({ isOpen, onClose, measurements }: Props) {
  if (!measurements || measurements.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`${dm.className} relative w-full max-w-md bg-transparent border border-white/10 p-8 md:p-10`}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[4px] text-white/40">Information</span>
                <h2 className={`font-fraktur text-4xl text-white`}>
                  Size Chart
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {measurements.map((m, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-xl font-medium text-white min-w-[30px]">{m.size}</div>
                    <div className="text-sm text-white/60 font-light leading-relaxed">
                      {m.details}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] text-white/30 uppercase tracking-[1px] leading-relaxed">
                  * Всі заміри вказані в сантиметрах. Можлива похибка 1-2 см через ручне вимірювання.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
