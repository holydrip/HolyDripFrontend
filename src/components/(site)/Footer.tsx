"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { DM_Sans } from "next/font/google";
import Logo from "../../../public/images/logo-full-dark.png";


const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

export default function Footer() {
  const { t } = useTranslation("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${dm.className} border-t border-white/[0.07] bg-transparent pt-16 pb-8 mt-auto`}>
      <div className="px-6 sm:px-12 md:px-[70px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image src={Logo} alt="Holy Drip" className="w-28 h-auto opacity-80 hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <p className="text-white/20 text-xs leading-relaxed font-light max-w-[180px]">
              {t("desc")}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-white/25 text-[10px] uppercase tracking-[4px] font-light">{t("clients")}</span>
            <ul className="flex flex-col gap-3">
              {[
                { label: t("delivery"), href: "/info/delivery" },
                { label: t("returns"), href: "/info/returns" },
                { label: t("catalog"), href: "/catalog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/30 hover:text-white text-sm font-light transition-colors duration-300 w-max animated-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-white/25 text-[10px] uppercase tracking-[4px] font-light">{t("info")}</span>
            <ul className="flex flex-col gap-3">
              {[
                { label: t("offer"), href: "/info/offer" },
                { label: t("privacy"), href: "/info/privacy" },
                { label: t("about"), href: "/about" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/30 hover:text-white text-sm font-light transition-colors duration-300 w-max animated-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-white/25 text-[10px] uppercase tracking-[4px] font-light">{t("contacts")}</span>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Instagram", href: "https://www.instagram.com/holyd_rip?igsh=bTJrODA2MDV2ZmR6&utm_source=qr", external: true },
                { label: "Telegram", href: "https://t.me/HolyDrip22", external: true },
                { label: "support@holydrip.com.ua", href: "mailto:holydrip99@gmail.com", external: false },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-white/30 hover:text-white text-sm font-light transition-colors duration-300 w-max animated-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className={`font-fraktur-en text-white/10 text-lg`}>In Swag We Trust.</p>
          <div className="flex items-center gap-8">
            <p className="text-white/15 text-[10px] uppercase tracking-[3px] font-light">© {currentYear} Holy Drip</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
