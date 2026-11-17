import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.dataset.theme = next;
    try {
      localStorage.setItem("ak-theme", next);
    } catch {
      /* storage can be unavailable in private contexts */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", next === "light" ? "#f4f4ef" : "#080808");
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      applyTheme(next);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem("ak-theme") as Theme | null;
      } catch {
        return null;
      }
    })();
    const initial: Theme = stored === "light" ? "light" : "dark";
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
