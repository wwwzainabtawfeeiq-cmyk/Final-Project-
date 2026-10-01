import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("bf_lang");
    return saved === "en" ? "en" : "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("bf_lang", lang);
  }, [lang, dir]);

  const toggle = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));
  const t = (ar, en) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
