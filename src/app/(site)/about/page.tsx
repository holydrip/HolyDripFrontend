import AboutClient from "./AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про нас", 
  description:
    "Історія та філософія HOLY DRIP. Ми не просто продаємо одяг, ми збираємо концептуальні артефакти, рідкісні архівні речі та люксовий стрітвір у серці Києва.",
  keywords: [
    "про HOLY DRIP",
    "філософія бренду",
    "концепт-стор Київ",
    "історія HOLY DRIP",
    "архівний дизайнерський одяг",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Про нас | Філософія HOLY DRIP",
    description:
      "Дізнайтеся більше про київський кураторський fashion-архів. Відбірні archive pieces та рідкісні оригінали.",
    url: "https://holydrip.com.ua/about",
    images: [
      {
        url: "../../../public/images/logo-full-dark.jpg", 
        width: 1200,
        height: 630,
        alt: "Команда та філософія HOLY DRIP",
      },
    ],
  },
};

export default function Page() {
  return <AboutClient/>
}