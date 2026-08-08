"use client";

import { cn } from "@/lib/utils";
export default function SizeSelector({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const selected = value === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={cn(
                "h-10 min-w-[40px] px-4 text-[11px] uppercase tracking-[2px] transition-all flex items-center justify-center border",
                selected
                  ? "border-white bg-white text-black font-medium"
                  : "border-white/20 bg-transparent text-white/60 hover:border-white hover:text-white hover:bg-white/[0.05]",
              )}
              aria-pressed={selected}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
