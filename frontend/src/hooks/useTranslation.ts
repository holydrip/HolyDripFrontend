"use client";

import { useLocaleStore } from '@/store/locale.store';
import en from '../../messages/en.json';
import uk from '../../messages/uk.json';
import { useEffect, useState } from 'react';

const messages = { en, uk };

export function useTranslation(namespace: keyof typeof en) {
  const { locale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string) => {
    // Avoid hydration mismatch by rendering default (uk) before mount
    const activeLocale = mounted ? locale : 'uk';
    const dict = messages[activeLocale][namespace] as Record<string, string>;
    return dict?.[key] || key;
  };

  return { t, locale, mounted };
}
