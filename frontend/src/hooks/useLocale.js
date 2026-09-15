import { createContext, useContext, useEffect, useState } from "react";
const LocaleContext = createContext(null);
export const LocaleProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <LocaleContext.Provider value={{ language, setLanguage, t: (en, es) => language === "es" ? es : en }}>{children}</LocaleContext.Provider>;
};
export const useLocale = () => useContext(LocaleContext);
