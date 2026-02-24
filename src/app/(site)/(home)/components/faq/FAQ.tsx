'use client'

import { motion } from "framer-motion"
import { Libre_Baskerville, UnifrakturMaguntia } from "next/font/google";
import SectionLabel from "../SectionLabel";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { fallbackFaq } from "./faq.data";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: ["400"] });

interface FAQData {
    sectionLabel: string;
    title: string;
    items: { q: string; a: string }[];
    footerText: string;
}

export default function FAQ() {
    const [data, setData] = useState<FAQData | null>(null);
    const sv = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
    
    useEffect(() => {
        const query = `*[_type == "faqBlock"][0]{
            sectionLabel,
            title,
            items[]{
                q,
                a
            },
            footerText
        }`;

        client.fetch(query)
            .then(res => {
                if (res) setData(res);
            })
            .catch(err => console.error("Sanity FAQ Error:", err));
    }, []);

    const displayItems = data?.items?.length ? data.items : fallbackFaq;
    const label = data?.sectionLabel || "Info & Rules";
    const heading = data?.title || "FAQ";
    const footer = data?.footerText || "In Swag We Trust.";

    return (
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col gap-12 px-6 sm:px-12 md:px-[70px] mt-20">
            
            <div className="flex flex-col gap-2">
              <SectionLabel text={label} />
              <h2 className={`${fraktur.className} text-white`} style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                {heading}
              </h2>
            </div>

            <div className="flex flex-col">
              {displayItems.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-16 py-8 border-b border-white/[0.07] group"
                >
                  <p className={`${serif.className} text-white/60 text-sm italic font-light sm:w-[40%] shrink-0 group-hover:text-white/90 transition-colors duration-300`}>
                    {item.q}
                  </p>
                  <p className="text-white/25 text-sm leading-relaxed font-light group-hover:text-white/50 transition-colors duration-300 whitespace-pre-line">
                    {item.a}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className={`${fraktur.className} text-white/15 text-2xl`}>
                {footer}
            </p>
        </motion.section>
    )
}