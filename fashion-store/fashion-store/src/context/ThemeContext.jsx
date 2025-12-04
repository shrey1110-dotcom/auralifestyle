// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);
export const useTheme = () => useContext(ThemeCtx);

const LS_KEY = "aura_theme";

function ThemeProviderInner({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    // default: dark (keeps header black look)
    return "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, theme);
    } catch {}
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("theme-light");
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
      root.classList.add("theme-light");
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeCtx.Provider>;
}

// Single named export + default export (no duplicate `export` statements)
export { ThemeProviderInner as ThemeProvider };
export default ThemeProviderInner;
