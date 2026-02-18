"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FiltersBar, Filters } from "@/components/catalog/FiltersBar";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/Skeleton";


type ApiResp = {
    items: Product[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
};

function buildQuery(f: Filters, page: number) {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", "9");
    sp.set("min", String(f.min));
    sp.set("max", String(f.max));
    sp.set("sort", f.sort);
    return sp.toString();
}

export default function CatalogPage() {
    const [filters, setFilters] = useState<Filters>({ min: 0, max: 30000, sort: "relevance" });
    const [items, setItems] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const queryKey = useMemo(() => JSON.stringify(filters), [filters]);

    async function load(p: number, mode: "replace" | "append") {
        setLoading(true);
        const q = buildQuery(filters, p);
        const res = await fetch(`/api/products?${q}`, { cache: "no-store" });
        const data: ApiResp = await res.json();
        setHasMore(data.hasMore);

        setItems((prev) => (mode === "append" ? [...prev, ...data.items] : data.items));
        setLoading(false);
        setInitialLoading(false);
    }

    useEffect(() => {
        // reset to page 1 when filters change
        setPage(1);
        setInitialLoading(true);
        load(1, "replace");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryKey]);

    const empty = !initialLoading && items.length === 0;

    return (
        <main className="p-10 flex gap-10 flex-col">
            <h1 className="text-4xl text-white text-center">ITEMS</h1>

            <div className="">
                <FiltersBar
                    value={filters}
                    onChange={setFilters}
                    onReset={() => setFilters({ min: 0, max: 30000, sort: "relevance" })}
                    maxCap={30000}
                />
            </div>

            <div className="">
                {initialLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                                <Skeleton className="aspect-[4/3] w-full" />
                                <Skeleton className="mt-3 h-4 w-2/3" />
                                <Skeleton className="mt-2 h-4 w-1/2" />
                                <Skeleton className="mt-3 h-9 w-full" />
                            </div>
                        ))}
                    </div>
                ) : empty ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
                        <div className="text-sm font-medium text-white">No products</div>
                        <div className="mt-1 text-sm text-gray-600">Try changing filters.</div>
                    </div>
                ) : (
                    <>
                        <ProductGrid items={items} />

                        <div className="mt-6 flex items-center justify-center">
                            {hasMore ? (
                                <Button
                                    variant="secondary"
                                    onClick={async () => {
                                        const next = page + 1;
                                        setPage(next);
                                        await load(next, "append");
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Load more"}
                                </Button>
                            ) : (
                                <div className="text-sm text-white  ">End of results</div>
                            )}
                        </div>

                        {loading && (
                            <div className="mt-4 flex justify-center">
                                <Loader />
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
