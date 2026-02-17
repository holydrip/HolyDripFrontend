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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-700">Size</p>
        <p className="text-[11px] text-zinc-500">{value ? `Selected: ${value}` : "Select one"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const selected = value === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={cn(
                "h-5 rounded-full border px-2 text-[10px] leading-none transition",
                selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-400 bg-white text-zinc-800 hover:border-zinc-900"
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
