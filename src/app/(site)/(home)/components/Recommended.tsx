'use client'
import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import ProductCard from "@/components/product-card/ProductCard";
import { UnifrakturMaguntia } from "next/font/google";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product.service";
import { Product } from "@/lib/types";

const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });

export default function Recommended() {
    const [recommended, setRecommended] = useState<{title: string, products: Product[]} | null>(null);

    const sv = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await ProductService.getRecommended();
                console.log(res)
                setRecommended(res);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchRecommended();
    }, []);

    return (
        <>
            {recommended && recommended.products.length > 0 && (
                    <motion.section 
                        variants={sv} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="flex flex-col gap-8 px-6 sm:px-12 md:px-[70px] mt-24"
                    >
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col gap-2">
                                <SectionLabel text="Just Arrived" />
                                <h2 className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                                    {recommended.title}
                                </h2>
                            </div>
                            <a href="/catalog" className="hidden sm:flex items-center gap-2 text-white/20 hover:text-white text-[10px] uppercase tracking-[3px] transition-colors duration-300 font-light">
                                View All
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {recommended.products.map((p, i) => (
                                <motion.div 
                                    key={p.id} 
                                    initial={{ opacity: 0, y: 24 }} 
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} 
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <ProductCard product={{...p, images: p.images?.length ? p.images : [null] as any}} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
        </>
    )
}