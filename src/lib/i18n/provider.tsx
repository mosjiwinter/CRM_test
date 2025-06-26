'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations as enTranslations } from './locales/en';
import { translations as thTranslations } from './locales/th';

type Locale = 'en' | 'th';

const allTranslations = {
  en: enTranslations,
  th: thTranslations,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = allTranslations[locale];
    for (const key of keys) {
      if (current === undefined || typeof current !== 'object' || current === null) {
        return path;
      }
      current = current[key];
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
