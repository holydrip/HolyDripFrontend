import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Libre_Baskerville, UnifrakturMaguntia, DM_Sans } from "next/font/google";

const serif = Libre_Baskerville({ 
    subsets: ["latin"], 
    weight: ["400", "700"], 
    style: ["normal", "italic"],
    variable: "--font-serif" 
});

const fraktur = UnifrakturMaguntia({ 
    subsets: ["latin"], 
    weight: ["400"],
    variable: "--font-fraktur"
});

const dm = DM_Sans({ 
    subsets: ["latin"], 
    weight: ["300", "400", "500", "700"],
    variable: "--font-sans" 
});

export const metadata: Metadata = {
  metadataBase: new URL("https://holydrip.com"),
  title: {
    default: "HOLY DRIP",
    template: "%s | HOLY DRIP",
  },
  description:
    "HOLY DRIP — кураторський fashion-архів, народжений у Києві. Rick Owens, Balenciaga, Margiela, Vetements, ERD. Рідкісні оригінали та archive pieces. Не товари — артефакти.",
  keywords: [
    "HOLY DRIP",
    "fashion архів",
    "люксовий стрітвір",
    "дизайнерський одяг",
    "архівні речі",
    "Rick Owens",
    "Balenciaga",
    "Margiela",
    "Vetements",
    "ERD",
    "Київ бренд"
  ],
  authors: [{ name: "HOLY DRIP" }],
  creator: "HOLY DRIP",
  publisher: "HOLY DRIP",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "HOLY DRIP",
    description:
      "Народжений у Києві. Кураторський архів рідкісних дизайнерських артефактів. Rick Owens. Balenciaga. Margiela. Vetements. ERD.",
    url: "https://holydrip.com",
    siteName: "HOLY DRIP",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "../../public/images/logo-full-dark.jpg",
        width: 1200,
        height: 630,
        alt: "HOLY DRIP — Fashion Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOLY DRIP — Архів дизайнерського одягу",
    description:
      "Рідкісні оригінали. Архівні речі. Артефакти, відібрані з наміром.",
    images: ["../../public/images/logo-full-dark.jpg"],
  },
  category: "fashion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <body className={`${serif.variable} ${fraktur.variable} ${dm.variable} font-sans min-h-screen flex flex-col`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
