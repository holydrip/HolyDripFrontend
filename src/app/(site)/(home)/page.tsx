"use client";
import { motion } from "framer-motion";
import { DM_Sans } from "next/font/google";
import { Countdown } from "@/components/countdown/Countdown";
import { Banner } from "./components/Banner";
import FAQ from "./components/faq/FAQ";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Recommended from "./components/Recommended";
import Collection from "./components/Collection";
import Sales from "./components/Sales";

const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

const Divider = () => (
  <motion.div
    variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1 } } }}
    initial="hidden" whileInView="visible" viewport={{ once: true }}
    className="w-full h-[1px] bg-white/10 origin-left"
  />
);

export default function Page() {
  const dropDate = new Date("2025-03-01T00:00:00");

  if (Date.now() < dropDate.getTime()) return <Countdown date={dropDate} />;

  return (
    <div className={`${dm.className} flex flex-col w-full min-h-[90vh] pb-32`}
      style={{ backgroundColor: "#050505" }}>

      <Banner />
      <Marquee />
      <Recommended/>

      <div className="px-6 sm:px-12 md:px-[70px] mt-24"><Divider /></div>

      <About />

      <div className="px-6 sm:px-12 md:px-[70px] mt-24"><Divider /></div>

      <Collection/>

      <div className="px-6 sm:px-12 md:px-[70px] mt-24"><Divider /></div>

      <Sales/>

      <div className="px-6 sm:px-12 md:px-[70px] mt-24"><Divider /></div>

      <FAQ />
    </div>
  );
}