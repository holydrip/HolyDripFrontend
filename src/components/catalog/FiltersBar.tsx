"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm text-center md:text-left">
            <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
                {/* Price range */}
                <div className="">
                    <div className="text-sm font-medium">Price range</div>
                    <div className="mt-2 grid lg:grid-cols-2 md:grid-cols-1 gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={value.min}
                            onChange={(e) => onChange({ ...value, min: Number(e.target.value || 0) })}
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={value.max}
                            onChange={(e) =>
                                onChange({ ...value, max: Number(e.target.value || maxCap) })
                            }
                        />
                    </div>

                    {/* Simple slider (max) */}
                    <div className="mt-2">
                        <input
                            type="range"
                            min={0}
                            max={maxCap}
                            value={Math.min(value.max, maxCap)}
                            onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
                            className="w-full"
                        />
                        <div className="mt-1 text-xs text-gray-500">Max: {value.max}</div>
                    </div>
                </div>

                {/* Sort */}
                <div className="">
                    <div className="text-sm font-medium">Sort</div>
                    <select
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                        value={value.sort}
                        onChange={(e) => onChange({ ...value, sort: e.target.value })}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                    </select>

                    <Button variant="secondary" className="mt-3 w-full" onClick={onReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
