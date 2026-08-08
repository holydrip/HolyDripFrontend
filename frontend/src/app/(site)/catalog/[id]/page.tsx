'use client'

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FiltersBar, Filters } from "@/components/catalog/FiltersBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { CategoryService } from "@/services/category.service";


interface Props {
  params: Promise<{ id: string }>;
}



export default function CatalogPage({ params }: Props) {
  const [filters, setFilters] = useState<Filters>({ min: 0, max: 30000, sort: "relevance" });
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProducts() {
      const { id } = await params;
      
      try {
        const data = await CategoryService.getCategoryById(id);
        if (data && data.products) {
          setAllItems(data.products);
        }
      } catch (error) {
        console.error("Помилка завантаження товарів:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProducts();
  }, [params]);

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    result = result.filter((item) => {
      const min = filters.min || 0;
      const max = filters.max || Infinity; 
      return item.price >= min && item.price <= max;
    });

    if (filters.sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [allItems, filters]);

  const empty = !initialLoading && filteredItems.length === 0;

  return (
    <div className="font-sans flex flex-col w-full min-h-screen pb-24">
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[1px] bg-white/20 origin-left"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="flex flex-col gap-4 px-6 sm:px-12 md:px-[70px] pt-16 pb-10"
      >
        <div className="flex flex-col gap-2">
          <span className="text-white/25 text-[10px] uppercase tracking-[5px] font-light">Каталог</span>
          <h1 className={`font-fraktur text-white text-6xl md:text-8xl lg:text-[110px] leading-none font-fraktur`}>
            Collection
          </h1>
        </div>
      </motion.div>

      <div className="w-full h-[1px] bg-white/[0.07]" />

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="px-6 sm:px-12 md:px-[70px] py-6 border-b border-white/[0.07]"
      >
        <FiltersBar
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters({ min: 0, max: 30000, sort: "relevance" })}
        />
      </motion.div>

      <div className="px-6 sm:px-12 md:px-[70px] mt-10">
        {initialLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] w-full rounded-none bg-white/[0.03]" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-2/3 bg-white/[0.03]" />
                  <Skeleton className="h-3 w-1/3 bg-white/[0.03]" />
                </div>
              </div>
            ))}
          </div>
        ) : empty ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 py-32 border border-white/[0.05]"
          >
            <p className="font-fraktur text-white/10 text-4xl md:text-6xl text-center">
              Нічого не знайдено
            </p>
            <button
              onClick={() => setFilters({ min: 0, max: 30000, sort: "relevance" })}
              className="border border-white/20 text-white/40 hover:text-white hover:border-white px-8 py-3 text-[10px] uppercase tracking-[3px] transition-all duration-300"
            >
              Скинути фільтри
            </button>
          </motion.div>
        ) : (
          <ProductGrid items={filteredItems} />
        )}
      </div>
    </div>
  );
}