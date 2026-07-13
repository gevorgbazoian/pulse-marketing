import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('hy'); // Default to hy initially, updated dynamically

  useEffect(() => {
    // 1. Check local storage first
    const savedLang = localStorage.getItem('pulse_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'hy' || savedLang === 'ru')) {
      setLanguageState(savedLang);
      return;
    }

    // 2. Fallback to browser language preference (instant)
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    let detected = 'en'; // default fallback
    if (browserLang.startsWith('hy')) {
      detected = 'hy';
    } else if (browserLang.startsWith('ru') || browserLang.startsWith('be') || browserLang.startsWith('kk') || browserLang.startsWith('uk')) {
      detected = 'ru';
    }
    setLanguageState(detected);

    // 3. Fallback to IP geolocation detection (asynchronous check)
    fetch('https://freeipapi.com/api/json')
      .then(res => {
        if (!res.ok) throw new Error('Network response error');
        return res.json();
      })
      .then(data => {
        const code = data.countryCode;
        // If user hasn't set language preference manually, check country code
        if (!localStorage.getItem('pulse_lang')) {
          if (code === 'AM') {
            setLanguageState('hy');
          } else if (code === 'RU' || code === 'BY' || code === 'KZ') {
            setLanguageState('ru');
          }
        }
      })
      .catch(() => {
        // Quietly fail network error, continue using browser language
      });
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'hy' || lang === 'ru') {
      setLanguageState(lang);
      localStorage.setItem('pulse_lang', lang);
    }
  };

  // Helper function to fetch nested translations via path strings (e.g., 'nav.partners')
  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let value = translations[language];
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        // Fallback to English dictionary
        let fallback = translations['en'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return keyPath;
          }
        }
        return fallback;
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
