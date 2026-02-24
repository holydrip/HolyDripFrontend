"use client";

export type Filters = {
  min: number;
  max: number;
  sort: string;
};

export function FiltersBar({
  value,
  onChange,
  onReset,
  maxCap = 30000,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  maxCap?: number;
}) {
  return (
    <div className="font-sans flex flex-col sm:flex-row gap-8 sm:items-end">
      <div className="flex flex-col gap-3">
        <span className="text-white/25 text-[10px] uppercase tracking-[4px] font-light">Ціна (UAH)</span>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <input
              type="number"
              placeholder="Від"
              value={value.min || ""} 
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                onChange({ ...value, min: val });
              }}
              className="w-20 bg-transparent border-b border-white/10 text-white text-[13px] font-light py-1 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <span className="text-white/10">—</span>
          <div className="flex flex-col gap-1">
            <input
              type="number"
              placeholder="До"
              value={value.max || ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 30000 : Number(e.target.value);
                onChange({ ...value, max: val });
              }}
              className="w-20 bg-transparent border-b border-white/10 text-white text-[13px] font-light py-1 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-white/25 text-[10px] uppercase tracking-[4px] font-light">Сортувати</span>
        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
          className="bg-transparent border-b border-white/10 text-white text-[13px] font-light py-1 pr-8 focus:outline-none focus:border-white/40 transition-colors cursor-pointer appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'white\' stroke-opacity=\'0.3\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
        >
          <option value="relevance" className="bg-[#0a0a0a]">За замовчуванням</option>
          <option value="price-asc" className="bg-[#0a0a0a]">Дешевші спочатку</option>
          <option value="price-desc" className="bg-[#0a0a0a]">Дорожчі спочатку</option>
          <option value="newest" className="bg-[#0a0a0a]">Новинки</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="sm:ml-auto self-start sm:self-auto text-white/30 hover:text-white text-[10px] uppercase tracking-[3px] font-light transition-colors py-1 border-b border-transparent hover:border-white"
      >
        Очистити
      </button>
    </div>
  );
}