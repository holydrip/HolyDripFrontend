"use client";

import { useLocaleStore } from "@/store/locale.store";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore();

  const handleSwitch = (newLocale: "uk" | "en") => {
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-2 text-[10px] tracking-[3px] uppercase">
      <button
        onClick={() => handleSwitch("uk")}
        className={`transition-colors hover:text-white ${locale === "uk" ? "text-white font-medium" : "text-white/40"}`}
      >
        UK
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className={`transition-colors hover:text-white ${locale === "en" ? "text-white font-medium" : "text-white/40"}`}
      >
        EN
      </button>
    </div>
  );
}
