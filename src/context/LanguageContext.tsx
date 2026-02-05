
import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../translations';

interface Translation {
  [key: string]: string | string[] | Translation;
}

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = 'en' }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  const t = useCallback((key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key "${key}" not found in language "${language}"`);
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error(`Error translating key "${key}":`, error);
      return key;
    }
  }, [language]);

  const tArray = useCallback((key: string): string[] => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key "${key}" not found in language "${language}"`);
          return [];
        }
      }

      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error(`Error translating array key "${key}":`, error);
      return [];
    }
  }, [language]);

  const contextValue: LanguageContextProps = {
    language,
    setLanguage,
    t,
    tArray,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide fallback values to prevent app crash
    console.error("useLanguage must be used within a LanguageProvider. Using fallback values.");
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string) => key,
      tArray: () => [],
    };
  }
  return context;
};
