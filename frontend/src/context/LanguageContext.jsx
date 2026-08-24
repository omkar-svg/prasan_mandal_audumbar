import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'mr'); // Default to Marathi

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'mr' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
