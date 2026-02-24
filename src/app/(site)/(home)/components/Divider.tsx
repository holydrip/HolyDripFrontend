'use client'
import { motion } from "framer-motion";

export default function Divider() {
    return (
        <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1 } } }}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="w-full h-[1px] bg-white/10 origin-left"
        />
    )
}