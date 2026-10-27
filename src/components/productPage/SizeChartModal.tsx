"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, HelpCircle } from "lucide-react";
import { DM_Sans } from "next/font/google";

const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  measurements?: { size: string; details: string }[];
}

export function SizeChartModal({ isOpen, onClose, measurements = [] }: Props) {
  const hasCustom = measurements && measurements.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`${dm.className} relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-black border border-white/15 p-6 sm:p-8 z-10`}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[4px] text-white/40">Розмірна сітка</span>
                <h2 className="font-fraktur text-3xl sm:text-4xl text-white">
                  Таблиця розмірів
                </h2>
              </div>

              {/* Exact measurements if available */}
              {hasCustom ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-white/70">
                    <Ruler size={14} />
                    <span>Фактичні заміри артефакту (см)</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {measurements.map((m, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white/[0.03] border border-white/10"
                      >
                        <div className="text-base font-semibold text-white tracking-widest min-w-[40px]">
                          {m.size}
                        </div>
                        <div className="text-xs sm:text-sm text-white/70 font-light">
                          {m.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Universal standard sizing table */}
              <div className="flex flex-col gap-3">
                <div className="text-[11px] uppercase tracking-[2px] text-white/50">
                  {hasCustom ? "Стандартна розмірна сітка (см)" : "Орієнтовні параметри одягу (см)"}
                </div>
                <div className="overflow-x-auto border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.04] text-[10px] uppercase tracking-[2px] text-white/50">
                        <th className="p-3">Розмір</th>
                        <th className="p-3">Груди</th>
                        <th className="p-3">Плечі</th>
                        <th className="p-3">Довжина</th>
                        <th className="p-3">Зріст</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80 font-light">
                      <tr>
                        <td className="p-3 font-medium text-white">S</td>
                        <td className="p-3">108–112</td>
                        <td className="p-3">50–52</td>
                        <td className="p-3">70–72</td>
                        <td className="p-3 text-white/50">165–175 см</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">M</td>
                        <td className="p-3">114–118</td>
                        <td className="p-3">52–54</td>
                        <td className="p-3">72–74</td>
                        <td className="p-3 text-white/50">172–182 см</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">L</td>
                        <td className="p-3">120–124</td>
                        <td className="p-3">54–56</td>
                        <td className="p-3">74–76</td>
                        <td className="p-3 text-white/50">178–188 см</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">XL</td>
                        <td className="p-3">126–132</td>
                        <td className="p-3">56–58</td>
                        <td className="p-3">76–78</td>
                        <td className="p-3 text-white/50">185+ см</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to measure guide */}
              <div className="p-4 bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-white/70">
                  <HelpCircle size={14} />
                  <span>Як правильно зробити заміри</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Розкладіть вашу улюблену подібну річ на рівній поверхні. Виміряйте ширину між пахвами (груди) та повну довжину від верхнього краю коміра до низу. Більшість наших моделей мають фірмовий вільний або boxy/oversize крій.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-[1px]">
                  Сумніваєтесь з розміром? Напишіть нам у Telegram — консьєрж надішле персональні виміри з сантиметровою стрічкою.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
