'use client'

import { motion } from "framer-motion"
import { Libre_Baskerville, UnifrakturMaguntia } from "next/font/google";
import SectionLabel from "./SectionLabel";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });

interface AboutData {
    title: string;
    desc: string;
    stats: { value: string; label: string }[];
}

export default function About() {
    const [data, setData] = useState<AboutData | null>(null);
    const sv = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

    useEffect(() => {
        const query = `*[_type == "about-us"][0]{
            title,
            desc,
            stats
        }`;
        
        client.fetch(query).then((res) => {
            if (res) setData(res);
        }).catch(err => console.error("Sanity fetch error:", err));
    }, []);

    if (!data) return null;

    return (
        <motion.section 
            variants={sv} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 px-6 sm:px-12 md:px-[70px] mt-20 items-start"
        >
            <div className="flex flex-col gap-7">
                <SectionLabel text="Про сервіс" />
                
                <h2 className={`${fraktur.className} text-white leading-tight`} style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
                    {data.title}
                </h2>
                
                <p className={`${serif.className} text-white/40 text-base italic leading-relaxed font-light whitespace-pre-line`}>
                    {data.desc}
                </p>

                <motion.a href="/about"
                    whileHover={{ backgroundColor: "#fff", color: "#000" }} transition={{ duration: 0.2 }}
                    className="self-start flex items-center gap-3 border border-white/20 text-white px-6 py-3 text-[10px] uppercase tracking-[3px] font-light"
                >
                    Дізнатись більше
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </motion.a>
            </div>

            <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
                {data.stats?.map((s, i) => (
                    <motion.div 
                        key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="flex flex-col items-center justify-center text-center gap-1.5 py-12 bg-[#050505]"
                    >
                        <span className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
                            {s.value}
                        </span>
                        <span className="text-white/20 text-[10px] uppercase tracking-[3px] font-light">
                            {s.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}