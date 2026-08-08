import { DM_Sans } from "next/font/google";
import { Countdown } from "@/components/countdown/Countdown";
import { Banner } from "./components/Banner";
import FAQ from "./components/faq/FAQ";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Recommended from "./components/Recommended";
import Collection from "./components/Collection";
import Sales from "./components/Sales";
import Divider from "./components/Divider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "HOLY DRIP — Кураторський fashion-архів у Києві",
  },
  description:
    "Відкрийте для себе ексклюзивний архів дизайнерського одягу в Україні. Кураторська підбірка Rick Owens, Balenciaga, Vetements та інших концептуальних брендів. Оригінали та рідкісні знахідки.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HOLY DRIP — Fashion Archive Kyiv",
    description:
      "Концептуальний стрітвір та архівні артефакти. Рідкісні оригінали, відібрані з наміром. Доставка по Україні.",
    url: "https://holydrip.com.ua",
    images: [
      {
        url: "../../../public/images/logo-full-dark.jpg",
        width: 1200,
        height: 630,
        alt: "HOLY DRIP Fashion Archive",
      },
    ],
  },
};

const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function Page() {
  const dropDate = new Date("2025-03-01T00:00:00");

  if (Date.now() < dropDate.getTime()) return <Countdown date={dropDate} />;

  return (
    <div className={`${dm.className} min-h-screen flex flex-col relative`}>

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
