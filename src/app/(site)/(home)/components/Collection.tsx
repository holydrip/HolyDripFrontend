'use client'
import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { CardCarousel } from "@/components/card-carousel/CardCarousel";
import { UnifrakturMaguntia } from "next/font/google";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product.service";
import { Product } from "@/lib/types";

const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });

export default function Collection() {
    const [data, setData] = useState<{title: string, products: Product[]} | null>(null);

    const sv = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const res = await ProductService.getNewCollection();
                setData(res);
            } catch (err) {
                console.error("Sanity Collection Error:", err);
            } finally {
                // setLoading(false);
            }
        };

        fetchCollection();
    }, []);

    if (!data || !data.products.length) return null;

    return (
        <motion.section 
            variants={sv} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col gap-8 px-6 sm:px-12 md:px-[70px] mt-20"
        >
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <SectionLabel text="Season 2026" />
                    <h2 className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                        {data.title}
                    </h2>
                </div>
                <a href="/catalog" className="hidden sm:flex items-center gap-2 text-white/20 hover:text-white text-[10px] uppercase tracking-[3px] transition-colors duration-300 font-light">
                    View All
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            
            <CardCarousel slides={data.products} />
        </motion.section>
    );
}